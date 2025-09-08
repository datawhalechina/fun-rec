"""
配置文件: SASREC_CONFIG

使用方式:
    from funrec.config.config_sasrec import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_sasrec.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml-1m_sasrec",
    },
    "features": {
        "dataset_name": "ml-1m_sasrec",
        "emb_dim": 50,
        "sampling_num": 100,
        "task_names": [
            "neg_sample_ids",
        ],
        "features": [
            {
                "name": "seq_ids",
                "emb_name": "item_id",
                "type": "varlen_sparse",
                "max_len": 200,
            },
            {
                "name": "pos_ids",
                "emb_name": "item_id",
                "type": "varlen_sparse",
                "max_len": 200,
            },
            {
                "name": "neg_sample_ids",
                "emb_name": "item_id",
                "type": "varlen_sparse",
                "max_len": 101,
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.sasrec.build_sasrec_model",
        "model_params": {
            "max_seq_len": 200,
            "mha_num": 2,
            "nums_heads": 1,
            "dropout": 0.2,
            "activation": "relu",
            "pos_emb_trainable": True,
            "pos_initializer": "glorot_uniform",
        },
        "optimizer": "adam",
        "optimizer_params": {
            "learning_rate": 0.002,
        },
        "loss": "sampledsoftmaxloss",
        "batch_size": 128,
        "epochs": 1,
        "verbose": 0,
        "sequential_model": True,
    },
    "evaluation": {
        "k_list": [
            5,
            10,
        ],
        "model_config": {
            "user_id_col": "seq_ids",
            "item_id_col": "item_id",
            "all_item_pool": True,
        },
    },
}


# 为了向后兼容，也提供原始变量名
SASREC_CONFIG = CONFIG


__all__ = ["CONFIG", "SASREC_CONFIG"]