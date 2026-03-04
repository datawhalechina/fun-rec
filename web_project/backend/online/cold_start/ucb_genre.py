"""
UCB 类型探索策略（冷启动）

使用置信上界（UCB）算法在为冷启动用户推荐时平衡探索与利用。

该策略跟踪每个用户、每个类型的统计数据：
- n: 该类型电影被推荐并被评分的次数
- reward: 该类型的归一化评分总和（rating/10）

UCB 分数 = 平均奖励 + c * sqrt(log(总推荐次数) / 类型推荐次数)

这确保我们：
- 利用用户表现出喜欢的类型（高平均奖励）
- 探索样本较少的类型（高不确定性奖励）
"""

import json
import math
import logging
from typing import List, Dict, Any, Optional
import redis

from app.config import settings
from app.services.elasticsearch_service import es_service
from app.database import SessionLocal
from app.models import Genre
from .base import ColdStartStrategy

logger = logging.getLogger(__name__)

# UCB 统计数据的 Redis 键模式
UCB_STATS_KEY = "user:{user_id}:genre_ucb"

# 默认探索系数
DEFAULT_EXPLORATION_C = 1.5

# 偏好类型的初始奖励提升
PREFERRED_GENRE_INITIAL_REWARD = 0.7
PREFERRED_GENRE_INITIAL_N = 1


class UCBGenreStrategy(ColdStartStrategy):
    """
    使用 UCB 进行类型探索/利用的冷启动策略。
    
    平衡推荐用户已交互过的类型（利用）与尝试新类型以学习偏好（探索）。
    
    统计数据存储在 Redis 中，当用户评分电影时更新。
    可用类型从数据库（genres 表）获取。
    """
    
    def __init__(
        self, 
        exploration_c: float = DEFAULT_EXPLORATION_C,
        min_movies_per_genre: int = 2
    ):
        """
        初始化 UCB 类型策略。
        
        Args:
            exploration_c: 探索系数（越高越倾向探索）
            min_movies_per_genre: 每个选中类型的最小电影数量
        """
        self.exploration_c = exploration_c
        self.min_movies_per_genre = min_movies_per_genre
        
        # 初始化 Redis
        try:
            self.redis_client = redis.Redis.from_url(
                settings.redis_url, 
                decode_responses=True
            )
        except Exception as e:
            logger.error(f"UCBGenreStrategy: 连接 Redis 失败: {e}")
            self.redis_client = None
        
        # 可用类型（从数据库懒加载）
        self._available_genres: Optional[List[str]] = None
    
    @property
    def available_genres(self) -> List[str]:
        """
        从数据库获取可用类型（首次加载后缓存）。
        
        如果数据库不可用，则回退到常见类型列表。
        """
        if self._available_genres is not None:
            return self._available_genres
        
        try:
            db = SessionLocal()
            genres = db.query(Genre.name).order_by(Genre.name).all()
            db.close()
            
            if genres:
                self._available_genres = [g.name for g in genres]
                logger.info(f"从数据库加载了 {len(self._available_genres)} 个类型")
            else:
                # 数据库为空时的降级处理
                self._available_genres = self._get_fallback_genres()
                logger.warning("数据库中没有类型，使用降级列表")
                
        except Exception as e:
            logger.error(f"从数据库加载类型失败: {e}")
            self._available_genres = self._get_fallback_genres()
        
        return self._available_genres
    
    def _get_fallback_genres(self) -> List[str]:
        """数据库不可用时的降级类型列表。"""
        return [
            "Action", "Adventure", "Animation", "Children", "Comedy",
            "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir",
            "Horror", "Musical", "Mystery", "Romance", "Sci-Fi",
            "Thriller", "War", "Western"
        ]
    
    def can_handle(self, user_features: Dict[str, Any]) -> bool:
        """UCB 可以处理任何用户，但在有一些评分历史时效果最好。"""
        return self.redis_client is not None
    
    def _get_ucb_stats_key(self, user_id: int) -> str:
        """获取用户 UCB 统计数据的 Redis 键。"""
        return UCB_STATS_KEY.format(user_id=user_id)
    
    def _get_genre_stats(self, user_id: int) -> Dict[str, Dict[str, float]]:
        """
        获取用户所有类型的 UCB 统计数据。
        
        Returns:
            类型到 {"n": 计数, "reward": 总奖励} 的映射字典
        """
        if not self.redis_client:
            return {}
        
        try:
            key = self._get_ucb_stats_key(user_id)
            stats_raw = self.redis_client.hgetall(key)
            
            stats = {}
            for genre, data in stats_raw.items():
                try:
                    stats[genre] = json.loads(data)
                except json.JSONDecodeError:
                    continue
            logger.info(f"UCB 统计数据: {stats}")
            return stats
        except Exception as e:
            logger.error(f"获取 UCB 统计数据时出错: {e}")
            return {}
    
    def _initialize_preferred_genres(
        self, 
        user_id: int, 
        preferred_genres: List[str]
    ) -> None:
        """
        为用户的偏好类型初始化 UCB 统计数据（给予小幅提升）。
        
        这使偏好类型在利用阶段有一定优势，
        同时仍然允许探索其他类型。
        """
        if not self.redis_client or not preferred_genres:
            return
        
        try:
            key = self._get_ucb_stats_key(user_id)
            
            # 检查是否已初始化
            existing = self.redis_client.hgetall(key)
            if existing:
                return  # 已有统计数据，不覆盖
            
            # 为偏好类型初始化小幅提升
            pipeline = self.redis_client.pipeline()
            for genre in preferred_genres:
                stats = {
                    "n": PREFERRED_GENRE_INITIAL_N,
                    "reward": PREFERRED_GENRE_INITIAL_REWARD
                }
                pipeline.hset(key, genre, json.dumps(stats))
            
            pipeline.execute()
            logger.info(f"已为用户 {user_id} 初始化 UCB 统计数据，偏好类型: {preferred_genres}")
            
        except Exception as e:
            logger.error(f"初始化偏好类型时出错: {e}")
    
    def _calculate_ucb_scores(
        self, 
        stats: Dict[str, Dict[str, float]],
        total_n: int
    ) -> Dict[str, float]:
        """
        计算所有类型的 UCB 分数。
        
        UCB = 平均奖励 + c * sqrt(log(总次数) / n)
        
        没有统计数据的类型获得最大探索奖励。
        """
        scores = {}
        
        # 避免除零的小数
        epsilon = 1e-6
        
        for genre in self.available_genres:
            if genre in stats and stats[genre]["n"] > 0:
                n = stats[genre]["n"]
                reward = stats[genre]["reward"]
                avg_reward = reward / n
                
                # UCB 探索奖励
                if total_n > 0:
                    exploration_bonus = self.exploration_c * math.sqrt(
                        math.log(total_n + 1) / (n + epsilon)
                    )
                else:
                    exploration_bonus = self.exploration_c
                
                scores[genre] = avg_reward + exploration_bonus
            else:
                # 未知类型获得最大探索分数
                # 这确保未探索的类型会被尝试
                scores[genre] = 1.0 + self.exploration_c * 2
        
        return scores
    
    def _select_genres_by_ucb(
        self, 
        stats: Dict[str, Dict[str, float]],
        num_genres: int = 5
    ) -> List[str]:
        """
        按 UCB 分数选择头部类型。
        
        返回平衡利用和探索的类型组合。
        """
        # 计算总推荐次数
        total_n = sum(s.get("n", 0) for s in stats.values())
        
        # 计算 UCB 分数
        ucb_scores = self._calculate_ucb_scores(stats, total_n)
        
        # 按 UCB 分数降序排列
        sorted_genres = sorted(
            ucb_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        selected = [g for g, _ in sorted_genres[:num_genres]]
        
        logger.debug(f"UCB 选择的类型: {selected} (分数: {dict(sorted_genres[:num_genres])})")
        return selected
    
    async def recommend(
        self, 
        user_features: Dict[str, Any], 
        k: int
    ) -> List[Dict[str, Any]]:
        """
        使用 UCB 类型选择进行电影推荐。
        
        1. 如果是新用户，使用 preferred_genres 初始化 UCB 统计数据
        2. 计算所有类型的 UCB 分数
        3. 按 UCB 分数选择头部类型
        4. 从选中的类型获取电影
        """
        if not es_service.is_available():
            logger.warning("Elasticsearch 不可用，UCBGenreStrategy 无法执行")
            return []
        
        user_id = user_features.get("user_id")
        if not user_id:
            logger.warning("UCBGenreStrategy 需要 user_id")
            return []
        
        # 首次使用时初始化偏好类型
        preferred_genres = user_features.get("preferred_genres", [])
        if preferred_genres:
            self._initialize_preferred_genres(user_id, preferred_genres)
        
        # 获取当前 UCB 统计数据
        stats = self._get_genre_stats(user_id)
        
        # 使用 UCB 选择类型
        num_genres = min(5, max(2, k // self.min_movies_per_genre))
        selected_genres = self._select_genres_by_ucb(stats, num_genres)
        
        if not selected_genres:
            logger.warning("UCB 未选择任何类型")
            return []
        
        try:
            # 查询 ES 获取选中类型的电影
            movies_per_genre = max(self.min_movies_per_genre, k // len(selected_genres))
            results = []
            seen_ids = set()
            
            for genre in selected_genres:
                if len(results) >= k:
                    break
                
                query = {
                    "bool": {
                        "must": [
                            {"term": {"genres.keyword": genre}}
                        ],
                        "filter": [
                            {"range": {"avg_rating": {"gte": 6.0}}},
                            {"range": {"rating_count": {"gte": 20}}}
                        ]
                    }
                }
                
                res = es_service.client.search(
                    index=es_service.INDEX_NAME,
                    query=query,
                    sort=[
                        {"avg_rating": {"order": "desc"}},
                        {"year": {"order": "desc"}}
                    ],
                    size=movies_per_genre,
                    _source=["movie_id", "title", "genres", "avg_rating", "year"]
                )
                
                hits = res.get("hits", {}).get("hits", [])
                
                # 获取该类型的 UCB 分数
                ucb_score = self._calculate_ucb_scores(stats, sum(s.get("n", 0) for s in stats.values())).get(genre, 0.5)
                
                for hit in hits:
                    if len(results) >= k:
                        break
                    
                    source = hit["_source"]
                    movie_id = source.get("movie_id")
                    
                    if movie_id in seen_ids:
                        continue
                    seen_ids.add(movie_id)
                    
                    results.append({
                        "movie_id": movie_id,
                        "score": round(ucb_score * (source.get("avg_rating", 5.0) / 10.0), 3),
                        "cold_start_type": "ucb_genre",
                        "ucb_genre": genre,  # 记录该电影来自哪个类型
                        "title": source.get("title"),
                        "genres": source.get("genres", []),
                        "year": source.get("year")
                    })
            
            logger.info(
                f"UCBGenreStrategy 返回 {len(results)} 部电影，"
                f"来自类型: {selected_genres}"
            )
            return results
            
        except Exception as e:
            logger.error(f"UCBGenreStrategy 执行失败: {e}")
            return []


def update_ucb_genre_stats(
    user_id: int, 
    movie_genres: List[str], 
    rating: int,
    redis_client: Optional[redis.Redis] = None
) -> None:
    """
    当用户评分电影时更新 UCB 统计数据。
    
    应在评分提交后从 ratings 接口调用此函数。
    
    Args:
        user_id: 评分用户
        movie_genres: 被评分电影的类型
        rating: 用户评分（1-10 分制）
        redis_client: 可选的 Redis 客户端（未提供则创建新的）
    """
    if not movie_genres:
        return
    
    # 将评分归一化到 [0, 1]
    normalized_reward = rating / 10.0
    
    try:
        if redis_client is None:
            redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
        
        key = UCB_STATS_KEY.format(user_id=user_id)
        
        pipeline = redis_client.pipeline()
        
        for genre in movie_genres:
            # 获取当前统计数据
            current_raw = redis_client.hget(key, genre)
            
            if current_raw:
                current = json.loads(current_raw)
                current["n"] = current.get("n", 0) + 1
                current["reward"] = current.get("reward", 0) + normalized_reward
            else:
                current = {"n": 1, "reward": normalized_reward}
            
            pipeline.hset(key, genre, json.dumps(current))
        
        pipeline.execute()
        
        logger.debug(
            f"已更新用户 {user_id} 的 UCB 统计数据: "
            f"类型={movie_genres}, 评分={rating}"
        )
        
    except Exception as e:
        logger.error(f"更新 UCB 类型统计数据失败: {e}")
