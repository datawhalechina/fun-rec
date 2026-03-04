"""
重排序模块

本模块为推荐流水线提供重排序功能。
接收精排后的物品列表，应用多样性和业务规则优化。

主要组件：
- RerankingService: 重排序策略协调器
- ConsecutiveDispersionStrategy: 通用的打散重排序策略
- GenreDispersionStrategy: 基于类型的多样性预设
- DecadeDispersionStrategy: 基于年代的多样性预设

使用方式：
    from online.reranking import get_reranking_service
    
    service = get_reranking_service()
    reranked = await service.rerank(items, user_features)
"""

from .service import RerankingService, get_reranking_service
from .base import RerankingStrategy
from .dispersion import (
    ConsecutiveDispersionStrategy,
    GenreDispersionStrategy,
    DecadeDispersionStrategy,
    create_dispersion_strategy,
)

__all__ = [
    "get_reranking_service",
    "RerankingService",
    "RerankingStrategy",
    "ConsecutiveDispersionStrategy",
    "GenreDispersionStrategy",
    "DecadeDispersionStrategy",
    "create_dispersion_strategy",
]
