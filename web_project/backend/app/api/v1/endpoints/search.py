"""搜索"""

from typing import List
from fastapi import APIRouter, Query, HTTPException
import logging

from app.schemas import MovieListItem
from app.services.elasticsearch_service import es_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/movies", response_model=List[MovieListItem])
async def search_movies(
    q: str = Query(..., min_length=1, max_length=200, description="搜索查询"),
    limit: int = Query(20, ge=1, le=100, description="返回的结果数量")
):
    """
    根据标题、类型或简介搜索电影
    
    使用 Elasticsearch 提供快速、模糊和相关性排序的搜索结果。
    结果按相关性分数排序。
    """
    if not es_service.is_available():
        raise HTTPException(
            status_code=503,
            detail="搜索服务不可用"
        )
    
    # 执行搜索
    results = es_service.search_movies(query=q, limit=limit)
    
    # 转换为 MovieListItem 模式
    movies = []
    for result in results:
        movie = MovieListItem(
            movie_id=result["movie_id"],
            title=result["title"],
            year=result.get("year"),
            genres=result.get("genres", []),
            avg_rating=result.get("avg_rating"),
            imdb_rating=result.get("imdb_rating")
        )
        movies.append(movie)
    
    logger.info(f"搜索查询 '{q}' 返回 {len(movies)} 条结果")
    return movies


@router.get("/suggest")
async def search_suggestions(
    q: str = Query(..., min_length=1, max_length=100, description="Partial search query"),
    limit: int = Query(10, ge=1, le=20, description="Maximum number of suggestions")
):
    """
    根据部分查询获取搜索建议
    
    为自动补全功能返回快速建议。
    """
    if not es_service.is_available():
        return []
    
    # 目前使用相同的搜索逻辑，只是返回更少的结果
    # 后续可以使用 completion suggester 进行优化
    results = es_service.search_movies(query=q, limit=limit)
    
    # 仅返回标题作为建议
    suggestions = [
        {
            "movie_id": result["movie_id"],
            "title": result["title"],
            "year": result.get("year")
        }
        for result in results
    ]
    
    return suggestions

