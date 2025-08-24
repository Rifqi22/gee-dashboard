from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import ee
import re
import json
from datetime import datetime, timedelta

# Authenticate and Initialize Earth Engine
ee.Authenticate()
ee.Initialize(project='gee-dashboard-project')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "GEE Dashboard Backend is running"}

# get the tiles image from the given date ex: 2025-01
@app.get("/tiles_lst")
def get_tile(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    for d in [start_date, end_date]:
            if not re.match(r"^\d{4}-\d{2}$", d):
                raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM format")


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


@app.get("/pixel_value")
def get_pixel_value(lat: float, lng: float, start_date: str, end_date: str):
    # Validate date format
    for d in [start_date, end_date]:
        if not re.match(r"^\d{4}-\d{2}$", d):
            raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM format")

    point = ee.Geometry.Point([lng, lat])

    try:
        # LST: MODIS Land Surface Temperature
        lst_dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        lst_value = lst_dataset.sample(point, 1000).first().get("LST_Day_1km").getInfo()

        # NDVI: Sentinel-2 NDVI with cloud masking
        ndvi_dataset = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
            .filterDate(f"{start_date}-01", f"{end_date}-28") \
            .map(mask_s2_clouds) \
            .map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI")) \
            .mean().select("NDVI")

        ndvi_value = ndvi_dataset.sample(point, 10).first().get("NDVI").getInfo()

        return {
            "lst_value": lst_value,
            "ndvi_value": ndvi_value
        }

    except ee.EEException as e:
        raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")

def mask_s2_clouds(image):
    """Mask clouds and cirrus using the SCL band (Scene Classification)."""
    scl = image.select("SCL")
    # Keep pixels that are not cloud/shadow/snow
    mask = scl.neq(3).And(  # cloud shadow
           scl.neq(7)).And( # cloud
           scl.neq(8)).And( # cloud high probability
           scl.neq(9)).And( # thin cirrus
           scl.neq(10))     # snow/ice
    return image.updateMask(mask).divide(10000)  # scale reflectance to 0-1

# Generate a tile URL for NDVI for a given month. date format: 'YYYY-MM'
@app.get("/tiles_ndvi")
def get_ndvi_tile(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    for d in [start_date, end_date]:
            if not re.match(r"^\d{4}-\d{2}$", d):
                raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM format")

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

# LEGEND
@app.get("/legend_stats_lst")
def get_legend_stats_lst(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    for d in [start_date, end_date]:
        if not re.match(r"^\d{4}-\d{2}$", d):
            raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM format")

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

@app.get("/legend_stats_ndvi")
def get_legend_stats_ndvi(start_date: str, end_date: str, aoi: Optional[str] = Query(None)):
    for d in [start_date, end_date]:
        if not re.match(r"^\d{4}-\d{2}$", d):
            raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM format")

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

def get_last_12_months():
    today = datetime.utcnow()
    months = []
    for i in range(12):
        date = today - timedelta(days=30 * i)
        months.append(date.strftime("%Y-%m"))
    return sorted(set(months))

@app.get("/timeseries")
def get_timeseries(lat: float, lng: float):
    point = ee.Geometry.Point([lng, lat])
    months = get_last_12_months()

    lst_values = []
    ndvi_values = []

    for month in months:
        start = f"{month}-01"
        end = f"{month}-28"

        # LST
        lst = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(start, end) \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

        lst_sample = lst.sample(point, 1000).first().get("LST_Day_1km")

        # NDVI
        ndvi = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
            .filterDate(start, end) \
            .map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI")) \
            .mean().select("NDVI")

        ndvi_sample = ndvi.sample(point, 10).first().get("NDVI")

        try:
            lst_val = lst_sample.getInfo()
            ndvi_val = ndvi_sample.getInfo()
        except:
            lst_val = None
            ndvi_val = None

        lst_values.append({"month": month, "value": lst_val})
        ndvi_values.append({"month": month, "value": ndvi_val})

    return {
        "lst": lst_values,
        "ndvi": ndvi_values
    }
