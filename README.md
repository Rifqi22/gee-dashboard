# Google Earth Engine Dashboard

A minimal interactive map dashboard for visualizing NDVI or LST using Google Earth Engine (GEE) and FastAPI backend.

## Public Repository

GitHub: [https://github.com/Rifqi22/gee-dashboard](https://github.com/Rifqi22/gee-dashboard)

---

## Setup & Run Instructions

### Backend (FastAPI)

1. **Navigate to /api folder**

   ```sh
   cd api
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

4. **Install dependencies**

   ```sh
   pip install -r requirements.txt
   ```

5. **Authenticate Google Earth Engine**

   use env for the key on local development

   create .env with thise value
   replace with the actual key

   EE_KEY_JSON='{"type":"service_account","project_id":"gee-dashboard-project","private_key_id":"50ff398012d085e0c7eb71101cca87a73e70d496","private_key":"-----BEGIN PRIVATE KEY-----\\n-----END PRIVATE KEY-----\n"}'

6. **Navigate to root / folder**
   Because it runs on a relative routing we should run the uvicorn on the root folder not inside /api

   ```sh
   cd ..
   ```

7. **Run the backend server**

   ```sh
   uvicorn api.main:app --reload
   ```

8. **Verify server**
   Open in browser: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

### Frontend (React + Vite)

1. **Navigate to /app folder**

   ```sh
   cd ../app
   ```

2. **Install dependencies**

   ```sh
   pnpm install
   ```

   or

   ```sh
   npm install
   ```

3. **Create the .env file with this value**
   VITE_API_BASE=http://127.0.0.1:8000/api

4. **Run the development server**

   ```sh
   pnpm dev
   ```

   or

   ```sh
   npm run dev
   ```

5. **Build for production**
   ```sh
   pnpm build
   ```
   or
   ```sh
   npm run build
   ```

---

## Explanation of Data Choice and Processing Steps

- **Data Choice**

  - **NDVI (Normalized Difference Vegetation Index):** Derived from Sentinel-2 imagery, NDVI is a widely used indicator for vegetation health and coverage.
  - **LST (Land Surface Temperature):** Sourced from MODIS satellite data, LST provides surface temperature information useful for climate and environmental monitoring.

- **Processing Steps**
  - **Cloud Masking:** Sentinel-2 images are processed to mask clouds and snow/ice using the SCL band for accurate NDVI calculation.
  - **Date Filtering:** Both NDVI and LST datasets are filtered by user-selected date ranges.
  - **Area Selection:** Users can select an Area of Interest (AOI) in GeoJSON format to clip and analyze data for specific regions.
  - **Aggregation:** Monthly means and min/max statistics are computed for visualization and legend purposes.
  - **Pixel Sampling:** The API supports querying pixel values and time series at specific coordinates.

---

## Deployed Dashboard

Live Demo: [https://gee-dashboard-ten.vercel.app/](https://gee-dashboard-ten.vercel.app/)

---
