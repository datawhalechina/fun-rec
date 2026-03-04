"""
热门电影冷启动策略

针对未设置 preferred_genres 的冷启动用户的降级策略。
推荐近年来热门且高评分的电影。
"""

import logging
from typing import List, Dict, Any

from app.services.elasticsearch_service import es_service
from .base import ColdStartStrategy

logger = logging.getLogger(__name__)


class PopularRecentStrategy(ColdStartStrategy):
    """
    基于热门新片的冷启动策略。
    
    这是针对未设置任何偏好的用户的降级策略。
    推荐近几十年高评分、热门的电影，
    提供良好的基线体验。
    """
    
    def __init__(self, min_year: int = 1990):
        """
        初始化策略。
        
        Args:
            min_year: 仅考虑该年份之后的电影
        """
        self.min_year = min_year
    
    def can_handle(self, user_features: Dict[str, Any]) -> bool:
        """始终返回 True - 这是一个降级策略。"""
        return True
    
    async def recommend(
        self, 
        user_features: Dict[str, Any], 
        k: int
    ) -> List[Dict[str, Any]]:
        """
        推荐热门、高评分的新片。
        
        查询 ES 获取高评分和高评分数量的电影，
        优先选择较新的作品。
        """
        if not es_service.is_available():
            logger.warning("Elasticsearch 不可用，PopularRecentStrategy 无法执行")
            return []
        
        try:
            # 查询热门、高评分电影
            query = {
                "bool": {
                    "filter": [
                        {"range": {"avg_rating": {"gte": 7.0}}},
                        {"range": {"rating_count": {"gte": 100}}},
                        {"range": {"year": {"gte": self.min_year}}}
                    ]
                }
            }
            
            # 按热度（rating_count）和质量（avg_rating）排序
            sort = [
                {"rating_count": {"order": "desc"}},
                {"avg_rating": {"order": "desc"}}
            ]
            
            res = es_service.client.search(
                index=es_service.INDEX_NAME,
                query=query,
                sort=sort,
                size=k,
                _source=["movie_id", "title", "genres", "avg_rating", "year", "rating_count"]
            )
            
            hits = res.get("hits", {}).get("hits", [])
            results = []
            
            for hit in hits:
                source = hit["_source"]
                # 基于评分和热度计算分数
                avg_rating = source.get("avg_rating", 5.0)
                rating_count = source.get("rating_count", 0)
                # 归一化：评分贡献 70%，log(热度) 贡献 30%
                import math
                popularity_score = min(1.0, math.log10(rating_count + 1) / 4)  # log10(10000) ≈ 4
                score = 0.7 * (avg_rating / 10.0) + 0.3 * popularity_score
                
                results.append({
                    "movie_id": source.get("movie_id"),
                    "score": round(score, 3),
                    "cold_start_type": "popular_recent",
                    "title": source.get("title"),
                    "genres": source.get("genres", []),
                    "year": source.get("year")
                })
            
            logger.info(f"PopularRecentStrategy 返回 {len(results)} 部电影")
            return results
            
        except Exception as e:
            logger.error(f"PopularRecentStrategy 执行失败: {e}")
            return []
