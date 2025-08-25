from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.gee_init import init_gee
from .routes import tiles, legend, pixel, timeseries
from mangum import Mangum

# Create FastAPI app
app = FastAPI(title="GEE Dashboard Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tiles.router, prefix="")
app.include_router(legend.router, prefix="")
app.include_router(pixel.router, prefix="")
app.include_router(timeseries.router, prefix="")

# <<— Put startup event here
@app.on_event("startup")
async def startup_event():
    init_gee()  # Earth Engine initialization runs once on function startup

# Define root endpoint
@app.get("/")
def root():
    return {"message": "GEE Dashboard Backend is running"}

# Mangum handler must be at the end
handler = Mangum(app)
