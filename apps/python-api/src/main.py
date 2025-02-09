from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Satellite Imagery Analysis API",
    description="API for analyzing satellite imagery using AI agents",
    version="0.1.0"
)

# Update CORS for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://lablabai-hackathon-aistronauts-space-agents-on-a-mission.vercel.app"  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from .app.routes import satellite
app.include_router(satellite.router, prefix="/api/v1/satellite")

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 