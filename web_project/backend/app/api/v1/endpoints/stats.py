"""统计信息"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db
from app.models import Movie, User, Rating, NameBasics

router = APIRouter()


@router.get("/stats", tags=["stats"])
async def get_statistics(db: Session = Depends(get_db)):
    """获取数据库统计信息"""
    
    movie_count = db.query(func.count(Movie.movie_id)).scalar()
    user_count = db.query(func.count(User.user_id)).scalar()
    rating_count = db.query(func.count(Rating.user_id)).scalar()
    
    avg_imdb_rating = db.query(func.avg(Movie.imdb_rating)).filter(Movie.imdb_rating.isnot(None)).scalar()
    avg_user_rating = db.query(func.avg(Rating.rating)).scalar()
    
    people_count = db.query(func.count(NameBasics.nconst)).scalar()
    
    return {
        "movies": movie_count,
        "users": user_count,
        "ratings": rating_count,
        "people": people_count,
        "avg_imdb_rating": round(float(avg_imdb_rating or 0), 2),
        "avg_user_rating": round(float(avg_user_rating or 0), 2),
    }

