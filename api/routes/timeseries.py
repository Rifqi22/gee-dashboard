# This module provides FastAPI routes for retrieving time series data for LST and NDVI at a specific location.
# It uses Google Earth Engine to process satellite imagery and extract monthly pixel values for the last 12 months.
# Endpoints:
#   - /timeseries: Returns LST and NDVI time series for a specific point.
# Query parameters:
#   - lat: Latitude of the point.
#   - lng: Longitude of the point.
# Dependencies:
#   - services.utils.get_last_12_months: Generates a list of the last 12 months in YYYY-MM format.
# Error handling:
#   - Returns None for missing pixel values.

import ee
from fastapi import APIRouter, HTTPException, Query
from ..services.utils import get_last_12_months

router = APIRouter()

@router.get("/timeseries")
def get_timeseries(lat: float, lng: float):
    # Create a point geometry from latitude and longitude
    point = ee.Geometry.Point([lng, lat])
    # Get the last 12 months in YYYY-MM format
    months = get_last_12_months()

    lst_values = []
    ndvi_values = []

    for month in months:
        start = f"{month}-01"
        end = f"{month}-28"

        # Get monthly mean LST (Land Surface Temperature) in Celsius
        lst = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(start, end) \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        # Sample LST value at the given point
        lst_sample = lst.sample(point, 1000).first().get("LST_Day_1km")

        # Get monthly mean NDVI (Normalized Difference Vegetation Index)
        ndvi = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
            .filterDate(start, end) \
            .map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI")) \
            .mean().select("NDVI")

        # Sample NDVI value at the given point
        ndvi_sample = ndvi.sample(point, 10).first().get("NDVI")

        try:
            # Extract pixel values for LST and NDVI
            lst_val = lst_sample.getInfo()
            ndvi_val = ndvi_sample.getInfo()
        except:
            # If pixel value is missing, set to None
            lst_val = None
            ndvi_val = None

        # Append results for each month
        lst_values.append({"month": month, "value": lst_val})
        ndvi_values.append({"month": month, "value": ndvi_val})

    # Return time series data for LST and NDVI
    return {
        "lst": lst_values,
        "ndvi": ndvi_values
    }
