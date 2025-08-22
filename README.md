Google Earth Engine Dashboard

A minimal interactive map dashboard for visualizing NDVI or LST using Google Earth Engine (GEE) and FastAPI backend.

Clone the Repository
git clone https://github.com/Rifqi22/gee-dashboard.git
cd gee-dashboard

Backend (FastAPI)

1. Navigate to backend folder
   cd backend

2. Create a virtual environment
   python -m venv venv

3. Activate the virtual environment

Using Powershell:
venv\Scripts\Activate.ps1

Using Command Prompt (cmd.exe)
venv\Scripts\activate.bat

4. Install dependencies
   pip install -r requirements.txt

5. Authenticate Google Earth Engine
   earthengine authenticate

Log in with your approved Google account and copy the authorization code into the terminal.

6. Run the backend server
   uvicorn main:app --reload --port 8000

7. Verify server
   Open in browser:
   http://127.0.0.1:8000/
