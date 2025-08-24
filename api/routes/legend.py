import json
import ee
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.validator import validate_date_format
from services.utils import mask_s2_clouds

router = APIRouter()

@router.get("/legend_stats_lst")
def get_legend_stats_lst(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        image = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                image = image.clip(geometry)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        stats = image.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=image.geometry(),
            scale=1000,
            maxPixels=1e13
        ).getInfo()

        return {
            "min": round(stats["LST_Day_1km_min"], 2),
            "max": round(stats["LST_Day_1km_max"], 2)
        }

    except ee.EEException as e:
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")

@router.get("/legend_stats_ndvi")
def get_legend_stats_ndvi(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    validate_date_format(start_date)
    validate_date_format(end_date)

    try:
        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterDate(f"{start_date}-01", f"{end_date}-28")
            .map(mask_s2_clouds)
            .map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI"))
        )

        ndvi = collection.mean().select("NDVI")

        if aoi:
            try:
                aoi_json = json.loads(aoi)
                geometry = ee.Geometry(aoi_json)
                ndvi = ndvi.clip(geometry)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid AOI format: {str(e)}")

        stats = ndvi.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=ndvi.geometry(),
            scale=10,
            maxPixels=1e13
        ).getInfo()

        return {
            "min": round(stats["NDVI_min"], 2),
            "max": round(stats["NDVI_max"], 2)
        }

    except ee.EEException as e:
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")
