import json
import ee
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.validator import validate_date_format
from services.utils import mask_s2_clouds

router = APIRouter()

@router.get("/tiles_lst")
def get_tile(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                dataset = dataset.clip(geometry)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        vis_params = {"min": 0, "max": 40, "palette": ["blue", "green", "yellow", "red"]}
        map_id = dataset.getMapId(vis_params)

        return {"tile_url": map_id["tile_fetcher"].url_format}
    except ee.EEException as e:
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")

@router.get("/tiles_ndvi")
def get_ndvi_tile(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        # Filter Sentinel-2 SR images
        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR")
            .filterDate(start_date, end_date)
            .map(mask_s2_clouds)
            .select(["B4", "B8"])
        )

        # Compute NDVI
        ndvi = collection.mean().normalizedDifference(["B8", "B4"]).rename("NDVI")

        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                ndvi = ndvi.clip(geometry)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        # Visualization parameters
        vis_params = {
            "min": -1,
            "max": 1,
            "palette": ["red", "white", "green"],  # NDVI color scale
        }

        map_id = ndvi.getMapId(vis_params)

        return {"tile_url": map_id["tile_fetcher"].url_format}
    except ee.EEException as e:
         raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")
