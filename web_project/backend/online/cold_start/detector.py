"""
冷启动检测器

根据用户的交互历史判断用户应该路由到冷启动流水线
还是常规推荐流水线。
"""

import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class ColdStartDetector:
    """
    检测用户是否处于"冷启动"状态。
    
    如果用户的交互（评分/点击）次数少于 `threshold`，
    则被视为冷启动用户。冷启动用户会被路由到专门的推荐流水线，
    该流水线使用显式偏好（preferred_genres）而非行为信号。
    """
    
    def __init__(self, threshold: int = 5):
        """
        初始化冷启动检测器。
        
        Args:
            threshold: 用户被视为"暖用户"的最小交互次数。
                      交互次数少于此值的用户为冷启动用户。
        """
        self.threshold = threshold
        logger.info(f"ColdStartDetector 初始化，阈值={threshold}")
    
    def is_cold_start(self, user_features: Dict[str, Any]) -> bool:
        """
        判断用户是否处于冷启动状态。
        
        用户为冷启动状态的条件：
        - 没有交互历史，或
        - 交互次数少于 `threshold`
        
        Args:
            user_features: 用户特征字典，包含：
                - hist_movie_ids: 用户交互过的电影 ID 列表
                
        Returns:
            如果用户是冷启动用户返回 True，否则返回 False
        """
        hist_movie_ids = user_features.get("hist_movie_ids", [])
        
        # 处理 None 或空列表
        if not hist_movie_ids:
            logger.debug(f"用户没有历史记录 - 冷启动")
            return True
        
        interaction_count = len(hist_movie_ids)
        is_cold = interaction_count < self.threshold
        
        logger.debug(
            f"用户有 {interaction_count} 次交互，"
            f"阈值={self.threshold}，是否冷启动={is_cold}"
        )
        
        return is_cold
    
    def get_interaction_count(self, user_features: Dict[str, Any]) -> int:
        """获取用户的交互次数。"""
        hist_movie_ids = user_features.get("hist_movie_ids", [])
        return len(hist_movie_ids) if hist_movie_ids else 0
