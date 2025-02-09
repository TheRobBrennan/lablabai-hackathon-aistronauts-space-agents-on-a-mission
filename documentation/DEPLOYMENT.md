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
3. Create a new token with the following scopes:
   - styles:read
   - styles:tiles
   - fonts:read
   - map:read

### Local Development Setup
1. Copy `.env.example` to `.env.local` in the `apps/nextjs-web` directory
2. Add your Mapbox access token to `.env.local`:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```
3. Restart the development server if it's running

### Vercel Environment Setup
1. Go to your project settings in Vercel
2. Navigate to Environment Variables
3. Add the variable:
   - Name: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - Value: Your Mapbox access token
4. Redeploy the application if needed

## Local Development
Reference our Docker setup in the root directory:
- Use `npm start` to run the application locally
- Access the app at http://localhost:3000

### Environment Files
- `.env.example` - Template for required environment variables
- `.env.local` - Local development variables (git-ignored)
- `.env.test` - Testing environment variables (if needed)
- `.env.production` - Production overrides (if needed)

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
- Mapbox Usage: Monitor map usage in Mapbox dashboard

## Troubleshooting

### Common Issues
1. Map not loading
   - Check if Mapbox token is properly set in environment variables
   - Verify token has correct scopes enabled
   - Check browser console for errors

2. Local development issues
   - Ensure `.env.local` exists with required variables
   - Try running `docker compose down` and then `npm start`
   - Clear Docker cache if needed: `npm run docker:clean`

3. Deployment issues
   - Verify environment variables are set in Vercel
   - Check build logs for any errors
   - Ensure Next.js configuration is correct

### Getting Help
- Mapbox Documentation: https://docs.mapbox.com/
- Next.js Documentation: https://nextjs.org/docs
- Vercel Documentation: https://vercel.com/docs
