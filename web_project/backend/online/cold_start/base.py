"""
冷启动策略基类

定义冷启动推荐策略的接口。
这些策略用于处理交互历史很少或没有交互历史的用户。
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any


class ColdStartStrategy(ABC):
    """
    冷启动推荐策略的基类。
    
    冷启动策略处理交互历史不足以使用常规推荐流水线
    （召回 → 精排 → 重排序）的用户。
    """
    
    @property
    def name(self) -> str:
        """策略名称，用于日志和调试。"""
        return self.__class__.__name__
    
    @abstractmethod
    async def recommend(
        self, 
        user_features: Dict[str, Any], 
        k: int
    ) -> List[Dict[str, Any]]:
        """
        为冷启动用户生成推荐。
        
        Args:
            user_features: 用户特征字典，包含：
                - user_id: 用户标识符
                - preferred_genres: 用户声明的类型偏好（来自个人资料）
                - gender, age, occupation: 人口统计特征
            k: 推荐物品数量
            
        Returns:
            推荐物品列表，每个物品包含：
                - movie_id: 电影标识符
                - score: 推荐分数
                - cold_start_type: 生成该推荐的策略名称
                - title: 电影标题（可选）
                - genres: 电影类型（可选）
        """
        pass
    
    def can_handle(self, user_features: Dict[str, Any]) -> bool:
        """
        检查该策略是否能处理给定用户。
        
        重写此方法以实现策略特定的资格检查。
        例如，PreferredGenreStrategy 要求 preferred_genres 已设置。
        
        Args:
            user_features: 用户特征字典
            
        Returns:
            如果该策略能为用户生成推荐则返回 True
        """
        return True
