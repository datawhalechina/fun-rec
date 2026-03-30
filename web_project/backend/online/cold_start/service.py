"""
冷启动服务

协调多个冷启动策略，为交互历史不足的用户生成推荐。
"""

import asyncio
import logging
from typing import List, Dict, Any, Optional

from .base import ColdStartStrategy
from .preferred_genre import PreferredGenreStrategy
from .popular import PopularRecentStrategy
from .ucb_genre import UCBGenreStrategy
from .detector import ColdStartDetector

logger = logging.getLogger(__name__)


class ColdStartService:
    """
    协调冷启动推荐策略的服务
    
    本服务管理多个冷启动策略并合并其结果。
    根据可用的用户数据确定策略优先级：
    
    1. UCBGenreStrategy - 基于类型的 UCB 探索/利用
    2. PreferredGenreStrategy - 如果用户设置了 preferred_genres（回退）
    3. PopularRecentStrategy - 热门电影回退    
    
    UCB 策略从评分中学习，平衡探索新类型和利用用户已表现出喜好的类型。
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ColdStartService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        # Initialize detector
        self.detector = ColdStartDetector(threshold=5)
        
        # Initialize strategies in priority order
        self.strategies: List[ColdStartStrategy] = [
            UCBGenreStrategy(),             # Priority 1: UCB exploration/exploitation
            PreferredGenreStrategy(),       # Priority 2: User stated preferences
            PopularRecentStrategy(),        # Priority 3: Popular fallback            
        ]
        
        self._initialized = True
        logger.info(
            f"ColdStartService initialized with {len(self.strategies)} strategies: "
            f"{[s.name for s in self.strategies]}"
        )
    
    @property
    def is_ready(self) -> bool:
        """检查服务是否就绪"""
        return len(self.strategies) > 0
    
    @property
    def strategy_names(self) -> List[str]:
        """获取所有已注册策略的名称"""
        return [s.name for s in self.strategies]
    
    def is_cold_start(self, user_features: Dict[str, Any]) -> bool:
        """检查用户是否处于冷启动模式"""
        return self.detector.is_cold_start(user_features)
    
    async def recommend(
        self, 
        user_features: Dict[str, Any], 
        top_k: int = 20
    ) -> List[Dict[str, Any]]:
        """
        生成冷启动推荐
        
        运行适用的策略并合并结果。策略优先级：
        1. 如果设置了 preferred_genres：PreferredGenreStrategy（80% 权重）
        2. PopularRecentStrategy（20% 权重）        
        
        Args:
            user_features: 包含 preferred_genres 等的用户特征字典
            top_k: 要返回的推荐数量
            
        Returns:
            包含 movie_id、score、cold_start_type 的推荐物品列表
        """
        # Find applicable strategies
        applicable_strategies = [
            s for s in self.strategies if s.can_handle(user_features)
        ]
        
        if not applicable_strategies:
            logger.warning("没有适用的冷启动策略")
            return []
        
        logger.info(
            f"运行 {len(applicable_strategies)} 个冷启动策略: "
            f"{[s.name for s in applicable_strategies]}"
        )
        
        # 根据可用性确定分配
        has_preferences = any(
            isinstance(s, PreferredGenreStrategy) and s.can_handle(user_features)
            for s in applicable_strategies
        )
        
        # 检查 UCB 是否学到了什么 (用户是否评分了一些电影)
        has_ucb_data = any(
            isinstance(s, UCBGenreStrategy) and s.can_handle(user_features)
            for s in applicable_strategies
        )
        
        if has_ucb_data:
            # UCB 有数据 - 优先使用 UCB 进行探索/利用
            allocations = self._get_ucb_weighted_allocation(
                applicable_strategies, top_k
            )
        elif has_preferences:
            # 用户有偏好但无 UCB 数据 - 使用偏好
            allocations = self._get_preference_weighted_allocation(
                applicable_strategies, top_k
            )
        else:
            # 无偏好, 无 UCB - 回退到热门
            allocations = self._get_fallback_allocation(
                applicable_strategies, top_k
            )
        
        # 并行运行策略
        tasks = []
        for strategy, k in allocations:
            if k > 0:
                tasks.append(self._run_strategy(strategy, user_features, k))
        
        results_list = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 合并结果
        return self._merge_results(results_list, top_k)
    
    def _get_ucb_weighted_allocation(
        self, 
        strategies: List[ColdStartStrategy], 
        top_k: int
    ) -> List[tuple]:
        """
        UCB: 70% - 主要推荐策略
        Popular: 20% - 保证多样性和新鲜度
        PreferredGenre: 10% - 尊重用户明确偏好

        """
        allocations = []
        for s in strategies:
            if isinstance(s, UCBGenreStrategy):
                allocations.append((s, int(top_k * 0.7)))
            elif isinstance(s, PopularRecentStrategy):
                allocations.append((s, int(top_k * 0.2)))
            elif isinstance(s, PreferredGenreStrategy):
                allocations.append((s, int(top_k * 0.1)))
        return allocations
    
    def _get_preference_weighted_allocation(
        self, 
        strategies: List[ColdStartStrategy], 
        top_k: int
    ) -> List[tuple]:
        """
        用户有偏好但无 UCB 数据时的分配
        PreferredGenre: 80%, Popular: 20%
        """
        allocations = []
        for s in strategies:
            if isinstance(s, UCBGenreStrategy):
                allocations.append((s, 0))  # 跳过 - 尚无 UCB 数据
            elif isinstance(s, PreferredGenreStrategy):
                allocations.append((s, int(top_k * 0.8)))
            elif isinstance(s, PopularRecentStrategy):
                allocations.append((s, int(top_k * 0.2)))
        return allocations
    
    def _get_fallback_allocation(
        self, 
        strategies: List[ColdStartStrategy], 
        top_k: int
    ) -> List[tuple]:
        """
        用户无偏好且无 UCB 数据时的分配
        Popular: 100%
        """
        allocations = []
        for s in strategies:
            if isinstance(s, UCBGenreStrategy):
                allocations.append((s, 0))  # 跳过 - 无数据
            elif isinstance(s, PreferredGenreStrategy):
                allocations.append((s, 0))  # 跳过 - 无偏好
            elif isinstance(s, PopularRecentStrategy):
                allocations.append((s, int(top_k)))
        return allocations
    
    async def _run_strategy(
        self, 
        strategy: ColdStartStrategy, 
        user_features: Dict[str, Any], 
        k: int
    ) -> List[Dict[str, Any]]:
        """运行单个策略并处理错误"""
        try:
            return await strategy.recommend(user_features, k)
        except Exception as e:
            logger.error(f"策略 {strategy.name} 失败: {e}")
            return []
    
    def _merge_results(
        self, 
        results_list: List[List[Dict[str, Any]]], 
        top_k: int
    ) -> List[Dict[str, Any]]:
        """
        合并多个策略的结果
        
        使用轮询交替获取结果以确保多样性。
        按 movie_id 去重。
        """
        merged = []
        seen_ids = set()
        
        # 过滤异常和空结果
        valid_results = []
        for results in results_list:
            if isinstance(results, Exception):
                logger.error(f"策略返回异常: {results}")
            elif results:
                valid_results.append(results)
        
        if not valid_results:
            return []
        
        # 轮询合并
        pointers = [0] * len(valid_results)
        
        while len(merged) < top_k:
            added_any = False
            
            for i, results in enumerate(valid_results):
                if len(merged) >= top_k:
                    break
                    
                while pointers[i] < len(results):
                    item = results[pointers[i]]
                    pointers[i] += 1
                    movie_id = item.get("movie_id")
                    
                    if movie_id and movie_id not in seen_ids:
                        merged.append(item)
                        seen_ids.add(movie_id)
                        added_any = True
                        break
            
            # 检查是否所有来源都已耗尽
            if not added_any:
                break
        
        logger.info(f"ColdStartService 合并 {len(merged)} 个唯一推荐")
        return merged
    
    def get_health_status(self) -> Dict[str, Any]:
        """获取冷启动服务的健康状态"""
        return {
            "ready": self.is_ready,
            "strategies": self.strategy_names,
            "detector_threshold": self.detector.threshold,
        }


# 单例访问器
_cold_start_service: Optional[ColdStartService] = None


def get_cold_start_service() -> ColdStartService:
    """获取或创建单例冷启动服务"""
    global _cold_start_service
    if _cold_start_service is None:
        _cold_start_service = ColdStartService()
    return _cold_start_service

