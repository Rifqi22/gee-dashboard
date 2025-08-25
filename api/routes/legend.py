# This module defines FastAPI routes for retrieving legend statistics for LST and NDVI datasets.
# It uses Google Earth Engine to process satellite imagery and calculate min/max values over a specified area and date range.
# Endpoints:
#   - /legend_stats_lst: Returns min/max Land Surface Temperature (LST) statistics.
#   - /legend_stats_ndvi: Returns min/max Normalized Difference Vegetation Index (NDVI) statistics.
# Query parameters:
#   - start_date: Start date in YYYY-MM format.
#   - end_date: End date in YYYY-MM format.
#   - aoi: Optional Area of Interest in GeoJSON format.
# Dependencies:
#   - services.validator.validate_date_format: Validates date format.
#   - services.utils.mask_s2_clouds: Masks clouds in Sentinel-2 imagery.
# Error handling:
#   - Returns HTTP 400 for invalid AOI format.
#   - Returns HTTP 500 for Earth Engine errors.

import json
import ee
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..services.validator import validate_date_format
from ..services.utils import mask_s2_clouds
from ..core.gee_init import init_gee

router = APIRouter()

@router.get("/legend_stats_lst")
def get_legend_stats_lst(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    if not ee.data._initialized:
        init_gee() 
    # Validate input date format
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        # Load MODIS LST data, filter by date, compute mean, convert to Celsius
        image = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        # Clip image to AOI if provided
        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                image = image.clip(geometry)
            except Exception as e:
                # AOI format error handling
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        # Calculate min and max LST values in the region
        stats = image.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=image.geometry(),
            scale=1000,
            maxPixels=1e13
        ).getInfo()

        # Return rounded min and max values
        return {
            "min": round(stats["LST_Day_1km_min"], 2),
            "max": round(stats["LST_Day_1km_max"], 2)
        }

    except ee.EEException as e:
        # Earth Engine error handling
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")

@router.get("/legend_stats_ndvi")
def get_legend_stats_ndvi(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    # Validate input date format
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        # Load Sentinel-2 SR images, filter by date, mask clouds, compute NDVI
        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterDate(f"{start_date}-01", f"{end_date}-28")
            .map(mask_s2_clouds)
            .map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI"))
        )

        ndvi = collection.mean().select("NDVI")

        # Clip NDVI to AOI if provided
        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                ndvi = ndvi.clip(geometry)
            except Exception as e:
                # AOI format error handling
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        # Calculate min and max NDVI values in the region
        stats = ndvi.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=ndvi.geometry(),
            scale=10,
            maxPixels=1e13
        ).getInfo()

        # Return rounded min and max values
        return {
            "min": round(stats["NDVI_min"], 2),
            "max": round(stats["NDVI_max"], 2)
        }

    except ee.EEException as e:
        # Earth Engine error handling
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")
