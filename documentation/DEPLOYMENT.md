# Deployment Guide

## Vercel Configuration

### Prerequisites
1. GitHub repository with our Next.js application
2. Vercel account connected to GitHub

### Initial Setup
1. Create new project in Vercel
2. Select the GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `apps/nextjs-web`
   - Build Command: Should be auto-detected
   - Output Directory: Should be auto-detected

### Environment Variables
Currently, no environment variables are required for the initial deployment.

### Deployment Settings
- Production Branch: `main`
- Preview Deployments: Enabled for all branches
- Automatic Deployments: Enabled

### Production URL
The application is deployed and accessible at:
https://lablabai-hackathon-aistronauts-space-agents-on-a-mission.vercel.app

## Local Development
Reference our Docker setup in the root directory:
- Use `npm start` to run the application locally
- Access the app at http://localhost:3000

## Deployment Workflow
1. Create feature branch
2. Make changes and test locally using Docker
3. Create PR to main
4. Vercel automatically creates preview deployment
5. Review preview deployment
6. Merge to main triggers production deployment

## Monitoring
- Vercel Dashboard: Monitor builds and deployments
- Vercel Analytics: Track performance metrics (to be configured) 