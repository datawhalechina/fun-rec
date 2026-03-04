"""用户资料"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
import logging

import redis
from app.config import settings
from app.api.deps import get_db
from app.core.auth import get_current_active_user
from app.models import User, Rating, Movie
from app.schemas import UserProfile, UserUpdate, RecentRating

logger = logging.getLogger(__name__)

# 初始化 Redis 连接
try:
    redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
except Exception as e:
    logger.warning(f"连接 Redis 失败: {e}")
    redis_client = None

router = APIRouter()


@router.get("/users/me", response_model=UserProfile, tags=["users"])
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取当前用户资料，包含偏好和历史记录"""
    
    logger.info(f"获取用户 {current_user.user_id} 的资料")

    # 1. 获取最近评分（最近10条）
    recent_ratings_db = db.query(Rating).options(
        joinedload(Rating.movie)
    ).filter(
        Rating.user_id == current_user.user_id
    ).order_by(desc(Rating.timestamp)).limit(10).all()
    
    logger.info(f"找到 {len(recent_ratings_db)} 条最近评分")

    recent_ratings = []
    for r in recent_ratings_db:
        if r.movie:
            recent_ratings.append(RecentRating(
                movie_id=r.movie_id,
                title=r.movie.title,
                genres=r.movie.genres or [],
                rating=r.rating,
                timestamp=r.timestamp
            ))            
            
    # 2. 获取热门电影类型（从评分历史计算，仅存储在 Redis）
    frequent_genres = []
    
    if redis_client:
        try:
            profile_key = f"user:{current_user.user_id}:profile"
            cached_genres = redis_client.hget(profile_key, "frequent_genres")
            if cached_genres:
                frequent_genres = cached_genres.split(",")
                logger.info(f"从 Redis 加载热门电影类型: {frequent_genres}")
            else:
                logger.info("Redis 中没有热门电影类型")
        except Exception as e:
            logger.warning(f"获取热门电影类型时 Redis 出错: {e}")
    
    # 构建用户资料响应
    profile = UserProfile.model_validate(current_user)
    profile.recent_ratings = recent_ratings
    profile.frequent_genres = frequent_genres
    
    return profile


@router.put("/users/me", response_model=UserProfile, tags=["users"])
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """更新当前用户资料（邮箱/用户名不可修改）
    
    注意: preferred_genres 是用户声明的偏好（用于冷启动）。
    这与 frequent_genres 不同，后者是根据评分历史计算得出的。
    """
    
    # 更新字段（包括用于冷启动的 preferred_genres）
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    # 返回包含计算字段的完整资料
    # 获取最近评分
    recent_ratings_db = db.query(Rating).options(
        joinedload(Rating.movie)
    ).filter(
        Rating.user_id == current_user.user_id
    ).order_by(desc(Rating.timestamp)).limit(10).all()
    
    recent_ratings = []
    for r in recent_ratings_db:
        if r.movie:
            recent_ratings.append(RecentRating(
                movie_id=r.movie_id,
                title=r.movie.title,
                genres=r.movie.genres or [],
                rating=r.rating,
                timestamp=r.timestamp
            ))
    
    # 从 Redis 获取热门电影类型
    frequent_genres = []
    if redis_client:
        try:
            profile_key = f"user:{current_user.user_id}:profile"
            cached_genres = redis_client.hget(profile_key, "frequent_genres")
            if cached_genres:
                frequent_genres = cached_genres.split(",")
        except Exception as e:
            logger.warning(f"获取热门电影类型时 Redis 出错: {e}")
    
    profile = UserProfile.model_validate(current_user)
    profile.recent_ratings = recent_ratings
    profile.frequent_genres = frequent_genres
    
    return profile

