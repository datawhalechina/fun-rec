"""Application settings."""

from pathlib import Path
from typing import List, Optional

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[1]
WEB_PROJECT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "FunRec Movie Recommender"
    app_version: str = "0.1.0"
    debug: bool = True

    database_url: str = "postgresql://funrec:funrec123@192.168.95.120:5433/funrec_db"
    redis_url: str = "redis://192.168.95.120:6380/0"
    redis_ttl: int = 600
    elasticsearch_url: str = "http://192.168.95.120:9200"

    secret_key: str = "liuqi123"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080

    max_poster_size_mb: int = 5
    allowed_poster_types: List[str] = ["image/png", "image/jpeg"]

    api_prefix: str = "/api"
    data_dir: str = Field(default="/data", validation_alias="FUNREC_RAW_DATA_PATH")
    poster_dir: Optional[str] = Field(default=None, validation_alias="POSTER_DIR")

    default_page_size: int = 20
    max_page_size: int = 100

    recall_candidate_size: int = 1000
    ranking_candidate_size: int = 200
    reranking_result_size: int = 50

    llm_provider: str = "heuristic"
    llm_base_url: Optional[str] = None
    llm_api_key: Optional[str] = None
    llm_model: Optional[str] = None
    chat_session_ttl: int = 3600

    @model_validator(mode="after")
    def populate_optional_paths(self):
        if not self.poster_dir:
            self.poster_dir = str(Path(self.data_dir) / "image")
        return self

    model_config = SettingsConfigDict(
        env_file=(str(WEB_PROJECT_DIR / ".env"), str(BACKEND_DIR / ".env")),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
