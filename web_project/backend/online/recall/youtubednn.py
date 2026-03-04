import logging
import numpy as np
import asyncio
from typing import List, Dict, Any
from .base import RecallStrategy
from .resource_manager import RecallResourceManager

logger = logging.getLogger(__name__)

class YouTubeDNNRecallStrategy(RecallStrategy):
    def __init__(self):
        self.resource_manager = RecallResourceManager()

    def preprocess_user(self, user_features: Dict[str, Any], max_hist_len: int = 10):
        """预处理用户特征，构建模型输入"""
        inputs = {}
        encoders = self.resource_manager.encoders
        
        # 1. 标量特征
        for feat in ["user_id", "gender", "age", "occupation", "zip_code"]:
            raw_val = user_features.get(feat)
            val = 0
            if raw_val is not None:
                try:
                    if feat in encoders:
                        # transform 返回数组，取 [0]
                        # 处理潜在的类型不匹配（int vs str）
                        if isinstance(raw_val, int):
                            raw_val = str(raw_val)
                        # 检查 raw_val 是否在 classes_ 中以避免报错
                        # LabelEncoder 遇到未见过的标签会抛出异常
                        # 但我们可以用 try/except 捕获
                        val = encoders[feat].transform([raw_val])[0] + 1
                    else:
                        val = 0
                except Exception:
                    val = 0  # 未知值
            inputs[feat] = np.array([val])
            
        # 2. 历史行为特征
        hist_mids_raw = user_features.get("hist_movie_ids", [])
        
        # 编码电影 ID
        hist_mids_encoded = []
        if "movie_id" in encoders:
            movie_le = encoders["movie_id"]
            for mid in hist_mids_raw:
                try:
                    # 确保 mid 与编码器类型兼容
                    # 如果 classes 是 int 类型，mid 应该是 int
                    # 如果 classes 是 string 类型，mid 应该是 string
                    if mid in movie_le.classes_:
                         enc = movie_le.transform([mid])[0] + 1
                         hist_mids_encoded.append(enc)
                except Exception:
                    pass
                
        # 编码类型（展平）
        hist_genres_encoded = []
        for mid in hist_mids_raw:
            genres = self.resource_manager.movie_genre_map.get(mid, [])
            hist_genres_encoded.extend(genres)
            
        # 填充/截断
        def pad(seq, max_len):
            seq = seq[-max_len:]  # 保留最后 N 个
            return [0] * (max_len - len(seq)) + seq
            
        inputs["hist_movie_id"] = np.array([pad(hist_mids_encoded, max_hist_len)])
        inputs["hist_genres"] = np.array([pad(hist_genres_encoded, max_hist_len)])
        
        return inputs

    async def recall(self, user_context: Dict[str, Any], k: int) -> List[Dict[str, Any]]:
        """
        基于 YouTubeDNN 双塔模型的向量召回
        """
        # 确保资源已加载（懒加载）
        self.resource_manager._ensure_resources_loaded()
        
        if self.resource_manager.user_model is None or self.resource_manager.item_embedding_matrix is None:
            logger.warning("YouTubeDNN 模型未就绪")
            return []

        # 在线程池中运行 CPU 密集型任务
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._recall_sync, user_context, k)

    def _recall_sync(self, user_context: Dict[str, Any], k: int) -> List[Dict[str, Any]]:
        """同步执行召回逻辑"""
        try:
            model_inputs = self.preprocess_user(user_context)
            
            # 模型预测得到用户 Embedding
            user_emb = self.resource_manager.user_model.predict(model_inputs, verbose=0)
            user_emb = user_emb / np.linalg.norm(user_emb, axis=1, keepdims=True)
            
            # 计算用户 Embedding 与所有物品 Embedding 的内积得分
            scores = np.dot(user_emb, self.resource_manager.item_embedding_matrix.T)[0]
            
            # 取 Top K
            top_indices = np.argsort(scores)[::-1][:k]
            
            results = []
            all_mids = self.resource_manager.all_movie_ids
            
            for idx in top_indices:
                if idx == 0: continue  # 跳过填充位
                
                # 索引映射：idx 1 -> all_mids[0]
                if idx - 1 < len(all_mids):
                    raw_mid = all_mids[idx - 1]
                    score = float(scores[idx])
                    results.append({
                        "movie_id": int(raw_mid),
                        "score": score,
                        "recall_type": "youtube_dnn"
                    })
            logger.info(f"YouTubeDNNRecallStrategy.recall, 召回数量: {len(results)}")
            return results
        except Exception as e:
            logger.error(f"YouTubeDNN 召回失败: {e}")
            return []
