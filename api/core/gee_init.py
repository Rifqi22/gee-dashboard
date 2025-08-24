import ee
import os
import json
import tempfile
from dotenv import load_dotenv

load_dotenv()  # only for local dev

EE_ACCOUNT = "gee-dashboard@gee-dashboard-project.iam.gserviceaccount.com"

def init_gee():
    key_json_str = os.environ.get("EE_KEY_JSON")
    if not key_json_str:
        raise ValueError("Environment variable EE_KEY_JSON is not set!")

    # Write JSON to a temp file (close it immediately)
    temp_path = os.path.join(tempfile.gettempdir(), "ee_key.json")
    with open(temp_path, "w", encoding="utf-8") as f:
        f.write(key_json_str)

    credentials = ee.ServiceAccountCredentials(EE_ACCOUNT, temp_path)
    ee.Initialize(credentials)
    print("Earth Engine initialized with service account.")
