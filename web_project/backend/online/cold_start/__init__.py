"""
冷启动模块

为交互历史不足的用户（冷启动用户）提供专门的推荐策略。

主要组件：
- ColdStartDetector: 判断用户是否为冷启动用户
- ColdStartService: 冷启动策略协调器
- UCBGenreStrategy: 使用 UCB 算法进行类型探索/利用
- PreferredGenreStrategy: 使用用户声明的 preferred_genres
- PopularRecentStrategy: 热门电影降级策略

UCB 策略从评分中学习，平衡探索新类型与利用用户喜欢的类型。

使用方式：
    from online.cold_start import get_cold_start_service
    
    service = get_cold_start_service()
    if service.is_cold_start(user_features):
        recommendations = await service.recommend(user_features, top_k=20)

当用户评分电影时更新 UCB 统计数据：
    from online.cold_start import update_ucb_genre_stats
    
    update_ucb_genre_stats(user_id, movie_genres, rating)
"""

from .detector import ColdStartDetector
from .service import ColdStartService, get_cold_start_service
from .base import ColdStartStrategy
from .preferred_genre import PreferredGenreStrategy
from .popular import PopularRecentStrategy
from .ucb_genre import UCBGenreStrategy, update_ucb_genre_stats

__all__ = [
    "ColdStartDetector",
    "ColdStartService",
    "ColdStartStrategy",
    "UCBGenreStrategy",
    "PreferredGenreStrategy",
    "PopularRecentStrategy", 
    "get_cold_start_service",
    "update_ucb_genre_stats",
]
