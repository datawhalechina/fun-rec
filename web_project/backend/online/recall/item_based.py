import logging
import numpy as np
from typing import List, Dict, Any
from .base import RecallStrategy
from .resource_manager import RecallResourceManager

logger = logging.getLogger(__name__)

class ItemEmbeddingRecallStrategy(RecallStrategy):
    def __init__(self):
        self.resource_manager = RecallResourceManager()

    async def recall(self, user_context: Dict[str, Any], k: int) -> List[Dict[str, Any]]:
        """
        基于物品 Embedding 的协同过滤召回（Item-Item CF）
        召回与用户最近观看物品相似的物品
        """
        # 确保资源已加载（懒加载）
        self.resource_manager._ensure_resources_loaded()
        
        if self.resource_manager.item_embedding_matrix is None:
            return []
            
        try:
            hist_movie_ids = user_context.get("hist_movie_ids", [])            
            if not hist_movie_ids:
                return []
                
            # 获取最近观看的电影
            last_movie_id = hist_movie_ids[0]
            
            # 查找其编码索引
            encoders = self.resource_manager.encoders
            if "movie_id" not in encoders:
                return []
                
            movie_le = encoders["movie_id"]
            
            # 检查是否有效
            # 修复：确保类型兼容。编码器的 classes_ 可能是字符串类型
            if isinstance(movie_le.classes_[0], str) and isinstance(last_movie_id, int):
                last_movie_id = str(last_movie_id)
            elif isinstance(movie_le.classes_[0], int) and isinstance(last_movie_id, str):
                try:
                    last_movie_id = int(last_movie_id)
                except:
                    pass

            if last_movie_id not in movie_le.classes_:
                return []
                
            # 获取编码后的 ID（矩阵中的索引从 1 开始）
            # transform 返回 [idx]，我们取其值
            # 注意：矩阵索引为 enc_id（因为 enc_id 0 是填充位）
            # 编码器映射到 0..N-1，所以 enc_id = transform + 1
            # matrix[enc_id] 是对应的 Embedding
            enc_idx = movie_le.transform([last_movie_id])[0] + 1
            
            if enc_idx >= len(self.resource_manager.item_embedding_matrix):
                return []
                
            target_emb = self.resource_manager.item_embedding_matrix[enc_idx]
            
            # 计算与所有物品的相似度
            # target_emb 形状为 (dim,)
            # matrix 形状为 (N+1, dim)
            # scores 形状为 (N+1,)
            
            # 归一化（如果尚未归一化）
            # 假设 ResourceManager 中已归一化，但为安全起见这里再做一次
            # 通常 Item2Item 的点积需要归一化的 Embedding 才能得到余弦相似度
            
            norm = np.linalg.norm(target_emb)
            if norm > 0:
                target_emb = target_emb / norm
                
            # 点积计算相似度
            scores = np.dot(self.resource_manager.item_embedding_matrix, target_emb)
            
            # 取 Top K（排除自身和填充位）
            # 我们取 K+1 个结果，然后过滤掉物品本身
            top_indices = np.argsort(scores)[::-1][:k+2]
            
            results = []
            all_mids = self.resource_manager.all_movie_ids
            
            for idx in top_indices:
                if idx == 0: continue  # 跳过填充位
                if idx == enc_idx: continue  # 跳过自身
                
                if len(results) >= k:
                    break
                    
                # idx-1 是在 all_mids 中的索引
                if idx - 1 < len(all_mids):
                    raw_mid = all_mids[idx - 1]
                    results.append({
                        "movie_id": int(raw_mid),
                        "score": float(scores[idx]),
                        "recall_type": "item_embedding_history"
                    })
                    
            logger.info(f"ItemEmbeddingRecallStrategy.recall, 召回数量: {len(results)}")
            return results
            
        except Exception as e:
            logger.error(f"物品 Embedding 召回失败: {e}")
            return []
