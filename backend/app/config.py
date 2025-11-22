"""Settings file"""
import os
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
    DB_USER: str = Field(min_length=1)
    DB_PASSWORD: str = Field(min_length=8)
    DB_HOST: str = Field(min_length=1)
    DB_PORT: int = Field(gt=1, lt=65535)
    DB_NAME: str = Field(min_length=2)

    BUS_DATA_PATH: str = "/app/data/data.json"
    PROVIDER_DOCS_PATH: str = "/app/data/provider_docs"
    CHROMA_PERSIST_DIR: str = "/app/data/chroma_db"
    # BUS_DATA_PATH: str = "/app/data/data.json"
    # PROVIDER_DATA_PATH: str = "/app/data/provider_docs"

    DATABASE_URL: str | None = None

    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIM: int = 384
    CHROMA_PERSIST_DIR: str = "/app/data/chroma_db"

    def get_absolute_path(self, relative_path: str) -> str:
        """Convert relative path to absolute path"""
        if os.path.isabs(relative_path):
            return relative_path
        # Get the project root (2 levels up from config.py)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        return os.path.join(project_root, relative_path)


@lru_cache
def get_settings():
    """Load settings class"""
    return Settings()
