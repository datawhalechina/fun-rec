import logging
import json
from typing import List, Dict, Any
from app.services.elasticsearch_service import es_service
from .base import RecallStrategy

logger = logging.getLogger(__name__)

class GlobalTrendingRecallStrategy(RecallStrategy):
    async def recall(self, user_context: Dict[str, Any], k: int) -> List[Dict[str, Any]]:
        """
        基于评分数量和平均评分召回热门电影
        """
        if not es_service.is_available():
            logger.warning("Elasticsearch 不可用，无法进行全局热门召回")
            return []
            
        try:
            # 查询 ES 获取高评分且热门的电影
            # 使用 function score 结合评分数量和平均评分
            # 这里简化处理：按 rating_count * avg_rating 排序（近似）
            # 或者按 rating_count 排序并过滤 avg_rating
            
            query = {
                "bool": {
                    "filter": [
                        {"range": {"avg_rating": {"gte": 5}}},  # 优质电影
                        {"range": {"rating_count": {"gte": 50}}}  # 热门电影
                    ]
                }
            }
            
            sort = [
                {"rating_count": {"order": "desc"}},
                {"avg_rating": {"order": "desc"}}
            ]
            
            # 使用同步 ES 客户端（ESService 的方法是同步的）
            # 但是 ESService.search_movies 使用特定的查询构建器
            # 我们应该直接使用客户端或为 ESService 添加方法
            # 目前直接使用客户端以完全控制查询
            
            res = es_service.client.search(
                index=es_service.INDEX_NAME,
                query=query,
                sort=sort,
                size=k,
                _source=["movie_id", "title", "genres", "avg_rating"]
            )
            
            hits = res.get("hits", {}).get("hits", [])
            results = []
            for hit in hits:
                source = hit["_source"]
                results.append({
                    "movie_id": source.get("movie_id"),
                    "score": 1.0,  # 热门召回的占位分数
                    "recall_type": "global_trending",
                    "title": source.get("title"),
                    "genres": source.get("genres")
                })
            logger.info(f"GlobalTrendingRecallStrategy.recall, 召回数量: {len(results)}")
            return results
            
        except Exception as e:
            logger.error(f"全局热门召回失败: {e}")
            return []

class UserPreferenceRecallStrategy(RecallStrategy):
    async def recall(self, user_context: Dict[str, Any], k: int) -> List[Dict[str, Any]]:
        """
        基于用户偏好类型召回电影（从历史行为中推断）
        """
        if not es_service.is_available():
            return []
            
        try:
            # 1. 从历史行为推断用户偏好类型
            # user_context["hist_genres"] 可能已经在上下文丰富阶段填充
            # 但通常我们只有 hist_movie_ids
            # 在实际系统中，我们会从 Redis 用户画像中获取
            # 这里尝试从上下文获取或进行推断
            
            # 假设 user_context 包含 'genres' 或者需要查找
            # 简化处理：如果没有类型信息则跳过
            # 但是 YouTubeDNN 策略构建了 inputs['hist_genres']
            # 假设调用方（RecallService）丰富了上下文或者我们访问 ResourceManager
            
            # 简单方法：如果传入的上下文有明确的偏好（例如来自 UI）
            # 或者查看 hist_movie_ids 并映射到类型
            
            # TODO: 实现从 Redis 查询用户画像偏好
            
            frequent_genres = user_context.get("frequent_genres", [])
            
            if not frequent_genres:
                # 降级处理：如果有历史记录，可以从中随机选择类型
                # 目前如果没有偏好信号则返回空
                return []
                
            # 2. 查询 ES
            # 注意：ES 中的 "genres" 字段映射为 keyword 还是 text？
            # 如果映射为 keyword，"terms" 查询有效。如果是 text，应使用 "match"
            # 通常 genres 是 keyword。但如果是列表，"terms" 会检查是否有任何匹配
            # 然而 ES 报错 "[terms] query does not support [genres]" 表明
            # 可能将 "genres" 解释为不支持 terms 的字段（例如没有 keyword 子字段的 text 字段？）
            # 或者我们传入了错误的参数
            # 实际上，"terms" 查询格式为: "terms": { "field": [values] }
            
            # 尝试 match 查询（bool should 子句）或在 genres.keyword 上使用 terms（如果可用）
            # 根据报错，可能需要使用 "terms" 但要确保字段映射正确
            # 如果报错持续，可能是字段类型为 text
            
            # 如果索引为 keyword 则使用 'genres.keyword'，或者使用显式映射的 'genres'
            # 最安全的做法是尝试 'genres.keyword' 或使用 bool should match 查询
            
            query = {
                "bool": {
                    "must": [
                         {"terms": {"genres.keyword": frequent_genres}}
                    ],
                    "filter": [
                        {"range": {"avg_rating": {"gte": 5}}},
                    ]
                }
            }
            
            # 如果 keyword 不可用的降级方案：使用简单 match（对多词类型精度较低）
            # 但假设使用标准映射，text 字段会创建 .keyword 子字段
            
            # 按时间（年份）或评分排序
            sort = [
                {"year": {"order": "desc"}},  # 偏好类型中的新电影
                {"avg_rating": {"order": "desc"}}
            ]
            
            res = es_service.client.search(
                index=es_service.INDEX_NAME,
                query=query,
                sort=sort,
                size=k,
                _source=["movie_id", "title", "genres"]
            )
            
            hits = res.get("hits", {}).get("hits", [])
            results = []
            for hit in hits:
                source = hit["_source"]
                results.append({
                    "movie_id": source.get("movie_id"),
                    "score": 0.8,  # 占位分数
                    "recall_type": "user_preference",
                    "title": source.get("title"),
                    "genres": source.get("genres")
                })
            logger.info(f"UserPreferenceRecallStrategy.recall, 召回数量: {len(results)}")
            return results

        except Exception as e:
            logger.error(f"用户偏好召回失败: {e}")
            return []
