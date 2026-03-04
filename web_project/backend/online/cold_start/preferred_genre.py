"""
偏好类型冷启动策略

基于用户明确声明的类型偏好推荐电影。
这是针对在注册或设置个人资料时设置了 preferred_genres 的用户的主要冷启动策略。
"""

import logging
from typing import List, Dict, Any

from app.services.elasticsearch_service import es_service
from .base import ColdStartStrategy

logger = logging.getLogger(__name__)


class PreferredGenreStrategy(ColdStartStrategy):
    """
    使用用户声明的类型偏好的冷启动策略。
    
    该策略查询 Elasticsearch 获取与用户 preferred_genres 匹配的高评分电影。
    这是在收集行为数据之前最具个性化的冷启动策略。
    """
    
    def can_handle(self, user_features: Dict[str, Any]) -> bool:
        """
        检查用户是否设置了 preferred_genres。
        
        该策略要求用户明确设置类型偏好（通常在注册时）。
        """
        preferred_genres = user_features.get("preferred_genres", [])
        return bool(preferred_genres) and len(preferred_genres) > 0
    
    async def recommend(
        self, 
        user_features: Dict[str, Any], 
        k: int
    ) -> List[Dict[str, Any]]:
        """
        推荐与用户偏好类型匹配的电影。
        
        查询 ES 获取用户偏好类型中的高评分电影，
        按评分和时间排序。
        """
        if not es_service.is_available():
            logger.warning("Elasticsearch 不可用，PreferredGenreStrategy 无法执行")
            return []
        
        preferred_genres = user_features.get("preferred_genres", [])
        
        if not preferred_genres:
            logger.debug("未设置 preferred_genres，跳过 PreferredGenreStrategy")
            return []
        
        try:
            # 构建 ES 查询，匹配偏好类型的电影
            query = {
                "bool": {
                    "must": [
                        {"terms": {"genres.keyword": preferred_genres}}
                    ],
                    "filter": [
                        {"range": {"avg_rating": {"gte": 6.0}}},  # 优质电影
                        {"range": {"rating_count": {"gte": 20}}}  # 有一定热度
                    ]
                }
            }
            
            # 按评分和时间排序
            sort = [
                {"avg_rating": {"order": "desc"}},
                {"year": {"order": "desc"}}
            ]
            
            res = es_service.client.search(
                index=es_service.INDEX_NAME,
                query=query,
                sort=sort,
                size=k,
                _source=["movie_id", "title", "genres", "avg_rating", "year"]
            )
            
            hits = res.get("hits", {}).get("hits", [])
            results = []
            
            for hit in hits:
                source = hit["_source"]
                # 基于类型匹配计算相关性分数
                movie_genres = source.get("genres", [])
                genre_overlap = len(set(movie_genres) & set(preferred_genres))
                base_score = source.get("avg_rating", 5.0) / 10.0
                # 根据类型重叠度提升分数
                score = base_score * (1 + 0.1 * genre_overlap)
                
                results.append({
                    "movie_id": source.get("movie_id"),
                    "score": round(score, 3),
                    "cold_start_type": "preferred_genre",
                    "title": source.get("title"),
                    "genres": movie_genres,
                    "year": source.get("year")
                })
            
            logger.info(
                f"PreferredGenreStrategy 返回 {len(results)} 部电影，"
                f"偏好类型: {preferred_genres}"
            )
            return results
            
        except Exception as e:
            logger.error(f"PreferredGenreStrategy 执行失败: {e}")
            return []
