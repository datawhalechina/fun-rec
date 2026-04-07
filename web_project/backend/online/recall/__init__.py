"""

多通道召回模块

本模块提供多通道召回用于推荐流水线。
从多个来源检索多样化的候选。

主要组件:
- RecallService: 协调召回策略
- RecallStrategy: 召回策略基类
- YouTubeDNNRecallStrategy: 深度学习召回
- UserPreferenceRecallStrategy: 用户偏好召回
- ItemEmbeddingRecallStrategy: 物品相似度召回
"""

from .service import RecallService, get_recall_service
from .base import RecallStrategy
from app.config import settings


__all__ = [
    "get_recall_service",
    "RecallService",
    "RecallStrategy",
]