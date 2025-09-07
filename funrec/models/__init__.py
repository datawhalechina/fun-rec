"""模型定义"""

from .dssm import build_dssm_model
from .fm import build_fm_model
from .afm import build_afm_model
from .nfm import build_nfm_model
from .pnn import build_pnn_model
from .fibinet import build_fibinet_model
from .deepfm import build_deepfm_model
from .dcn import build_dcn_model
from .xdeepfm import build_xdeepfm_model
from .autoint import build_autoint_model
from .din import build_din_model
from .dien import build_dien_model
from .dsin import build_dsin_model
from .fm_recall import build_fm_recall_model
from .funksvd import build_funksvd_model
from .biassvd import build_biassvd_model
from .sdm import build_sdm_model
from .wide_deep import build_wide_deep_model
from .apg import build_apg_model  # noqa: F401
from .m2m import build_m2m_model  # noqa: F401
from .prm import build_prm_model  # noqa: F401
from .item2vec import build_item2vec_model  # noqa: F401
from .utils import (
    build_input_layer,
    build_embedding_table_dict,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    parse_group_feature_columns,
)

__all__ = [
    "build_dssm_model",
    "build_fm_model",
    "build_afm_model",
    "build_nfm_model",
    "build_pnn_model",
    "build_fibinet_model",
    "build_deepfm_model",
    "build_dcn_model",
    "build_xdeepfm_model",
    "build_autoint_model",
    "build_din_model",
    "build_dien_model",
    "build_dsin_model",
    "build_fm_recall_model",
    "build_funksvd_model",
    "build_biassvd_model",
    "build_sdm_model",
    "build_wide_deep_model",
    "build_apg_model",
    "build_m2m_model",
    "build_prm_model",
    "build_item2vec_model",
    "build_input_layer",
    "build_embedding_table_dict",
    "build_group_feature_embedding_table_dict",
    "concat_group_embedding",
    "parse_group_feature_columns",
]
