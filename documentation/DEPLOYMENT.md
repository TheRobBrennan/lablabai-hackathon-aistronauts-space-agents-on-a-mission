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
Add the following to your Vercel project settings:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

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