"""
配置模块索引

使用方式:
    # 方式1: 通过get_config函数
    from funrec.config import get_config
    config = get_config("fm")

    # 方式2: 直接导入特定配置
    from funrec.config.config_fm import CONFIG
    config = CONFIG
"""
from dataclasses import dataclass
from typing import Dict, Any

from .config_afm import CONFIG as AFM_CONFIG
from .config_apg import CONFIG as APG_CONFIG
from .config_autoint import CONFIG as AUTOINT_CONFIG
from .config_biassvd import CONFIG as BIASSVD_CONFIG
from .config_dcn import CONFIG as DCN_CONFIG
from .config_deepfm import CONFIG as DEEPFM_CONFIG
from .config_dien import CONFIG as DIEN_CONFIG
from .config_din import CONFIG as DIN_CONFIG
from .config_dsin import CONFIG as DSIN_CONFIG
from .config_dssm import CONFIG as DSSM_CONFIG
from .config_eges import CONFIG as EGES_CONFIG
from .config_essm import CONFIG as ESSM_CONFIG
from .config_fibinet import CONFIG as FIBINET_CONFIG
from .config_fm import CONFIG as FM_CONFIG
from .config_fm_recall import CONFIG as FM_RECALL_CONFIG
from .config_funksvd import CONFIG as FUNKSVD_CONFIG
from .config_hmoe import CONFIG as HMOE_CONFIG
from .config_hstu import CONFIG as HSTU_CONFIG
from .config_item2vec import CONFIG as ITEM2VEC_CONFIG
from .config_item_cf import CONFIG as ITEM_CF_CONFIG
from .config_m2m import CONFIG as M2M_CONFIG
from .config_mind import CONFIG as MIND_CONFIG
from .config_mmoe import CONFIG as MMOE_CONFIG
from .config_nfm import CONFIG as NFM_CONFIG
from .config_pepnet import CONFIG as PEPNET_CONFIG
from .config_ple import CONFIG as PLE_CONFIG
from .config_pnn import CONFIG as PNN_CONFIG
from .config_prm import CONFIG as PRM_CONFIG
from .config_prs import CONFIG as PRS_CONFIG
from .config_sasrec import CONFIG as SASREC_CONFIG
from .config_sdm import CONFIG as SDM_CONFIG
from .config_shared_bottom import CONFIG as SHARED_BOTTOM_CONFIG
from .config_star import CONFIG as STAR_CONFIG
from .config_swing import CONFIG as SWING_CONFIG
from .config_user_cf import CONFIG as USER_CF_CONFIG
from .config_wide_deep import CONFIG as WIDE_DEEP_CONFIG
from .config_xdeepfm import CONFIG as XDEEPFM_CONFIG
from .config_youtubednn import CONFIG as YOUTUBEDNN_CONFIG


# 配置映射字典 - 通过模型名称获取配置
CONFIG_MAPPING: Dict[str, Dict[str, Any]] = {
    "afm": AFM_CONFIG,
    "apg": APG_CONFIG,
    "autoint": AUTOINT_CONFIG,
    "biassvd": BIASSVD_CONFIG,
    "dcn": DCN_CONFIG,
    "deepfm": DEEPFM_CONFIG,
    "dien": DIEN_CONFIG,
    "din": DIN_CONFIG,
    "dsin": DSIN_CONFIG,
    "dssm": DSSM_CONFIG,
    "eges": EGES_CONFIG,
    "essm": ESSM_CONFIG,
    "fibinet": FIBINET_CONFIG,
    "fm": FM_CONFIG,
    "fm_recall": FM_RECALL_CONFIG,
    "funksvd": FUNKSVD_CONFIG,
    "hmoe": HMOE_CONFIG,
    "hstu": HSTU_CONFIG,
    "item2vec": ITEM2VEC_CONFIG,
    "item_cf": ITEM_CF_CONFIG,
    "m2m": M2M_CONFIG,
    "mind": MIND_CONFIG,
    "mmoe": MMOE_CONFIG,
    "nfm": NFM_CONFIG,
    "pepnet": PEPNET_CONFIG,
    "ple": PLE_CONFIG,
    "pnn": PNN_CONFIG,
    "prm": PRM_CONFIG,
    "prs": PRS_CONFIG,
    "sasrec": SASREC_CONFIG,
    "sdm": SDM_CONFIG,
    "shared_bottom": SHARED_BOTTOM_CONFIG,
    "star": STAR_CONFIG,
    "swing": SWING_CONFIG,
    "user_cf": USER_CF_CONFIG,
    "wide_deep": WIDE_DEEP_CONFIG,
    "xdeepfm": XDEEPFM_CONFIG,
    "youtubednn": YOUTUBEDNN_CONFIG,
}


def get_config(model_name: str) -> Dict[str, Any]:
    """
    根据模型名称获取配置字典
    
    Args:
        model_name: 模型名称 (如 "fm", "afm")
    
    Returns:
        配置字典
    
    Raises:
        KeyError: 如果模型配置不存在
    """
    if model_name not in CONFIG_MAPPING:
        available_models = ", ".join(sorted(CONFIG_MAPPING.keys()))
        raise KeyError(f"模型 \"{model_name}\" 的配置不存在。可用模型: {available_models}")
    
    return CONFIG_MAPPING[model_name]

@dataclass
class Config:
    """配置类，包含所有配置部分。"""

    data: Dict[str, Any]
    features: Dict[str, Any]
    training: Dict[str, Any]
    evaluation: Dict[str, Any]

def load_config(model_name: str) -> Config:
    """
    根据模型名称加载配置，返回Config对象
    
    Args:
        model_name: 模型名称 (如 "fm", "afm")
    
    Returns:
        Config对象，支持config.data、config.features等属性访问
    
    Raises:
        KeyError: 如果模型配置不存在
    """
    config_dict = get_config(model_name)
    
    return Config(
        data=config_dict.get("data", {}),
        features=config_dict.get("features", {}),
        training=config_dict.get("training", {}),
        evaluation=config_dict.get("evaluation", {}),
    )    

# 导出所有配置
__all__ = ["load_config", "get_config", "Config", "CONFIG_MAPPING"] + ["AFM_CONFIG", "APG_CONFIG", "AUTOINT_CONFIG", "BIASSVD_CONFIG", "DCN_CONFIG", "DEEPFM_CONFIG", "DIEN_CONFIG", "DIN_CONFIG", "DSIN_CONFIG", "DSSM_CONFIG", "EGES_CONFIG", "ESSM_CONFIG", "FIBINET_CONFIG", "FM_CONFIG", "FM_RECALL_CONFIG", "FUNKSVD_CONFIG", "HMOE_CONFIG", "HSTU_CONFIG", "ITEM2VEC_CONFIG", "ITEM_CF_CONFIG", "M2M_CONFIG", "MIND_CONFIG", "MMOE_CONFIG", "NFM_CONFIG", "PEPNET_CONFIG", "PLE_CONFIG", "PNN_CONFIG", "PRM_CONFIG", "PRS_CONFIG", "SASREC_CONFIG", "SDM_CONFIG", "SHARED_BOTTOM_CONFIG", "STAR_CONFIG", "SWING_CONFIG", "USER_CF_CONFIG", "WIDE_DEEP_CONFIG", "XDEEPFM_CONFIG", "YOUTUBEDNN_CONFIG"]