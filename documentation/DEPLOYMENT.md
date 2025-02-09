# Deployment Guide

## Vercel Configuration

### Prerequisites
1. GitHub repository with our Next.js application
2. Vercel account connected to GitHub
3. Mapbox account for map functionality

### Initial Setup
1. Create new project in Vercel
2. Select the GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `apps/nextjs-web`
   - Build Command: Should be auto-detected
   - Output Directory: Should be auto-detected

### Environment Variables

#### Frontend (Next.js)
Add the following to your Vercel project settings:
```
# Required
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app

# Optional (defaults provided)
NEXT_PUBLIC_API_HOST=localhost
NEXT_PUBLIC_API_PORT=8000
```

#### Backend (Python API)
Configure in the Python API Vercel project:
```
# Required
OPENAI_API_KEY=your_openai_key_here
NASA_API_KEY=your_nasa_key_here

# Optional
SENTINEL_HUB_API_KEY=your_sentinel_hub_key_here
PORT=8000
HOST=0.0.0.0
```

### Local Development
1. Copy environment examples:
   ```bash
   # Frontend
   cd apps/nextjs-web
   cp .env.example .env

   # Backend
   cd apps/python-api
   cp .env.example .env
   ```

2. Edit the `.env` files with your actual values

### Production URLs
- Frontend: https://lablabai-hackathon-aistronauts-space-agents-on-a-mission.vercel.app
- Backend: https://lablabai-hackathon-aistronauts-space-agents-on-a-mission-r4qq.vercel.app

## Mapbox Configuration

### Getting an Access Token
1. Create a Mapbox account at https://account.mapbox.com/auth/signup/
2. Navigate to Account → Access Tokens
3. Create a new **public** token with the following scopes:
   - styles:tiles
   - styles:read
   - fonts:read
   - datasets:read (optional)
   - vision:read (optional)

Note: Ensure you're creating a public access token (starts with `pk.`), not a secret token (starts with `sk.`).

### Deployment Settings
- Production Branch: `main`
- Preview Deployments: Enabled for all branches
- Automatic Deployments: Enabled

### Production URL
The application is deployed and accessible at:
https://lablabai-hackathon-aistronauts-space-agents-on-a-mission.vercel.app

## Mapbox Configuration

### Getting an Access Token
1. Create a Mapbox account at https://account.mapbox.com/auth/signup/
2. Navigate to Account → Access Tokens
3. Create a new **public** token with the following scopes:
   - styles:tiles
   - styles:read
   - fonts:read
   - datasets:read (optional)
   - vision:read (optional)

Note: Ensure you're creating a public access token (starts with `pk.`), not a secret token (starts with `sk.`).

### Local Development Setup
1. Copy `.env.example`