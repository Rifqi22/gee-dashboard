# Utility functions for Earth Engine processing and date handling.
# Functions:
#   - mask_s2_clouds: Masks clouds and snow/ice from Sentinel-2 images using the SCL band.
#   - get_last_12_months: Returns a sorted list of the last 12 months in YYYY-MM format.

import ee
from datetime import datetime, timedelta

def mask_s2_clouds(image: ee.Image) -> ee.Image:
    """Mask clouds and snow/ice from Sentinel-2 images using the SCL band."""
    scl = image.select("SCL")
    mask = (
        scl.neq(3)  # cloud shadow
        .And(scl.neq(7))  # cloud
        .And(scl.neq(8))  # cloud high probability
        .And(scl.neq(9))  # thin cirrus
        .And(scl.neq(10))  # snow/ice
    )
    return image.updateMask(mask).divide(10000)

def get_last_12_months():   
    # Get the last 12 months as YYYY-MM strings
    today = datetime.utcnow() 
    months = [] 
    for i in range(12): 
        date = today - timedelta(days=30 * i) 
        months.append(date.strftime("%Y-%m")) 
    return sorted(set(months))