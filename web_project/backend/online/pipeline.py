"""
在线推荐流水线

本模块提供统一的推荐流水线：
1. 冷启动检测：将新用户路由到冷启动路径
2. 召回：多通道候选检索（100-200 个候选）
3. 精排：使用 DeepFM 进行 CTR 预估（前 20-30 个）
4. 重排序：多样性优化（类型 + 年代打散）

冷启动路径（交互次数 < N 的用户）：
- 使用 preferred_genres 进行个性化推荐
- 回退到热门策略

所有推荐业务逻辑都在这里实现。
API 端点应该是此流水线的轻量级封装。

使用方法:
    from online.pipeline import get_pipeline
    
    pipeline = get_pipeline()
    result = await pipeline.recommend(user_features, item_features_provider)
"""

import logging
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Callable, Awaitable

from online.recall import get_recall_service
from online.ranking import get_ranking_service
from online.reranking import get_reranking_service
from online.cold_start import get_cold_start_service

logger = logging.getLogger(__name__)


@dataclass
class PipelineConfig:
    """推荐流水线配置"""
    recall_top_k: int = 100       # 召回阶段的候选数
    ranking_top_k: int = 20       # 精排后的结果数（重排序前）
    enable_ranking: bool = True   # 是否使用精排模型
    enable_reranking: bool = True # 是否应用重排序
    
    # 冷启动配置
    enable_cold_start: bool = True      # 是否检测和处理冷启动用户
    cold_start_threshold: int = 5       # 交互次数 < 阈值的用户为冷启动用户
    cold_start_top_k: int = 20          # 冷启动用户的推荐数量


@dataclass
class RecommendationItem:
    """单个推荐结果"""
    movie_id: int
    score: float                          # 最终排序分数
    recall_score: Optional[float] = None  # 原始召回分数
    recall_type: Optional[str] = None     # 来源召回通道


@dataclass
class RecommendationResult:
    """推荐流水线的结果"""
    items: List[RecommendationItem] = field(default_factory=list)
    recall_count: int = 0
    ranking_strategy: str = "none"
    reranking_strategies: List[str] = field(default_factory=list)
    is_cold_start: bool = False  # 结果是否来自冷启动流水线
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典用于 API 响应"""
        return {
            "items": [
                {
                    "movie_id": item.movie_id,
                    "score": item.score,
                    "recall_score": item.recall_score,
                    "recall_type": item.recall_type,
                }
                for item in self.items
            ],
            "recall_count": self.recall_count,
            "ranking_strategy": self.ranking_strategy,
            "reranking_strategies": self.reranking_strategies,
            "is_cold_start": self.is_cold_start,
        }


# 物品特征提供器函数的类型别名
ItemFeaturesProvider = Callable[[List[int]], Awaitable[Dict[int, Dict[str, Any]]]]


class RecommendationPipeline:
    """
    端到端推荐流水线
    
    协调冷启动检测、召回、精排和重排序各阶段。
    本类包含所有推荐业务逻辑。
    
    对于冷启动用户（交互次数 < 阈值）：
        - 路由到使用 preferred_genres 的 ColdStartService
        - 跳过正常的召回/精排流水线
        - 仍可应用重排序以提高多样性
    
    对于活跃用户（交互次数 >= 阈值）：
        - 正常流水线：召回 → 精排 → 重排序
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RecommendationPipeline, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.recall_service = get_recall_service()
        self.ranking_service = get_ranking_service()
        self.reranking_service = get_reranking_service()
        self.cold_start_service = get_cold_start_service()
        self._initialized = True
        
        logger.info(
            f"推荐流水线初始化完成. "
            f"召回就绪: {self.recall_service is not None}, "
            f"精排就绪: {self.ranking_service is not None and self.ranking_service.is_ready}, "
            f"重排序就绪: {self.reranking_service is not None and self.reranking_service.is_ready}, "
            f"冷启动就绪: {self.cold_start_service is not None and self.cold_start_service.is_ready}"
        )
        
    @property
    def is_ready(self) -> bool:
        """检查流水线是否就绪可用"""
        return self.recall_service is not None
    
    @property
    def is_ranking_ready(self) -> bool:
        """检查精排是否可用"""
        return self.ranking_service is not None and self.ranking_service.is_ready

    @property
    def is_reranking_ready(self) -> bool:
        """检查重排序是否可用"""
        return self.reranking_service is not None and self.reranking_service.is_ready

    @property
    def is_cold_start_ready(self) -> bool:
        """检查冷启动处理是否可用"""
        return self.cold_start_service is not None and self.cold_start_service.is_ready

    def set_movie_genre_map(self, movies: List[Any]):
        """
        初始化召回策略的电影类型映射
        
        应在应用启动时使用电影数据调用一次。
        """
        if self.recall_service:
            self.recall_service.set_movie_genre_map(movies)

    @property
    def movie_genre_map(self) -> Dict:
        """从召回服务获取电影类型映射"""
        if self.recall_service:
            return self.recall_service.movie_genre_map
        return {}

    async def recommend(
        self,
        user_features: Dict[str, Any],
        item_features_provider: Optional[ItemFeaturesProvider] = None,
        config: Optional[PipelineConfig] = None
    ) -> RecommendationResult:
        """
        运行完整的推荐流水线
        
        Args:
            user_features: 用户特征字典，包含：
                - user_id: 用户标识符
                - gender, age, occupation, zip_code: 人口统计特征
                - hist_movie_ids: 用户的历史交互
                - preferred_genres: 用户声明的类型偏好（用于冷启动）
            item_features_provider: 异步函数，根据 movie_ids 列表获取物品特征。
                用于精排和重排序阶段。
                签名: async (movie_ids: List[int]) -> Dict[int, Dict[str, Any]]
            config: 流水线配置
            
        Returns:
            包含排序物品和元数据的 RecommendationResult
        """
        config = config or PipelineConfig()
        
        # === 冷启动检测 ===
        if config.enable_cold_start and self._is_cold_start(user_features, config):
            logger.info(f"User detected as cold start, routing to cold start pipeline")
            
            return await self._cold_start_recommend(
                user_features=user_features,
                item_features_provider=item_features_provider,
                config=config
            )
        
        # === 活跃用户的正常流水线 ===
        
        # === 阶段 1: 召回 ===
        candidates = await self._recall(user_features, config.recall_top_k)
        
        if not candidates:
            return RecommendationResult()
        
        recall_count = len(candidates)
        
        # === 阶段 2: 精排 ===
        ranked_items, ranking_strategy = await self._rank(
            user_features=user_features,
            candidates=candidates,
            item_features_provider=item_features_provider,
            top_k=config.ranking_top_k,
            enable_ranking=config.enable_ranking
        )
        
        # === 阶段 3: 重排序 ===
        reranked_items, reranking_strategies = await self._rerank(
            items=ranked_items,
            user_features=user_features,
            item_features_provider=item_features_provider,
            enable_reranking=config.enable_reranking
        )
        
        # 转换为结果对象
        items = [
            RecommendationItem(
                movie_id=item["movie_id"],
                score=item.get("score", 0.0),
                recall_score=item.get("recall_score"),
                recall_type=item.get("recall_type"),
            )
            for item in reranked_items
        ]
        
        return RecommendationResult(
            items=items,
            recall_count=recall_count,
            ranking_strategy=ranking_strategy,
            reranking_strategies=reranking_strategies
        )
    
    def _is_cold_start(
        self, 
        user_features: Dict[str, Any], 
        config: PipelineConfig
    ) -> bool:
        """
        检查用户是否应路由到冷启动流水线
        
        如果用户的交互次数少于阈值，则为冷启动用户。
        """
        if not self.is_cold_start_ready:
            return False
        
        # 从配置更新检测器阈值
        self.cold_start_service.detector.threshold = config.cold_start_threshold
        return self.cold_start_service.is_cold_start(user_features)
    
    async def _cold_start_recommend(
        self,
        user_features: Dict[str, Any],
        item_features_provider: Optional[ItemFeaturesProvider],
        config: PipelineConfig
    ) -> RecommendationResult:
        """
        使用专门策略处理冷启动用户
        
        使用 ColdStartService，优先级：
        1. PreferredGenreStrategy（如果用户设置了 preferred_genres）
        2. PopularRecentStrategy（回退策略）
        """
        if not self.is_cold_start_ready:
            logger.warning("冷启动服务不可用, 回退到正常流水线")
            return RecommendationResult()
        
        try:
            # 获取冷启动推荐
            candidates = await self.cold_start_service.recommend(
                user_features=user_features,
                top_k=config.cold_start_top_k
            )
            
            if not candidates:
                logger.warning("冷启动返回空候选")
                return RecommendationResult()
            
            # 可选应用重排序以提高多样性
            reranking_strategies = []
            if config.enable_reranking and self.is_reranking_ready:
                # 补充物品特征以应用重排序
                if item_features_provider:
                    movie_ids = [c["movie_id"] for c in candidates]
                    item_features_map = await item_features_provider(movie_ids)
                    candidates = [
                        {**c, **item_features_map.get(c["movie_id"], {})}
                        for c in candidates
                    ]
                
                candidates, reranking_strategies = await self._rerank(
                    items=candidates,
                    user_features=user_features,
                    item_features_provider=item_features_provider,
                    enable_reranking=True
                )
            
            # 转换为结果对象
            items = [
                RecommendationItem(
                    movie_id=c["movie_id"],
                    score=c.get("score", 0.0),
                    recall_score=c.get("score"),
                    recall_type=c.get("cold_start_type", "cold_start"),
                )
                for c in candidates
            ]
            
            return RecommendationResult(
                items=items,
                recall_count=len(candidates),
                ranking_strategy="cold_start",
                reranking_strategies=reranking_strategies,
                is_cold_start=True
            )
            
        except Exception as e:
            logger.error(f"冷启动推荐失败: {e}")
            return RecommendationResult(is_cold_start=True)

    async def _recall(
        self, 
        user_features: Dict[str, Any], 
        top_k: int
    ) -> List[Dict[str, Any]]:
        """
        阶段 1: 多通道召回
        
        从多个来源检索多样化的候选。
        """
        if not self.recall_service:
            logger.error("召回服务不可用")
            return []
        
        try:
            candidates = await self.recall_service.recommend(user_features, top_k=top_k)
            logger.debug(f"召回返回 {len(candidates)} 个候选")
            return candidates
        except Exception as e:
            logger.error(f"召回失败: {e}")
            return []

    async def _rank(
        self,
        user_features: Dict[str, Any],
        candidates: List[Dict[str, Any]],
        item_features_provider: Optional[ItemFeaturesProvider],
        top_k: int,
        enable_ranking: bool
    ) -> tuple[List[Dict[str, Any]], str]:
        """
        阶段 2: CTR 预估精排
        
        使用 DeepFM 模型对候选进行排序。
        如果精排不可用，回退到召回分数。
        """
        # 如果禁用或未就绪，跳过精排
        if not enable_ranking or not self.is_ranking_ready:
            return self._fallback_ranking(candidates, top_k), "recall_only"
        
        try:
            # 如果提供了 provider，获取物品特征
            if item_features_provider:
                candidate_ids = [c["movie_id"] for c in candidates]
                item_features_map = await item_features_provider(candidate_ids)
                
                ranked_items = await self.ranking_service.rank_with_item_features(
                    user_features=user_features,
                    candidates=candidates,
                    item_features_map=item_features_map,
                    top_k=top_k
                )
            else:
                ranked_items = await self.ranking_service.rank(
                    user_features=user_features,
                    candidates=candidates,
                    top_k=top_k
                )
            
            return ranked_items, self.ranking_service.active_strategy
            
        except Exception as e:
            logger.error(f"精排失败, 回退: {e}")
            return self._fallback_ranking(candidates, top_k), "fallback"

    async def _rerank(
        self,
        items: List[Dict[str, Any]],
        user_features: Dict[str, Any],
        item_features_provider: Optional[ItemFeaturesProvider],
        enable_reranking: bool
    ) -> tuple[List[Dict[str, Any]], List[str]]:
        """
        阶段 3: 多样性重排序
        
        为物品补充特征（类型、年份）并应用打散策略
        以提高推荐多样性。
        
        当前应用：
        - 类型打散（最多 2 个连续相同类型）
        - 年代打散（最多 3 个连续相同年代）
        """
        # 如果禁用或未就绪，跳过重排序
        if not enable_reranking or not self.is_reranking_ready:
            return items, []
        
        try:
            # 补充打散策略所需的物品特征
            if item_features_provider and items:
                movie_ids = [item["movie_id"] for item in items]
                item_features_map = await item_features_provider(movie_ids)
                
                items = [
                    {**item, **item_features_map.get(item["movie_id"], {})}
                    for item in items
                ]
            
            reranked_items = await self.reranking_service.rerank(
                items=items,
                user_features=user_features
            )
            
            return reranked_items, self.reranking_service.strategy_names
            
        except Exception as e:
            logger.error(f"重排序失败, 返回排序物品: {e}")
            return items, []

    def _fallback_ranking(
        self, 
        candidates: List[Dict[str, Any]], 
        top_k: int
    ) -> List[Dict[str, Any]]:
        """回退策略：使用召回分数作为排序分数"""
        return [
            {
                "movie_id": c["movie_id"],
                "score": c.get("score", 0.0),
                "recall_score": c.get("score", 0.0),
                "recall_type": c.get("recall_type"),
            }
            for c in candidates[:top_k]
        ]

    def get_health_status(self) -> Dict[str, Any]:
        """获取流水线组件的健康状态"""
        return {
            "cold_start": {
                "available": self.cold_start_service is not None,
                "ready": self.is_cold_start_ready,
                "strategies": self.cold_start_service.strategy_names if self.cold_start_service else [],
                "threshold": self.cold_start_service.detector.threshold if self.cold_start_service else None,
            },
            "recall": {
                "available": self.recall_service is not None,
                "strategies": len(self.recall_service.strategies) if self.recall_service else 0,
            },
            "ranking": {
                "available": self.ranking_service is not None,
                "ready": self.is_ranking_ready,
                "strategy": self.ranking_service.active_strategy if self.ranking_service else None,
            },
            "reranking": {
                "available": self.reranking_service is not None,
                "ready": self.is_reranking_ready,
                "strategies": self.reranking_service.strategy_names if self.reranking_service else [],
            }
        }


# 单例访问器
_pipeline: Optional[RecommendationPipeline] = None


def get_pipeline() -> RecommendationPipeline:
    """获取或创建单例流水线实例"""
    global _pipeline
    if _pipeline is None:
        _pipeline = RecommendationPipeline()
    return _pipeline
