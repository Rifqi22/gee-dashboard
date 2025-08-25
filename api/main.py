from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.gee_init import init_gee
from .routes import tiles, legend, pixel, timeseries

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
app.include_router(tiles.router, prefix="/api")
app.include_router(legend.router, prefix="/api")
app.include_router(pixel.router, prefix="/api")
app.include_router(timeseries.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    try:
        init_gee()
    except Exception as e:
        print("GEE init failed:", e)

# Define root endpoint
@app.get("/")
def root():
    return {"message": "GEE Dashboard Backend is running"}