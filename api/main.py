from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ee

# Authenticate and Initialize Earth Engine
ee.Authenticate()
ee.Initialize(project='gee-dashboard-project')

app = FastAPI()

@app.get("/")
def root():
    return {"message": "GEE Dashboard Backend is running"}