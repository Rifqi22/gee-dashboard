
import ee
from fastapi import APIRouter, HTTPException, Query
from services.utils import get_last_12_months

router = APIRouter()

@router.get("/timeseries")
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
