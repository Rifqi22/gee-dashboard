import ee
import os
import json

EE_ACCOUNT = "gee-dashboard@gee-dashboard-project.iam.gserviceaccount.com"

def init_gee():
    key_json_str = os.environ.get("EE_KEY_JSON")
    if not key_json_str:
        raise ValueError("Environment variable EE_KEY_JSON is not set!")

    key_dict = json.loads(key_json_str)

    # Use ServiceAccountCredentials with key dict
    credentials = ee.ServiceAccountCredentials(
        key_dict["client_email"],
        key_file=None,
        private_key=key_dict["private_key"]
    )

    ee.Initialize(credentials)
    print("Earth Engine initialized in serverless mode")
