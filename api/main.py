from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
@app.get("/tiles/{date}")
def get_tile(date: str):
    # validate the date using regex
    if not re.match(r"^\d{4}-\d{2}$", date):
        raise HTTPException(status_code=400, detail="Date must be in YYYY-MM format")
    
    try:
        # call the modis data then filter it based on the date
        dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
            .filterDate(f"{date}-01", f"{date}-28") \
            .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15) #calculate the average of LST and convert it into Celcius (default Kelvin)

        vis_params = {"min": 0, "max": 40, "palette": ["blue", "green", "yellow", "red"]}
        map_id = dataset.getMapId(vis_params)

        # Return the tile url 
        # This url is a ready used for the front end, it contain all the metadata that it needs like the id, param vis etc
        # ex :  https://earthengine.googleapis.com/v1/projects/gee-dashboard-project/maps/b4adff9e71301b7e68645f7bf356ec49-6ac08859643006d0a476aaa1bfd657d3/tiles/{z}/{x}/{y}
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
