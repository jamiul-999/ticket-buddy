"""Settings file"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    """Define and validate .env fields"""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    APP_NAME: str = Field(min_length=4)
    APP_ENV: str = Field(min_length=5)
    DB_USER: str = Field(min_length=3)
    DB_PASSWORD: str = Field(min_length=8)
    DB_HOST: str = Field(min_length=3)
    DB_PORT: int = Field(gt=1, lt=65535)
    DB_NAME: str = Field(min_length=5)

@lru_cache
def get_settings():
    """Load settings class"""
    return Settings()
