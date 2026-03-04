"""
重排序服务

协调推荐流水线的重排序阶段。
获取排序后的物品并应用多样性/业务规则优化。

服务按顺序链接多个重排序策略，
支持多维度多样性（如类型 + 年代打散）。
"""

import logging
from typing import List, Dict, Any, Optional

from .base import RerankingStrategy
from .dispersion import GenreDispersionStrategy, DecadeDispersionStrategy

logger = logging.getLogger(__name__)


class RerankingService:
    """
    协调多个重排序策略的服务
    
    实现单例模式以确保跨请求的一致行为。
    策略按顺序应用（链式），支持多维度多样性优化。
    
    示例:
        默认配置应用：
        1. 类型打散（最多 2 个连续相同类型）
        2. 年代打散（最多 3 个连续相同年代）
        
        这确保最终列表在内容类型和年代上都具有多样性。
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RerankingService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        # 初始化默认策略 (可以重新配置)
        self._strategies: List[RerankingStrategy] = [
            GenreDispersionStrategy(max_consecutive=2),
            DecadeDispersionStrategy(max_consecutive=2),
        ]
        
        self._enabled = True
        self._initialized = True
        
        strategy_names = [s.name for s in self._strategies]
        logger.info(f"重排序服务初始化完成, 策略: {strategy_names}")

    @property
    def is_ready(self) -> bool:
        """检查重排序服务是否就绪"""
        return all(s.is_ready for s in self._strategies)

    @property
    def enabled(self) -> bool:
        """检查重排序是否启用"""
        return self._enabled
    
    @enabled.setter
    def enabled(self, value: bool):
        """启用或禁用重排序"""
        self._enabled = value
        logger.info(f"Reranking {'enabled' if value else 'disabled'}")

    @property
    def strategy_names(self) -> List[str]:
        """获取活跃策略的名称"""
        return [s.name for s in self._strategies]

    def configure_strategies(self, strategies: List[RerankingStrategy]) -> None:
        """
        用新策略替换当前策略
        
        Args:
            strategies: 要使用的 RerankingStrategy 实例列表。
                策略将按提供的顺序应用。
        """
        self._strategies = strategies
        strategy_names = [s.name for s in self._strategies]
        logger.info(f"RerankingService 重新配置, 策略: {strategy_names}")

    def add_strategy(self, strategy: RerankingStrategy) -> None:
        """
        将策略添加到链的末尾
        
        Args:
            strategy: 要添加的 RerankingStrategy 实例
        """
        self._strategies.append(strategy)
        logger.info(f"添加策略: {strategy.name}")

    def clear_strategies(self) -> None:
        """移除所有策略（实际上禁用重排序）"""
        self._strategies = []
        logger.info("所有重排序策略清除")

    async def rerank(
        self, 
        items: List[Dict[str, Any]],
        user_features: Optional[Dict[str, Any]] = None,
        strategies: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        将重排序策略应用于输入物品
        
        策略按链式顺序依次应用。每个策略
        接收前一个策略的输出。
        
        Args:
            items: 精排阶段的排序物品列表
            user_features: 可选的用户上下文，用于个性化重排序
            strategies: 可选的要应用的策略名称列表。
                如果为 None，则应用所有配置的策略。
                
        Returns:
            重排序后的物品列表
        """
        if not items:
            return []
        
        if not self._enabled:
            logger.debug("重排序禁用, 返回物品不变")
            return items
        
        # 选择要应用的策略
        if strategies:
            active_strategies = [
                s for s in self._strategies 
                if s.name in strategies
            ]
        else:
            active_strategies = self._strategies
        
        if not active_strategies:
            logger.debug("没有活跃策略, 返回物品不变")
            return items
        
        # 按链式顺序应用策略
        result = items
        for strategy in active_strategies:
            if not strategy.is_ready:
                logger.warning(f"策略 {strategy.name} 不可用, 跳过")
                continue
                
            try:
                result = await strategy.rerank(result, user_features)
                logger.debug(
                    f"应用 {strategy.name}: {len(items)} -> {len(result)} 个物品"
                )
            except Exception as e:
                logger.error(f"策略 {strategy.name} 失败: {e}")
                # 失败时继续使用前一个结果
                continue
        
        return result

    def get_health_status(self) -> Dict[str, Any]:
        """获取重排序服务的健康状态"""
        return {
            "enabled": self._enabled,
            "ready": self.is_ready,
            "strategies": [
                {
                    "name": s.name,
                    "ready": s.is_ready,
                }
                for s in self._strategies
            ]
        }


# 单例访问器
_reranking_service: Optional[RerankingService] = None


def get_reranking_service() -> RerankingService:
    """获取或创建单例 RerankingService 实例"""
    global _reranking_service
    if _reranking_service is None:
        try:
            _reranking_service = RerankingService()
            logger.info("重排序服务初始化完成.")
        except Exception as e:
            logger.error(f"重排序服务初始化失败: {e}")
    return _reranking_service

