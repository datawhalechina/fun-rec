"""健康检查"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from elasticsearch import Elasticsearch
from redis import Redis

from app.api.deps import get_db
from app.schemas import HealthCheck
from app.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthCheck, tags=["health"])
async def health_check(db: Session = Depends(get_db)):
    """健康检查 - 用于监控服务状态"""
    
    try:
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    
    try:
        es_client = Elasticsearch(settings.elasticsearch_url)
        es_client.ping()
        es_status = "healthy"
    except Exception as e:
        es_status = f"unhealthy: {str(e)}"

    try:
        redis_client = Redis.from_url(settings.redis_url)
        redis_client.ping()
        redis_status = "healthy"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    return HealthCheck(
        status="healthy" if db_status == "healthy" else "degraded",
        version=settings.app_version,
        database=db_status,
        redis=redis_status,
        elasticsearch=es_status,
    )

