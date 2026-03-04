"""API 依赖注入"""

from typing import Generator
from app.database import SessionLocal


def get_db() -> Generator:
    """数据库会话依赖注入"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

