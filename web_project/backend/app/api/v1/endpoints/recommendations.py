"""
推荐 Endpoints

轻量级 API 层，处理 HTTP 请求/响应。
所有业务逻辑都在 online.pipeline 中实现。
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import Movie, User, Rating
from online.pipeline import get_pipeline, PipelineConfig, RecommendationResult

router = APIRouter()


# ============================================================================
# 请求/响应模型（API 契约）
# ============================================================================

class UserFeaturesRequest(BaseModel):
    """推荐请求的用户特征"""
    user_id: Optional[int] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    zip_code: Optional[str] = None
    hist_movie_ids: List[int] = Field(default_factory=list)
    preferred_genres: List[str] = Field(default_factory=list)


class RecommendationItemResponse(BaseModel):
    """响应中的单个推荐项"""
    movie_id: int
    title: str
    genres: List[str]
    score: float = Field(..., description="排序分数")
    recall_score: Optional[float] = None
    recall_type: Optional[str] = None
    poster_url: Optional[str] = None


class RecommendationResponse(BaseModel):
    """推荐 API 响应"""
    items: List[RecommendationItemResponse]
    recall_count: int
    ranking_strategy: str


# ============================================================================
# 数据访问辅助函数（可移至 repository 层）
# ============================================================================

async def enrich_user_features(
    features: UserFeaturesRequest, 
    db: Session
) -> dict:
    """
    从数据库补充用户特征
    
    如果请求中未提供历史记录和人口统计信息，则从数据库获取。
    """
    feat_dict = features.model_dump()
    
    if not features.user_id:
        return feat_dict
    
    # 如果历史为空，则获取历史
    if not features.hist_movie_ids:
        recent_ratings = (
            db.query(Rating)
            .filter(Rating.user_id == features.user_id)
            .order_by(Rating.timestamp.desc())
            .limit(50)
            .all()
        )
        feat_dict["hist_movie_ids"] = [r.movie_id for r in recent_ratings]
    
    # 如果缺少人口统计信息，则获取
    if not features.gender:
        user = db.query(User).filter(User.user_id == features.user_id).first()
        if user:
            feat_dict["gender"] = user.gender
            feat_dict["age"] = int(user.age) if user.age and str(user.age).isdigit() else 0
            feat_dict["occupation"] = user.occupation
            feat_dict["zip_code"] = user.zip_code
            feat_dict["preferred_genres"] = user.preferred_genres
    
    return feat_dict


async def get_item_features(movie_ids: List[int], db: Session) -> dict:
    """获取用于精排和重排序的物品特征"""
    movies = db.query(Movie).filter(Movie.movie_id.in_(movie_ids)).all()
    return {
        m.movie_id: {
            # 用于精排模型（期望单个类型）
            "genres": m.genres[0] if m.genres else None,
            # 用于重排序打散（完整类型列表）
            "genres_list": m.genres or [],
            # 物品元数据
            "isAdult": getattr(m, 'is_adult', False),
            "year": m.year,  # 用于年代打散
        }
        for m in movies
    }


def enrich_with_metadata(
    result: RecommendationResult, 
    db: Session
) -> List[RecommendationItemResponse]:
    """为 API 响应补充电影元数据"""
    movie_ids = [item.movie_id for item in result.items]
    movies = db.query(Movie).filter(Movie.movie_id.in_(movie_ids)).all()
    movie_map = {m.movie_id: m for m in movies}
    
    enriched = []
    for item in result.items:
        movie = movie_map.get(item.movie_id)
        if movie:
            enriched.append(RecommendationItemResponse(
                movie_id=movie.movie_id,
                title=movie.title,
                genres=movie.genres or [],
                score=item.score,
                recall_score=item.recall_score,
                recall_type=item.recall_type,
                poster_url=f"/api/v1/posters/{movie.movie_id}.png"
            ))
    return enriched


# ============================================================================
# API 端点
# ============================================================================

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(
    features: UserFeaturesRequest,
    recall_k: int = Query(default=100, ge=10, le=500, description="Recall candidates"),
    top_k: int = Query(default=20, ge=1, le=100, description="Final results"),
    db: Session = Depends(get_db)
):
    """
    获取个性化电影推荐
    
    推荐流水线:
    1. 从多个召回通道检索约100个多样化候选
    2. 使用 DeepFM 模型进行 CTR 预估排序
    3. 返回 top-k 排序后的推荐结果
    
    Args:
        features: 用户特征（user_id、人口统计信息、历史记录）
        recall_k: 召回候选数量
        top_k: 最终推荐数量
        
    Returns:
        带有电影元数据的排序推荐结果
    """
    pipeline = get_pipeline()
    
    if not pipeline.is_ready:
        raise HTTPException(
            status_code=503, 
            detail="推荐服务不可用"
        )
    
    # 如果需要，初始化类型映射（延迟初始化）
    if not pipeline.movie_genre_map:
        movies = db.query(Movie).all()
        pipeline.set_movie_genre_map(movies)
    
    # 从数据库补充用户特征
    user_features = await enrich_user_features(features, db)
    
    # 创建物品特征提供器（闭包引用 db session）
    async def item_features_provider(movie_ids: List[int]) -> dict:
        return await get_item_features(movie_ids, db)
    
    # 运行推荐流水线
    try:
        result = await pipeline.recommend(
            user_features=user_features,
            item_features_provider=item_features_provider,
            config=PipelineConfig(
                recall_top_k=recall_k,
                ranking_top_k=top_k
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"推荐失败: {str(e)}")
    
    # 为响应补充电影元数据
    items = enrich_with_metadata(result, db)
    
    return RecommendationResponse(
        items=items,
        recall_count=result.recall_count,
        ranking_strategy=result.ranking_strategy
    )

@router.get("/health")
async def health():
    """推荐服务健康检查"""
    pipeline = get_pipeline()
    return pipeline.get_health_status()
