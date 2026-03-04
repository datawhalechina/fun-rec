"""
连续打散重排序策略

本模块实现基于多样性的重排序算法，确保结果列表中不会有超过 N 个连续的物品
具有相同的属性值（如类型、年代等）。

该算法在满足多样性约束的同时，尽可能保持原始排序顺序，
从而提升推荐结果的多样性和用户体验。
"""

import logging
from typing import List, Dict, Any, Callable, Optional

from .base import RerankingStrategy

logger = logging.getLogger(__name__)


class ConsecutiveDispersionStrategy(RerankingStrategy):
    """
    通用连续打散策略。
    
    确保结果列表中不会有超过 `max_consecutive` 个具有相同属性值的物品连续出现。
    
    算法流程：
    1. 按排序顺序遍历候选物品
    2. 对于每个候选物品，检查添加它是否会超过 max_consecutive 限制
    3. 如果超过，则将其放入"待处理"队列
    4. 如果未超过，则添加到结果列表，并尝试插入待处理队列中的物品
    5. 最后，将剩余的待处理物品追加到结果末尾
    
    该算法在满足多样性约束的同时，尽可能保持原始排序顺序。
    """
    
    def __init__(
        self,
        feature_extractor: Callable[[Dict[str, Any]], Optional[str]],
        max_consecutive: int = 2,
        strategy_name: str = "consecutive_dispersion"
    ):
        """
        初始化打散策略。
        
        Args:
            feature_extractor: 从物品中提取打散键值的函数。
                如果特征不可用则返回 None（该物品将直接通过）。
            max_consecutive: 允许的最大连续相同键值物品数量。
            strategy_name: 策略实例的名称。
        """
        self._feature_extractor = feature_extractor
        self._max_consecutive = max_consecutive
        self._strategy_name = strategy_name
    
    @property
    def name(self) -> str:
        return self._strategy_name
    
    @property
    def max_consecutive(self) -> int:
        return self._max_consecutive
    
    def _get_recent_keys(
        self, 
        result: List[Dict[str, Any]], 
        count: int
    ) -> List[Optional[str]]:
        """获取结果列表中最后 `count` 个物品的打散键值。"""
        recent = result[-count:] if len(result) >= count else result
        return [self._feature_extractor(item) for item in recent]
    
    def _can_add(
        self, 
        item: Dict[str, Any], 
        result: List[Dict[str, Any]]
    ) -> bool:
        """
        检查添加该物品是否会违反连续约束。
        
        如果可以添加该物品而不超过 max_consecutive 限制，则返回 True。
        """
        if len(result) < self._max_consecutive:
            return True
        
        item_key = self._feature_extractor(item)        
        
        # 没有该特征的物品始终允许通过
        if item_key is None:
            return True
        
        # 检查最后 (max_consecutive - 1) 个物品
        recent_keys = self._get_recent_keys(result, self._max_consecutive - 1)
        
        # 如果最近的所有物品都与当前物品具有相同的键值，则不能添加
        if all(k == item_key for k in recent_keys):
            return False
        
        return True
    
    async def rerank(
        self, 
        items: List[Dict[str, Any]],
        user_features: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        对物品进行重排序以确保连续多样性。
        
        物品按原始排序顺序处理。当某个物品会违反连续约束时，
        将其延迟处理，稍后在合适时机插入。
        """
        if not items:
            return []
        
        if len(items) <= self._max_consecutive:
            return items
        
        result: List[Dict[str, Any]] = []
        deferred: List[Dict[str, Any]] = []
        
        for item in items:
            if self._can_add(item, result):
                result.append(item)
                
                # 尝试插入待处理队列中的物品
                self._try_insert_deferred(result, deferred)
            else:
                deferred.append(item)
        
        # 将剩余的待处理物品追加到末尾
        # （这些物品无法在不违反约束的情况下插入）
        result.extend(deferred)
        
        logger.info(
            f"{self.name}: 重排序 {len(items)} 个物品，"
            f"{len(deferred)} 个物品被延迟到末尾"
        )
        
        return result
    
    def _try_insert_deferred(
        self, 
        result: List[Dict[str, Any]], 
        deferred: List[Dict[str, Any]]
    ) -> None:
        """尝试插入现在满足约束条件的待处理物品。"""
        inserted_indices = []
        
        for i, item in enumerate(deferred):
            if self._can_add(item, result):
                result.append(item)
                inserted_indices.append(i)
        
        # 从待处理队列中移除已插入的物品（倒序遍历以保持索引正确）
        for i in reversed(inserted_indices):
            deferred.pop(i)


# =============================================================================
# 预配置的策略实例
# =============================================================================

def _extract_genre(item: Dict[str, Any]) -> Optional[str]:
    """从物品中提取主要类型。"""
    # print(f"提取物品的类型: {item}")
    genres = item.get("genres")
    if genres is None:
        return None
    
    # 处理类型列表 - 使用第一个类型
    if isinstance(genres, list):
        return genres[0] if genres else None
    
    # 处理以逗号或竖线分隔的字符串
    if isinstance(genres, str):
        if "|" in genres:
            return genres.split("|")[0].strip()
        if "," in genres:
            return genres.split(",")[0].strip()
        return genres.strip() if genres.strip() else None
    
    return None


def _extract_decade(item: Dict[str, Any]) -> Optional[str]:
    """从物品的年份中提取年代区间。"""    
    year = item.get("year") or item.get("startYear")
    
    if year is None:
        return None
    
    try:
        year_int = int(year)
        if year_int < 1900 or year_int > 2100:
            return None
        decade = (year_int // 10) * 10
        return f"{decade}s"
    except (ValueError, TypeError):
        return None


class GenreDispersionStrategy(ConsecutiveDispersionStrategy):
    """
    基于电影类型的打散策略。
    
    确保不会有超过 `max_consecutive` 个相同主要类型的电影连续出现。
    如果存在多个类型，则使用第一个类型。
    
    示例：
        当 max_consecutive=2 时：
        [动作, 动作, 动作, 喜剧] -> [动作, 动作, 喜剧, 动作]
    """
    
    def __init__(self, max_consecutive: int = 2):
        super().__init__(
            feature_extractor=_extract_genre,
            max_consecutive=max_consecutive,
            strategy_name="genre_dispersion"
        )


class DecadeDispersionStrategy(ConsecutiveDispersionStrategy):
    """
    基于电影上映年代的打散策略。
    
    确保不会有超过 `max_consecutive` 个相同年代的电影连续出现。
    年份按年代分桶（1990年代、2000年代等）。
    
    示例：
        当 max_consecutive=3 时：
        [2020, 2021, 2019, 2022, 1995] -> [2020, 2021, 2019, 1995, 2022]
    """
    
    def __init__(self, max_consecutive: int = 3):
        super().__init__(
            feature_extractor=_extract_decade,
            max_consecutive=max_consecutive,
            strategy_name="decade_dispersion"
        )


# 用于创建自定义打散策略的工厂函数
def create_dispersion_strategy(
    feature_name: str,
    feature_extractor: Callable[[Dict[str, Any]], Optional[str]],
    max_consecutive: int = 2
) -> ConsecutiveDispersionStrategy:
    """
    为任意特征创建自定义打散策略。
    
    Args:
        feature_name: 特征名称（用于策略命名）
        feature_extractor: 从物品中提取打散键值的函数
        max_consecutive: 允许的最大连续相同物品数量
        
    Returns:
        配置好的 ConsecutiveDispersionStrategy 实例
        
    示例：
        # 按导演进行打散
        director_strategy = create_dispersion_strategy(
            feature_name="director",
            feature_extractor=lambda x: x.get("director"),
            max_consecutive=2
        )
    """
    return ConsecutiveDispersionStrategy(
        feature_extractor=feature_extractor,
        max_consecutive=max_consecutive,
        strategy_name=f"{feature_name}_dispersion"
    )
