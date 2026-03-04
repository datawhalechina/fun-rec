"""
精排模块

本模块为推荐流水线提供精排功能。
接收召回阶段的候选物品，使用机器学习模型进行排序。

主要组件：
- RankingService: 精排策略协调器
- DeepFMRankingStrategy: 基于 DeepFM 的 CTR 预估精排
- RankingResourceManager: 加载和管理精排模型
"""

from .service import RankingService, get_ranking_service
from .base import RankingStrategy

__all__ = [
    "get_ranking_service",
    "RankingService",
    "RankingStrategy",
]
