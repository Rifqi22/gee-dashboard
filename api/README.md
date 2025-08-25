# GIS Dashboard API

This folder contains the backend API for the GIS Dashboard, providing endpoints for geospatial analysis using Google Earth Engine. The API is built with FastAPI and is organized into modular routes and services.

## Features

- Retrieve map tiles for Land Surface Temperature (LST) and Normalized Difference Vegetation Index (NDVI)
- Get pixel values for LST and NDVI at specific coordinates
- Fetch time series data for LST and NDVI for the last 12 months
- Obtain legend statistics (min/max) for LST and NDVI over a selected area

## Folder Structure

```
api/
│
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── core/
│   └── gee_init.py          # Google Earth Engine initialization
├── routes/
│   ├── legend.py            # Legend statistics endpoints
│   ├── pixel.py             # Pixel value endpoints
│   ├── tiles.py             # Map tile endpoints
│   └── timeseries.py        # Time series endpoints
├── services/
│   ├── utils.py             # Utility functions (cloud masking, date handling)
│   └── validator.py         # Input validation functions
└── __pycache__/             # Python cache files
```

## Setup

1. **Install dependencies**

   ```
   pip install -r requirements.txt
   ```

2. **Create a virtual environment**

   ```sh
   python -m venv venv
   ```

3. **Activate the virtual environment**

   - Using Powershell:
     ```sh
     venv\Scripts\Activate.ps1
     ```
   - Using Command Prompt:
     ```sh
     venv\Scripts\activate.bat
     ```

4. **Configure Google Earth Engine**

   use env for the key on local development

   create .env with thise value
   replace with the actual key

   EE_KEY_JSON='{"type":"service_account","project_id":"gee-dashboard-project","private_key_id":"50ff398012d085e0c7eb71101cca87a73e70d496","private_key":"-----BEGIN PRIVATE KEY-----\\n-----END PRIVATE KEY-----\n"}'

5. **Navigate back to root / folder**
   Because it runs on a relative routing we should run the uvicorn on the root folder not inside /api

   ```sh
   cd ..
   ```

6. **Run the API**
   ```
    uvicorn api.main:app --reload
   ```

## Endpoints

- `/tiles_lst`  
  Returns map tile URL for LST.

- `/tiles_ndvi`  
  Returns map tile URL for NDVI.

- `/pixel_value`  
  Returns LST and NDVI values for a given latitude and longitude.

- `/timeseries`  
  Returns time series data for LST and NDVI for the last 12 months.

- `/legend_stats_lst`  
  Returns min/max LST statistics for a selected area.

- `/legend_stats_ndvi`  
  Returns min/max NDVI statistics for a selected area.

## Notes

- All endpoints require valid date formats (`YYYY-MM`).
- AOI (Area of Interest) should be provided as GeoJSON for relevant endpoints.
- Error handling is implemented for invalid inputs and Earth Engine exceptions.

## License

See repository
