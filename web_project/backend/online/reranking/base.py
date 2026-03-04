"""
重排序策略基类

重排序是推荐流水线的最终阶段，优化多样性、业务规则或其他目标的展示顺序。
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any


class RerankingStrategy(ABC):
    """重排序策略抽象基类"""
    
    @abstractmethod
    async def rerank(
        self, 
        items: List[Dict[str, Any]],
        user_features: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        重排序物品以优化特定目标。
        
        Args:
            items: 精排阶段的排序物品列表
                每个物品包含:
                - movie_id: 物品标识符
                - score: 排序分数
                - genres: 物品类型 (列表或字符串)
                - year: 上映年份 (可选)
                - 其他物品特征
            user_features: 可选的用户上下文，用于个性化重排序
                
        Returns:
            新的展示顺序的重排序物品列表。
        """
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """返回重排序策略的名称。"""
        pass
    
    @property
    def is_ready(self) -> bool:
        """检查策略是否准备好服务。"""
        return True

