from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import ee
import re

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
def get_tile(date: str, aoi: Optional[str] = Query(None)):
    if not re.match(r"^\d{4}-\d{2}$", date):
        raise HTTPException(status_code=400, detail="Date must be in YYYY-MM format")

    try:
        dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{date}-01", f"{date}-28") \
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
def get_pixel_value(lat: float, lng: float, date: str):
    dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
        .filterDate(f"{date}-01", f"{date}-28") \
        .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15)

    # Sample the value at the given point
    point = ee.Geometry.Point([lng, lat])
    value = dataset.sample(point, 1000).first().get("LST_Day_1km").getInfo()
    return {"value": value}

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
def get_ndvi_tile(date: str, aoi: Optional[str] = Query(None)):
    if not re.match(r"^\d{4}-\d{2}$", date):
        raise HTTPException(status_code=400, detail="Date must be in YYYY-MM format")
    
    try:
        start_date = f"{date}-01"
        end_date = f"{date}-28"

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
            "min": 0,
            "max": 1,
            "palette": ["red", "white", "green"],  # NDVI color scale
        }

        map_id = ndvi.getMapId(vis_params)

        return {"tile_url": map_id["tile_fetcher"].url_format}
    except ee.EEException as e:
         raise HTTPException(status_code=500, detail=f"Earth Engine error: {str(e)}")