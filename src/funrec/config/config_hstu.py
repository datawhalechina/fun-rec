"""
配置文件: HSTU_CONFIG

使用方式:
    from funrec.config.config_hstu import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_hstu.yaml
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
            {
                "name": "timestamps",
                "type": "varlen_sparse",
                "max_len": 200,
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.hstu.build_hstu_model",
        "model_params": {
            "max_seq_len": 200,
            "mha_num": 2,
            "nums_heads": 1,
            "dropout": 0.2,
            "activation": "relu",
            "pos_emb_trainable": True,
            "pos_initializer": "glorot_uniform",
            "attention_type": "dot_product",
            "maxlen": 200,
            "normalize_query": True,
            "overwrite_key_with_query": True,
            "qkv_projection_initializer": None,
            "qkv_projection_bias": True,
            "qkv_projection_activation": None,
            "value_projection": True,
            "scale_attention": True,
            "attention_activation": None,
            "attention_normalization": "softmax",
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
HSTU_CONFIG = CONFIG


__all__ = ["CONFIG", "HSTU_CONFIG"]