from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app.routes import satellite

app = FastAPI(
    title="Satellite Imagery Analysis API",
    description="API for analyzing satellite imagery using AI agents",
    version="0.1.0"
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(satellite.router, prefix="/api/v1/satellite")

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 