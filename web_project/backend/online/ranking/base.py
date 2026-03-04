"""
精排策略基类
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any


class RankingStrategy(ABC):
    """精排策略的抽象基类。"""
    
    @abstractmethod
    async def rank(
        self, 
        user_features: Dict[str, Any], 
        candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        为用户对候选物品进行排序。
        
        Args:
            user_features: 包含用户特征的字典
                - user_id: 用户标识符
                - gender, age, occupation, zip_code: 用户人口统计特征
                - hist_movie_ids: 用户的历史交互行为
            candidates: 召回阶段返回的候选物品列表
                - movie_id: 物品标识符
                - score: 召回分数（可选）
                - recall_type: 候选来源
                
        Returns:
            带有排序分数的排序物品列表，按排序分数降序排列。
            每个物品包含：
                - movie_id: 物品标识符
                - score: 排序分数（CTR 预估值）
                - recall_score: 原始召回分数（如有）
                - recall_type: 原始召回来源
        """
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """返回该精排策略的名称。"""
        pass
    
    @property
    def is_ready(self) -> bool:
        """检查策略是否就绪可用。"""
        return True
