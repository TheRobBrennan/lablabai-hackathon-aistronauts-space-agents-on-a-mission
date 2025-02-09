# Satellite Imagery Analysis API

Backend service for analyzing satellite imagery using AI agents and CrewAI.

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys:
   # - OPENAI_API_KEY
   # - NASA_API_KEY
   # - SENTINEL_HUB_API_KEY (optional)
   ```

2. **Run with Docker**
   ```bash
   # From project root
   docker-compose up python-api
   ```

3. **Verify Setup**
   - Health check: http://localhost:8000/health
   - API docs: http://localhost:8000/docs
   - Satellite endpoint: http://localhost:8000/api/v1/satellite

## Local Development

1. Create Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   uvicorn src.main:app --reload
   ```

## Project Structure

```
src/
├── main.py          # FastAPI application
├── config.py        # Settings management
└── app/
    ├── routes/      # API endpoints
    └── services/    # Business logic
```

## API Documentation

- **GET /health**
  - Health check endpoint
  - Returns: `{"status": "healthy"}`

- **GET /api/v1/satellite**
  - Basic satellite information endpoint
  - Returns: `{"message": "Satellite route working"}`

## Environment Variables

Required in `.env`:
- `OPENAI_API_KEY`: For CrewAI agents
- `NASA_API_KEY`: For NASA Earth observation data
- `SENTINEL_HUB_API_KEY`: Optional, for additional imagery

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests (coming soon)
4. Submit a pull request

## Troubleshooting

1. **Module not found errors**
   - Ensure PYTHONPATH includes the src directory
   - Check that all __init__.py files exist

2. **API key errors**
   - Verify .env file exists and contains required keys
   - Check API key formats and permissions

3. **Docker issues**
   ```bash
   docker-compose down
   docker-compose up --build python-api
   ```

## Next Steps

- [ ] Implement satellite imagery fetching
- [ ] Add CrewAI agent configuration
- [ ] Create analysis endpoints
- [ ] Add tests
