import ee
import os
import json
import tempfile

EE_ACCOUNT = "gee-dashboard@gee-dashboard-project.iam.gserviceaccount.com"

def init_gee():
    key_json_str = os.environ.get("EE_KEY_JSON")
    if not key_json_str:
        raise ValueError("Environment variable EE_KEY_JSON is not set!")

    # Write the JSON string to a temporary file
    with tempfile.NamedTemporaryFile(mode="w+", suffix=".json", delete=False) as f:
        f.write(key_json_str)
        f.flush()
        key_file_path = f.name

    credentials = ee.ServiceAccountCredentials(
        EE_ACCOUNT,
        key_file=key_file_path
    )

    ee.Initialize(credentials)
    print("Earth Engine initialized in serverless mode")
