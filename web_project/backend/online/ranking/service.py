"""
精排服务

协调推荐流水线的精排阶段。
从召回获取候选并使用学习模型进行排序。
"""

import logging
from typing import List, Dict, Any, Optional

from .base import RankingStrategy
from .deepfm import DeepFMRankingStrategy, FallbackRankingStrategy
from .resource_manager import RankingResourceManager

logger = logging.getLogger(__name__)


class RankingService:
    """
    协调精排策略的服务
    
    实现单例模式以共享模型资源。
    如果精排模型不可用，回退到召回分数。
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RankingService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        # 初始化资源管理器 (加载模型)
        self.resource_manager = RankingResourceManager()
        
        # 初始化策略
        self._deepfm_strategy = DeepFMRankingStrategy()
        self._fallback_strategy = FallbackRankingStrategy()
        
        # 根据资源可用性选择主策略
        if self._deepfm_strategy.is_ready:
            self._primary_strategy = self._deepfm_strategy
            logger.info("RankingService: 使用 DeepFM 排序策略")
        else:
            self._primary_strategy = self._fallback_strategy
            logger.warning("RankingService: DeepFM 不可用, 使用回退策略")
        
        self._initialized = True
        logger.info("RankingService 初始化完成.")

    @property
    def is_ready(self) -> bool:
        """检查精排服务是否就绪"""
        return self._deepfm_strategy.is_ready

    @property
    def active_strategy(self) -> str:
        """获取当前活跃精排策略的名称"""
        return self._primary_strategy.name

    async def rank(
        self, 
        user_features: Dict[str, Any], 
        candidates: List[Dict[str, Any]],
        top_k: Optional[int] = None,
        strategy: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        为用户对候选物品进行排序
        
        Args:
            user_features: 用户特征字典，包含：
                - user_id: 用户标识符
                - gender, age, occupation, zip_code: 人口统计特征
                - hist_movie_ids: 用户的历史交互
            candidates: 召回阶段的候选物品列表
            top_k: 要返回的头部物品数量（None 表示全部）
            strategy: 覆盖策略（"deepfm" 或 "fallback"）
            
        Returns:
            带有 CTR 分数的排序物品列表
        """
        if not candidates:
            return []
        
        # 选择策略
        if strategy == "deepfm" and self._deepfm_strategy.is_ready:
            ranking_strategy = self._deepfm_strategy
        elif strategy == "fallback":
            ranking_strategy = self._fallback_strategy
        else:
            ranking_strategy = self._primary_strategy
        
        logger.debug(
            f"为用户 {user_features.get('user_id')} 排序 {len(candidates)} 个候选物品, 使用 {ranking_strategy.name} 策略"
        )
        
        # 执行排序
        ranked_items = await ranking_strategy.rank(user_features, candidates)
        
        # 应用 top_k 截断
        if top_k is not None and top_k > 0:
            ranked_items = ranked_items[:top_k]
        
        logger.debug(f"返回 {len(ranked_items)} 个排序物品")
        return ranked_items

    async def rank_with_item_features(
        self,
        user_features: Dict[str, Any],
        candidates: List[Dict[str, Any]],
        item_features_map: Dict[int, Dict[str, Any]],
        top_k: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        使用补充的物品特征对候选进行排序
        
        此方法在排序前为候选补充额外的物品特征，
        可以提高排序质量。
        
        Args:
            user_features: 用户特征字典
            candidates: 候选物品列表（包含 movie_id）
            item_features_map: movie_id 到物品特征的映射
                {movie_id: {"genres": ..., "isAdult": ..., "startYear": ...}}
            top_k: 要返回的头部物品数量
            
        Returns:
            排序后的物品列表
        """
        # 为候选补充物品特征
        enriched_candidates = []
        for candidate in candidates:
            movie_id = candidate.get("movie_id")
            item_feats = item_features_map.get(movie_id, {})
            
            enriched = {**candidate, **item_feats}
            enriched_candidates.append(enriched)
        
        return await self.rank(user_features, enriched_candidates, top_k)

    def reload_models(self):
        """
        重新加载精排模型
        
        用于在不重启服务器的情况下更新模型。
        """
        logger.info("重新加载精排模型...")
        
        # 创建新的资源管理器以强制重新加载
        RankingResourceManager._instance = None
        self.resource_manager = RankingResourceManager()
        
        # 重新初始化策略
        self._deepfm_strategy = DeepFMRankingStrategy()
        
        if self._deepfm_strategy.is_ready:
            self._primary_strategy = self._deepfm_strategy
            logger.info("模型重新加载完成: 使用 DeepFM")
        else:
            self._primary_strategy = self._fallback_strategy
            logger.warning("模型重新加载完成: DeepFM 不可用, 使用回退策略")


# 单例访问器
_ranking_service: Optional[RankingService] = None


def get_ranking_service() -> RankingService:
    """获取或创建单例 RankingService 实例"""
    global _ranking_service
    if _ranking_service is None:
        try:
            _ranking_service = RankingService()
            logger.info("RankingService 初始化完成.")
        except Exception as e:
            logger.error(f"初始化 RankingService 失败: {e}")
    return _ranking_service

