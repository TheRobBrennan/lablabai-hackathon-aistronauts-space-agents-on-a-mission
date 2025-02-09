# AIstronauts Hackathon - MVP Plan

## Project: **Satellite Imagery Analysis Platform** 🛰️

### **Overview**
This project aims to build an AI-powered platform that analyzes satellite imagery to detect changes in Earth's features. The system will use multiple AI agents to process different aspects (vegetation, urban development, weather patterns) and generate reports/visualizations.

## **Tech Stack**
### **Frontend**
- **Next.js 15 (App Router)** – for UI and API integration
- **Tailwind CSS** – for styling
- **Mapbox / Leaflet.js** – for interactive map integration
- **Vercel** – for hosting the Next.js application

### **Backend**
- **FastAPI (Python)** – for handling image processing & AI
- **CrewAI** – for AI agent orchestration
- **Docker** – for local development consistency
- **Vercel (Serverless Python Functions)** – for backend deployment

### **Authentication**
- **Google Social Login (preferred)** – for lightweight authentication
- **Alternative:** On-the-fly password issuance with SQLite for local user data storage
- **Vercel Analytics** – for tracking interactions while maintaining privacy best practices

## **APIs & External Services**
| API/Service | Purpose |
|------------|---------|
| **NASA Earthdata API** | Fetch real-time satellite imagery |
| **Sentinel Hub API** | High-resolution Earth observation data |
| **Google Earth Engine API** | Satellite image processing & AI-ready datasets |
| **OpenWeatherMap API** | Fetch weather data for analysis correlation |
| **Hugging Face Inference API** | Ready-to-use AI models for image processing |
| **Replicate API** | AI models for geospatial & satellite analysis |
| **Mapbox / Google Maps API** | Interactive map integration & overlays |

## **MVP Feature Breakdown**
### **Core MVP Features**
1. **Basic Map UI** – Users can see a default geographic region (location search will come later).
2. **Fetch & Display Satellite Imagery** – Data sourced from NASA, Sentinel Hub.
3. **AI-Powered Change Detection** – Uses pre-trained models to detect deforestation, urban expansion, and climate change indicators.
4. **Map Overlays for Insights** – AI-generated results will be visually represented on the map.
5. **AI-Generated Reports** – CrewAI agents summarize findings into readable insights.
6. **Basic Authentication System** – Google login or lightweight password issuance for tracking & telemetry.

### **Quick Wins for MVP**
- Use **JSON-based default locations** for faster API calls and testing.
- Integrate **Hugging Face models via API** instead of training AI models from scratch.
- Preload **example satellite images** to showcase functionality without real-time API delays.

## **Deployment Strategy**
| Component | Tech Stack | Deployment |
|-----------|-----------|------------|
| 🌍 **Frontend (UI)** | Next.js 15 + Tailwind + Mapbox | Deployed to Vercel |
| 🛰 **Satellite Image Fetcher** | Python (FastAPI) | Vercel Serverless Function |
| 🤖 **AI Image Processor** | CrewAI (Python) + Hugging Face | Vercel Serverless Function |
| 🔐 **Auth System** | NextAuth.js (Google Login) or SQLite-based auth | Deployed within Next.js app |

## **CrewAI Agent Setup**
| Agent Role | Responsibility |
|-----------|---------------|
| 🛰️ **Image Fetcher** | Retrieves satellite imagery from NASA/Sentinel APIs |
| 🔍 **Change Detector** | Compares past vs. recent imagery to identify environmental changes |
| 🌦️ **Weather Context** | Fetches weather data to correlate insights |
| 🎨 **Map Overlay Creator** | Generates visual overlays for detected changes |
| 📝 **Report Generator** | Summarizes insights into readable reports |

## **Execution Plan (Hackathon Schedule)**
| Time | Task |
|------|------|
| **11:15pm - 12:15am** | Set up Next.js 15 + Docker + Tailwind UI |
| **12:15am - 1:30am** | Basic map UI + JSON default locations |
| **1:30am - 3:00am** | Python API (FastAPI) to fetch satellite data |
| **3:00am - 4:30am** | AI-powered image analysis (CrewAI + Hugging Face) |
| **4:30am - 6:00am** | Overlays, authentication, reports, and polish MVP |

## **Next Steps**
- [ ] Initialize Next.js 15 project with Docker & Tailwind setup
- [ ] Implement basic Mapbox / Leaflet UI with JSON-based locations
- [ ] Develop FastAPI service for satellite image retrieval
- [ ] Integrate AI models for change detection using Hugging Face
- [ ] Implement Google login or alternative lightweight authentication system
- [ ] Deploy Python backend to Vercel
- [ ] Finalize AI-generated reports and overlays

---
This plan prioritizes **quick wins** while ensuring a **visually engaging and AI-driven experience** that will impress the hackathon judges. 🚀🔥

