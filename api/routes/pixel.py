# This module provides FastAPI routes for retrieving pixel values for LST and NDVI datasets.
# It uses Google Earth Engine to process satellite imagery and extract pixel values at a given latitude and longitude.
# Endpoints:
#   - /pixel_value: Returns LST and NDVI values for a specific point.
# Query parameters:
#   - lat: Latitude of the point.
#   - lng: Longitude of the point.
#   - start_date: Start date in YYYY-MM format.
#   - end_date: End date in YYYY-MM format.
# Dependencies:
#   - services.validator.validate_date_format: Validates date format.
#   - services.utils.mask_s2_clouds: Masks clouds in Sentinel-2 imagery.
# Error handling:
#   - Returns HTTP 500 for Earth Engine errors.

import ee
from fastapi import APIRouter, HTTPException, Query
from ..services.validator import validate_date_format
from ..services.utils import mask_s2_clouds
from ..core.gee_init import init_gee


router = APIRouter()

@router.get("/pixel_value")
def get_pixel_value(lat: float, lng: float, start_date: str, end_date: str):
    if not ee.data._initialized:
        init_gee() 
    # Validate date format
    validate_date_format(start_date)
    validate_date_format(end_date)

    # Create a point geometry from latitude and longitude
    point = ee.Geometry.Point([lng, lat])

    try:
        # Get mean LST value at the point for the given date range
        lst_dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        lst_value = lst_dataset.sample(point, 1000).first().get("LST_Day_1km").getInfo()

        # Get mean NDVI value at the point for the given date range, with cloud masking
        ndvi_dataset = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .map(mask_s2_clouds) \
            .map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI")) \
            .mean().select("NDVI")

        ndvi_value = ndvi_dataset.sample(point, 10).first().get("NDVI").getInfo()

        # Return both LST and NDVI values for the point
        return {
            "lst_value": lst_value,
            "ndvi_value": ndvi_value
        }

    except ee.EEException as e:
        # Handle Earth Engine errors
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")
