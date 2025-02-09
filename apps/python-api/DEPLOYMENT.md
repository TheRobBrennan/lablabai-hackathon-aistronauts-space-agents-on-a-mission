# Python API Deployment Guide

## Vercel Deployment URL
The API is deployed at: https://lablabai-hackathon-aistronauts-space-agents-on-a-mission-r4qq.vercel.app

## Troubleshooting 404 Errors

If you see a NOT_FOUND error:

1. Verify the deployment settings in Vercel:
   - Build Command: None (use default)
   - Output Directory: None (use default)
   - Install Command: `pip install -r requirements.txt`

2. Check Vercel deployment logs:
   - Go to your project in Vercel
   - Click on the latest deployment
   - Check "Build Logs" and "Runtime Logs"

3. Test specific endpoints:
   - Health check: `/health`
   - API docs: `/docs`
   - Satellite endpoint: `/api/v1/satellite`

4. Environment Variables:
   - Verify all required environment variables are set in Vercel
   - Check that the API keys are valid

## Local Testing Before Deployment

Test the serverless configuration locally:
```bash
vercel dev
```

This will help identify any issues before deploying to production. 