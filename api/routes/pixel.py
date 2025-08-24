
import ee
from fastapi import APIRouter, HTTPException, Query
from services.validator import validate_date_format
from services.utils import mask_s2_clouds

router = APIRouter()

@router.get("/pixel_value")
def get_pixel_value(lat: float, lng: float, start_date: str, end_date: str):
    # Validate date format
    validate_date_format(start_date)
    validate_date_format(end_date)

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
