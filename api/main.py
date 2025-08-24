from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.gee_init import init_gee
from routes import tiles, legend, pixel, timeseries

# Initialize Earth Engine
init_gee()

app = FastAPI(title="GEE Dashboard Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "GEE Dashboard Backend is running"}

# Include route groups
app.include_router(tiles.router, prefix="")
app.include_router(legend.router, prefix="")
app.include_router(pixel.router, prefix="")
app.include_router(timeseries.router, prefix="")
