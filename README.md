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

   ```sh
   earthengine authenticate
   ```

   Log in with your approved Google account and copy the authorization code into the terminal.

6. **Run the backend server**

   ```sh
   uvicorn main:app --reload --port 8000
   ```

7. **Verify server**
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

3. **Run the development server**

   ```sh
   pnpm dev
   ```

   or

   ```sh
   npm run dev
   ```

4. **Build for production**
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

Live Demo: [https://gee-dashboard-demo.netlify.app/](https://gee-dashboard-demo.netlify.app/)

---
