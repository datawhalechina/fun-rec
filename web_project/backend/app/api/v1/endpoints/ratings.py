"""评分"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.api.deps import get_db
from app.core.auth import get_current_active_user
from app.models import Rating, Movie, User
from app.schemas import RatingCreate
from pydantic import BaseModel
from app.config import settings
from app.services.elasticsearch_service import es_service
import redis

# 导入 UCB 类型统计更新器（用于冷启动）
from online.cold_start.ucb_genre import update_ucb_genre_stats

# 初始化 Redis 客户端（全局或按请求？）
# 创建全局客户端或使用依赖注入更佳。
# 为简单起见，这里创建连接池或客户端。
try:
    redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
except Exception:
    redis_client = None

router = APIRouter()


class RatingResponse(BaseModel):
    """评分响应模式"""
    user_id: int
    movie_id: int
    rating: int
    timestamp: int


class UserRatingResponse(BaseModel):
    """用户对特定电影的评分"""
    rating: int | None = None
    has_rated: bool = False


@router.post("/ratings", response_model=RatingResponse, status_code=status.HTTP_201_CREATED, tags=["ratings"])
async def create_or_update_rating(
    rating_data: RatingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """创建或更新电影评分（需要认证）"""
    
    # 检查电影是否存在
    movie = db.query(Movie).filter(Movie.movie_id == rating_data.movie_id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="电影不存在"
        )
    
    # 检查评分是否已存在
    existing_rating = db.query(Rating).filter(
        Rating.user_id == current_user.user_id,
        Rating.movie_id == rating_data.movie_id
    ).first()
    
    timestamp = int(datetime.now().timestamp())
    
    if existing_rating:
        # 更新已存在的评分
        old_rating = existing_rating.rating
        existing_rating.rating = rating_data.rating
        existing_rating.timestamp = timestamp
        db.commit()
        db.refresh(existing_rating)
        
        # 更新电影的平均评分
        _update_movie_rating(db, rating_data.movie_id)
        
        # 更新 Elasticsearch
        _update_movie_es(db, rating_data.movie_id)
        
        # 更新 Redis 历史（即使已存在，也表示新的交互）
        # 通常只在新交互时添加到历史。
        # 但如果用户重新评分，可能表示感兴趣。
        # 为了获取"最近"上下文，将其添加到历史中。
        _update_user_history_redis(db, current_user.user_id, rating_data.movie_id)
        
        # 更新 UCB 类型统计（用于冷启动的探索/利用）
        if movie.genres:
            update_ucb_genre_stats(
                user_id=current_user.user_id,
                movie_genres=movie.genres,
                rating=rating_data.rating,
                redis_client=redis_client
            )
        
        return RatingResponse(
            user_id=existing_rating.user_id,
            movie_id=existing_rating.movie_id,
            rating=existing_rating.rating,
            timestamp=existing_rating.timestamp
        )
    else:
        # 创建新评分
        new_rating = Rating(
            user_id=current_user.user_id,
            movie_id=rating_data.movie_id,
            rating=rating_data.rating,
            timestamp=timestamp
        )
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        
        # 更新电影的平均评分和评分数
        _update_movie_rating(db, rating_data.movie_id)
        
        # 更新 Elasticsearch
        _update_movie_es(db, rating_data.movie_id)
        
        # 更新 Redis 历史
        _update_user_history_redis(db, current_user.user_id, rating_data.movie_id)
        
        # 更新 UCB 类型统计（用于冷启动的探索/利用）
        if movie.genres:
            update_ucb_genre_stats(
                user_id=current_user.user_id,
                movie_genres=movie.genres,
                rating=rating_data.rating,
                redis_client=redis_client
            )
        
        return RatingResponse(
            user_id=new_rating.user_id,
            movie_id=new_rating.movie_id,
            rating=new_rating.rating,
            timestamp=new_rating.timestamp
        )


@router.get("/ratings/movie/{movie_id}", response_model=UserRatingResponse, tags=["ratings"])
async def get_user_rating(
    movie_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取当前用户对指定电影的评分"""
    
    rating = db.query(Rating).filter(
        Rating.user_id == current_user.user_id,
        Rating.movie_id == movie_id
    ).first()
    
    if rating:
        return UserRatingResponse(
            rating=rating.rating,
            has_rated=True
        )
    else:
        return UserRatingResponse(
            rating=None,
            has_rated=False
        )


@router.delete("/ratings/movie/{movie_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["ratings"])
async def delete_rating(
    movie_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """删除用户对电影的评分"""
    
    rating = db.query(Rating).filter(
        Rating.user_id == current_user.user_id,
        Rating.movie_id == movie_id
    ).first()
    
    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="评分不存在"
        )
    
    db.delete(rating)
    db.commit()
    
    # 更新电影的平均评分
    _update_movie_rating(db, movie_id)
    
    # 更新 Elasticsearch
    _update_movie_es(db, movie_id)
    
    # 从 Redis 历史中移除？
    # 不知道值的情况下比较复杂。
    # 暂时跳过移除。历史表示"观看过"，删除评分不代表"未观看"。
    
    return None


def _update_movie_rating(db: Session, movie_id: int):
    """辅助函数：更新电影的平均评分和评分数"""
    
    result = db.query(
        func.avg(Rating.rating).label('avg'),
        func.count(Rating.rating).label('count')
    ).filter(Rating.movie_id == movie_id).first()
    
    movie = db.query(Movie).filter(Movie.movie_id == movie_id).first()
    if movie:
        movie.avg_rating = float(result.avg) if result.avg else None
        movie.rating_count = result.count or 0
        db.commit()

def _update_movie_es(db: Session, movie_id: int):
    """辅助函数：将电影更新推送到 Elasticsearch"""
    if not es_service:
        return
        
    movie = db.query(Movie).filter(Movie.movie_id == movie_id).first()
    if movie:
        es_service.update_movie(movie.movie_id, {
            "avg_rating": movie.avg_rating,
            "rating_count": movie.rating_count,
            "title": movie.title,  # 以防万一
            "year": movie.year
        })

def _update_user_history_redis(db: Session, user_id: int, movie_id: int):
    """辅助函数：将电影添加到 Redis 中的用户历史并更新偏好"""
    if not redis_client:
        return
        
    try:
        # 1. 更新历史
        history_key = f"user:{user_id}:history"
        redis_client.rpush(history_key, movie_id)
        
        # 2. 更新偏好（在线更新）
        # 从数据库获取最近10条评分以准确重新计算热门类型
        recent_ratings = (
            db.query(Rating.movie_id)
            .filter(Rating.user_id == user_id)
            .order_by(Rating.timestamp.desc())
            .limit(10)
            .all()
        )
        
        if not recent_ratings:
            return
            
        recent_mids = [r.movie_id for r in recent_ratings]
        
        # 获取这些电影的类型
        movies = db.query(Movie.genres).filter(Movie.movie_id.in_(recent_mids)).all()
        
        all_genres = []
        for m in movies:
            if m.genres:
                all_genres.extend(m.genres)
                
        if all_genres:
            from collections import Counter
            counts = Counter(all_genres)
            # 取最常见的前1个类型
            top_1 = [g for g, c in counts.most_common(1)]
            
            # 更新 Redis
            profile_key = f"user:{user_id}:profile"
            redis_client.hset(profile_key, "frequent_genres", ",".join(top_1))
                
    except Exception as e:
        print(f"更新 Redis history/preferences 时出错: {e}")
                
    except Exception as e:
        print(f"更新 Redis history/preferences 时出错: {e}")

