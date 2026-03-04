"""
召回策略基类

定义所有召回策略的抽象接口。
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any

class RecallStrategy(ABC):
    """召回策略抽象基类"""
    
    @abstractmethod
    async def recall(self, user_context: Dict[str, Any], k: int) -> List[Dict[str, Any]]:
        """
        执行召回
        
        Args:
            user_context: 包含用户特征和历史的字典
            k: 要召回的物品数量
            
        Returns:
            召回物品列表（包含 movie_id、score 等的字典）
        """
        pass

