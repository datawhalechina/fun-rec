"""使用 pydantic-settings 进行配置管理"""

from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用配置
    app_name: str = "FunRec Movie Recommender"
    app_version: str = "0.1.0"
    debug: bool = True
    
    # 数据库配置
    database_url: str = "postgresql://funrec:funrec123@localhost:5432/funrec_db"
    
    # Redis 配置
    redis_url: str = "redis://localhost:6379/0"
    redis_ttl: int = 600  # 缓存过期时间：10分钟
    
    # Elasticsearch 配置
    elasticsearch_url: str = "http://localhost:9200"
    
    # 安全配置
    secret_key: str = "your-secret-key-change-in-production-please-use-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7天 (7 * 24 * 60)
    
    # 文件上传配置
    max_poster_size_mb: int = 5
    allowed_poster_types: List[str] = ["image/png", "image/jpeg"]
    
    # API 配置
    api_prefix: str = "/api"
    
    # 数据路径 - 使用环境变量或默认值
    # Docker 环境: /data (从主机挂载)
    # 本地环境: 数据集的绝对路径
    data_dir: str = "/data"
    poster_dir: str = "/data/image"
    
    # 分页配置
    default_page_size: int = 20
    max_page_size: int = 100
    
    # 推荐系统配置
    recall_candidate_size: int = 1000      # 召回候选集大小
    ranking_candidate_size: int = 200      # 精排候选集大小
    reranking_result_size: int = 50        # 重排序结果大小
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


# 全局配置实例
settings = Settings()

