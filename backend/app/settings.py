from pydantic import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Ticket Buddy App"
    APP_ENV: str = "development"
    
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    
    class Config:
        env_file = ".env"
    
@lru_cache
def get_settings():
    return Settings()
    