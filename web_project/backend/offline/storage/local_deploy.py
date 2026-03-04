"""
本地部署脚本

将训练好的模型和工件部署到本地共享目录用于在线服务：
- 召回模型：YoutubeDNN 用户模型、物品嵌入向量、词表
- 精排模型：DeepFM 模型、特征字典、词表

使用方法:
    uv run python -m offline.storage.local_deploy
    uv run python -m offline.storage.local_deploy --ranking-only
    uv run python -m offline.storage.local_deploy --recall-only
"""

import json
import shutil
import argparse
from pathlib import Path
from offline.config import config


def deploy_recall_models(deploy_dir: Path):
    """部署召回相关的模型和工件"""
    print("\n" + "=" * 50)
    print("部署召回模型...")
    print("=" * 50)
    
    recall_dir = deploy_dir / "recall"
    recall_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. 词表字典
    if config.VOCAB_DICT_PATH.exists():
        shutil.copy2(config.VOCAB_DICT_PATH, recall_dir / "vocab_dict.pkl")
        # 同时复制到根目录以保持向后兼容
        shutil.copy2(config.VOCAB_DICT_PATH, deploy_dir / "vocab_dict.pkl")
        print("  ✓ 复制了 vocab_dict.pkl")
    else:
        print("  ✗ vocab_dict.pkl 不存在")
    
    # 2. 物品嵌入向量
    if config.ITEM_EMB_PATH.exists():
        shutil.copy2(config.ITEM_EMB_PATH, recall_dir / "item_embeddings.npy")
        shutil.copy2(config.ITEM_EMB_PATH, deploy_dir / "item_embeddings.npy")
        print("  ✓ 复制了 item_embeddings.npy")
    else:
        print("  ✗ item_embeddings.npy 不存在")
        
    if config.MOVIE_IDS_PATH.exists():
        shutil.copy2(config.MOVIE_IDS_PATH, recall_dir / "movie_ids.npy")
        shutil.copy2(config.MOVIE_IDS_PATH, deploy_dir / "movie_ids.npy")
        print("  ✓ 复制了 movie_ids.npy")
    else:
        print("  ✗ movie_ids.npy 不存在")
        
    # 3. 用户模型 (YoutubeDNN)
    user_model_path = config.SAVED_MODELS_DIR / "user_model"
    if user_model_path.exists():
        model_deploy_dir = deploy_dir / "model" / "user_recall" / "v1"
        model_deploy_dir.mkdir(parents=True, exist_ok=True)
        
        # 复制整个模型目录
        dest_model_path = model_deploy_dir / "user_model"
        if dest_model_path.exists():
            shutil.rmtree(dest_model_path)
        shutil.copytree(user_model_path, dest_model_path)
        
        # 更新活跃版本指针
        version_info = {"version": "v1", "path": "model/user_recall/v1/user_model"}
        active_json_path = deploy_dir / "model" / "user_recall" / "active.json"
        active_json_path.parent.mkdir(parents=True, exist_ok=True)
        with open(active_json_path, "w") as f:
            json.dump(version_info, f)
        print("  ✓ 复制了 User Recall Model (YoutubeDNN)")
    else:
        print("  ✗ User model 不存在")


def deploy_ranking_models(deploy_dir: Path):
    """部署精排相关的模型和工件 (DeepFM)"""
    print("\n" + "=" * 50)
    print("部署精排模型...")
    print("=" * 50)
    
    ranking_dir = deploy_dir / "ranking"
    ranking_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. 精排词表字典
    if config.RANKING_VOCAB_DICT_PATH.exists():
        shutil.copy2(config.RANKING_VOCAB_DICT_PATH, ranking_dir / "vocab_dict.pkl")
        print("  ✓ 复制了 ranking/vocab_dict.pkl")
    else:
        print("  ✗ ranking vocab_dict.pkl 不存在")
    
    # 2. 精排特征字典（词表大小）
    if config.RANKING_FEATURE_DICT_PATH.exists():
        shutil.copy2(config.RANKING_FEATURE_DICT_PATH, ranking_dir / "feature_dict.pkl")
        print("  ✓ 复制了 ranking/feature_dict.pkl")
    else:
        print("  ✗ ranking feature_dict.pkl 不存在")
    
    # 3. 精排模型配置（如果存在）
    ranking_config_path = config.TEMP_DIR / "ranking_model_config.pkl"
    if ranking_config_path.exists():
        shutil.copy2(ranking_config_path, ranking_dir / "model_config.pkl")
        print("  ✓ 复制了 ranking/model_config.pkl")
        
    # 4. DeepFM 精排模型
    ranking_model_path = config.RANKING_MODEL_PATH
    if ranking_model_path.exists():
        model_deploy_dir = deploy_dir / "model" / "ranking" / "v1"
        model_deploy_dir.mkdir(parents=True, exist_ok=True)
        
        # 复制整个模型目录
        dest_model_path = model_deploy_dir / "ranking_model"
        if dest_model_path.exists():
            shutil.rmtree(dest_model_path)
        shutil.copytree(ranking_model_path, dest_model_path)
        
        # 更新活跃版本指针
        version_info = {
            "version": "v1", 
            "path": "model/ranking/v1/ranking_model",
            "model_type": "deepfm"
        }
        active_json_path = deploy_dir / "model" / "ranking" / "active.json"
        active_json_path.parent.mkdir(parents=True, exist_ok=True)
        with open(active_json_path, "w") as f:
            json.dump(version_info, f)
        print("  ✓ 复制了 Ranking Model (DeepFM)")
    else:
        print(f"  ✗ Ranking model 不存在 at {ranking_model_path}")


def deploy_local(recall: bool = True, ranking: bool = True):
    """
    主部署函数
    
    Args:
        recall: 是否部署召回模型
        ranking: 是否部署精排模型
    """
    deploy_dir = config.DEPLOY_DIR
    print(f"部署模型到本地目录: {deploy_dir}")
    
    # 确保部署目录存在
    deploy_dir.mkdir(parents=True, exist_ok=True)

    if recall:
        deploy_recall_models(deploy_dir)
        
    if ranking:
        deploy_ranking_models(deploy_dir)
    
    print("\n" + "=" * 50)
    print("部署完成!")
    print("=" * 50)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="部署模型到本地目录")
    parser.add_argument("--recall-only", action="store_true", help="只部署召回模型")
    parser.add_argument("--ranking-only", action="store_true", help="只部署精排模型")
    args = parser.parse_args()
    
    if args.recall_only:
        deploy_local(recall=True, ranking=False)
    elif args.ranking_only:
        deploy_local(recall=False, ranking=True)
    else:
        deploy_local(recall=True, ranking=True)
