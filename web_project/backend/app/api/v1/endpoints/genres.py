"""电影类型"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import Genre
from app.schemas import GenreResponse, GenreListResponse

router = APIRouter()


@router.get("/genres", response_model=GenreListResponse, tags=["genres"])
async def get_all_genres(db: Session = Depends(get_db)):
    """获取所有可用的电影类型 - 用于电影偏好选择"""
    genres = db.query(Genre).order_by(Genre.name).all()
    return GenreListResponse(genres=[GenreResponse.model_validate(g) for g in genres])

