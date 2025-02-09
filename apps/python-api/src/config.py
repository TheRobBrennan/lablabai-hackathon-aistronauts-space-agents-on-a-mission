from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Keys
    OPENAI_API_KEY: str
    NASA_API_KEY: str
    SENTINEL_HUB_API_KEY: str | None = None
    
    # Service URLs
    NASA_EARTH_DATA_URL: str = "https://api.nasa.gov/planetary/earth"
    SENTINEL_HUB_URL: str | None = None
    
    # App Settings
    ENVIRONMENT: str = "development"
    ALLOWED_HOSTS: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings() 