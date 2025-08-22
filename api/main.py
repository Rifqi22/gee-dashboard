from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ee

# Authenticate and Initialize Earth Engine
ee.Authenticate()
ee.Initialize(project='gee-dashboard-project')

app = FastAPI()

@app.get("/")
def root():
    return {"message": "GEE Dashboard Backend is running"}

# get the tiles image from the given date ex: 2025-01
@app.get("/tiles/{date}")
def get_tile(date: str):
    # call the modis data then filter it based on the date
    dataset = ee.ImageCollection("MODIS/061/MOD11A2") \
        .filterDate(f"{date}-01", f"{date}-28") \
        .mean().select("LST_Day_1km").multiply(0.02).subtract(273.15) #calculate the average of LST and convert it into Celcius (default Kelvin)

    vis_params = {"min": 0, "max": 40, "palette": ["blue", "green", "yellow", "red"]}
    map_id = dataset.getMapId(vis_params)

    # Return the tile url 
    # ex :  https://earthengine.googleapis.com/v1/projects/gee-dashboard-project/maps/b4adff9e71301b7e68645f7bf356ec49-6ac08859643006d0a476aaa1bfd657d3/tiles/{z}/{x}/{y}
    return {"tile_url": map_id["tile_fetcher"].url_format}