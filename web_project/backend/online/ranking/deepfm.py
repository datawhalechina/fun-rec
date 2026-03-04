"""
DeepFM 精排策略

使用 DeepFM 模型对候选物品进行 CTR 预估排序。
"""

import asyncio
import logging
from typing import List, Dict, Any

import numpy as np

from .base import RankingStrategy
from .resource_manager import RankingResourceManager

logger = logging.getLogger(__name__)


class DeepFMRankingStrategy(RankingStrategy):
    """
    基于 DeepFM 的精排策略。
    
    使用训练好的 DeepFM 模型预测每个用户-物品对的点击率（CTR），
    然后按预测 CTR 对候选物品进行排序。
    """
    
    def __init__(self):
        self.resource_manager = RankingResourceManager()
        
    @property
    def name(self) -> str:
        return "deepfm"
    
    @property
    def is_ready(self) -> bool:
        return self.resource_manager.is_ready

    def _prepare_batch_inputs(
        self, 
        user_features: Dict[str, Any], 
        candidates: List[Dict[str, Any]]
    ) -> Dict[str, np.ndarray]:
        """
        为 DeepFM 模型准备批量输入。
        
        创建特征数组，其中每行是一个用户-物品对。
        用户特征会复制到所有候选物品。
        
        Args:
            user_features: 用户特征字典
            candidates: 候选物品列表
            
        Returns:
            可直接用于模型预测的 numpy 数组字典
        """
        rm = self.resource_manager
        batch_size = len(candidates)
        
        # 初始化输入数组
        inputs = {}
        
        # 编码用户特征（所有候选物品共享相同的用户特征）
        for feat in rm.user_features:
            raw_val = user_features.get(feat)
            encoded_val = rm.encode_feature(feat, raw_val)
            # 复制到批次中的每个样本
            inputs[feat] = np.full(batch_size, encoded_val, dtype=np.int32)
        
        # 编码物品特征（每个候选物品不同）
        for feat in rm.item_features:
            encoded_values = []
            for candidate in candidates:
                # 尝试从候选字典中获取
                raw_val = candidate.get(feat)
                
                # 对于 movie_id，确保使用原始 ID
                if feat == "movie_id":
                    raw_val = candidate.get("movie_id")
                    
                encoded_val = rm.encode_feature(feat, raw_val)
                encoded_values.append(encoded_val)
            
            inputs[feat] = np.array(encoded_values, dtype=np.int32)
        
        return inputs

    def _rank_sync(
        self, 
        user_features: Dict[str, Any], 
        candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        同步执行排序逻辑（在线程池中运行）。
        
        Args:
            user_features: 用户特征
            candidates: 候选物品
            
        Returns:
            带有分数的排序候选列表
        """
        if not candidates:
            return []
            
        try:
            # 准备批量输入
            inputs = self._prepare_batch_inputs(user_features, candidates)
            
            # 模型预测
            predictions = self.resource_manager.ranking_model.predict(
                inputs, 
                verbose=0, 
                batch_size=min(len(candidates), 256)
            )
            
            # 处理不同的输出形状
            if predictions.ndim > 1:
                predictions = predictions.flatten()
            
            # 与候选物品合并
            ranked_results = []
            for i, candidate in enumerate(candidates):
                score = float(predictions[i])
                ranked_results.append({
                    "movie_id": candidate["movie_id"],
                    "score": score,  # 排序分数（CTR 预估值）
                    "recall_score": candidate.get("score", 0.0),
                    "recall_type": candidate.get("recall_type", "unknown"),
                })
            
            # 按排序分数降序排列
            ranked_results.sort(key=lambda x: x["score"], reverse=True)
            
            # logger.debug(f"DeepFM 对 {len(ranked_results)} 个候选完成排序")
            logger.info(f"DeepFM 精排结果: {len(ranked_results)} 个候选物品")
            return ranked_results
            
        except Exception as e:
            logger.error(f"DeepFM 精排失败: {e}")
            import traceback
            traceback.print_exc()
            # 降级处理：返回带有原始召回分数的候选物品
            return [
                {
                    "movie_id": c["movie_id"],
                    "score": c.get("score", 0.0),
                    "recall_score": c.get("score", 0.0),
                    "recall_type": c.get("recall_type", "unknown"),
                }
                for c in candidates
            ]

    async def rank(
        self, 
        user_features: Dict[str, Any], 
        candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        使用 DeepFM 模型对候选物品进行排序。
        
        Args:
            user_features: 用户特征字典
            candidates: 召回阶段返回的候选物品列表
            
        Returns:
            按预测 CTR 排序的物品列表
        """
        if not self.is_ready:
            logger.warning("DeepFM 模型未就绪，返回原始候选列表")
            return candidates
            
        if not candidates:
            return []
        
        # 在线程池中运行 CPU 密集型预测任务
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, 
            self._rank_sync, 
            user_features, 
            candidates
        )


class FallbackRankingStrategy(RankingStrategy):
    """
    降级精排策略，使用召回分数进行排序。
    
    当 DeepFM 模型不可用时使用。
    简单地按召回分数对候选物品进行排序。
    """
    
    @property
    def name(self) -> str:
        return "fallback"
    
    async def rank(
        self, 
        user_features: Dict[str, Any], 
        candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """按召回分数对候选物品进行排序。"""
        sorted_candidates = sorted(
            candidates, 
            key=lambda x: x.get("score", 0.0), 
            reverse=True
        )
        return [
            {
                "movie_id": c["movie_id"],
                "score": c.get("score", 0.0),
                "recall_score": c.get("score", 0.0),
                "recall_type": c.get("recall_type", "unknown"),
            }
            for c in sorted_candidates
        ]
