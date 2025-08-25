# This module provides FastAPI routes for retrieving map tile URLs for LST and NDVI datasets.
# It uses Google Earth Engine to process satellite imagery and generate visualization tiles.
# Endpoints:
#   - /tiles_lst: Returns a tile URL for Land Surface Temperature (LST).
#   - /tiles_ndvi: Returns a tile URL for Normalized Difference Vegetation Index (NDVI).
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

router = APIRouter()

@router.get("/tiles_lst")
def get_tile(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    # Validate input date format
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        # Load MODIS LST data, filter by date, compute mean, convert to Celsius
        dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        # Clip dataset to AOI if provided
        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                dataset = dataset.clip(geometry)
            except Exception as e:
                # AOI format error handling
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        # Visualization parameters for LST
        vis_params = {"min": 0, "max": 40, "palette": ["blue", "green", "yellow", "red"]}
        map_id = dataset.getMapId(vis_params)

        # Return tile URL for visualization
        return {"tile_url": map_id["tile_fetcher"].url_format}
    except ee.EEException as e:
        # Earth Engine error handling
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")

@router.get("/tiles_ndvi")
def get_ndvi_tile(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    # Validate input date format
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        # Load Sentinel-2 SR images, filter by date, mask clouds, select bands
        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR")
            .filterDate(start_date, end_date)
            .map(mask_s2_clouds)
            .select(["B4", "B8"])
        )

        # Compute NDVI from bands
        ndvi = collection.mean().normalizedDifference(["B8", "B4"]).rename("NDVI")

        # Clip NDVI to AOI if provided
        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                ndvi = ndvi.clip(geometry)
            except Exception as e:
                # AOI format error handling
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        # Visualization parameters for NDVI
        vis_params = {
            "min": -1,
            "max": 1,
            "palette": ["red", "white", "green"],  # NDVI color scale
        }

        map_id = ndvi.getMapId(vis_params)

        # Return tile URL for visualization
        return {"tile_url": map_id["tile_fetcher"].url_format}
    except ee.EEException as e:
        # Earth Engine error handling
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")
