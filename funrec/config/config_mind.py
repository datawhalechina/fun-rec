"""
配置文件: MIND_CONFIG


使用方式:
    from funrec.config.config_mind import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_mind.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml-1m_recall_data",
    },
    "features": {
        "dataset_name": "ml-1m_recall_data",
        "emb_dim": 16,
        "max_seq_len": 50,
        "features": [
            {
                "name": "user_id",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "age",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "occupation",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "zip",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "movie_id",
                "group": [
                    "target_item",
                ],
            },
            {
                "name": "genres",
                "group": [
                    "target_item",
                ],
            },
            {
                "name": "hist_movie_id",
                "emb_name": "movie_id",
                "group": [
                    "raw_hist_seq",
                ],
                "combiner": None,
            },
            {
                "name": "hist_genres",
                "emb_name": "genres",
                "group": [
                    "raw_hist_seq",
                ],
                "combiner": None,
            },
            {
                "name": "hist_len",
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.mind.build_mind_model",
        "model_params": {
            "emb_dims": 16,
            "neg_samples": 50,
            "max_capsulen_nums": 4,
            "max_seq_len": 50,
            "user_dnn_units": [
                128,
                64,
            ],
        },
        "optimizer": "adam",
        "loss": "sampledsoftmaxloss",
        "batch_size": 128,
        "epochs": 1,
        "verbose": 0,
    },
    "evaluation": {
        "k_list": [
            5,
            10,
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "movie_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
MIND_CONFIG = CONFIG


__all__ = ["CONFIG", "MIND_CONFIG"]