"""
特征列
"""

from typing import Union, List
from dataclasses import dataclass, field
from tensorflow.keras.initializers import Initializer


@dataclass
class FeatureColumn:
    """特征列配置类，用于定义特征的属性和嵌入参数

    Attributes:
        name: 特征名称，唯一标识符
        emb_name: 嵌入名称，可选值为字符串或字符串列表。默认与特征名称相同
        emb_dim: 嵌入维度，默认为4
        vocab_size: 词汇表大小，默认为1（表示未指定）
        group: 特征所属组，例如线性组、DNN组、FM组等，默认为空列表
        type: 特征类型，可选值为" sparse"（稀疏特征）、"dense"（稠密特征）、"varlen_sparse"（变长稀疏特征）
        dimension: 稠密特征的维度，默认为1
        trainable: 是否可训练，默认为True
        max_len: 最大长度，默认为1
        combiner: 合并方式，默认为"mean"
        l2_reg: L2正则化系数，默认为0.0
        initializer: 初始化器，默认为"uniform"
        dtype: 数据类型，默认为"int32"
        att_key_name: 注意力键名称，默认为None
    """

    name: str
    emb_name: Union[str, List[str]] = None  # 嵌入名称，可以是单个字符串或多个字符串列表
    emb_dim: int = 4  # 嵌入维度
    vocab_size: int = 1  # 词汇表大小，1表示未指定
    group: List[str] = field(
        default_factory=list
    )  # 特征所属组，例如线性组、DNN组、FM组等
    type: str = "sparse"  # 特征类型，可选值为" sparse"、"dense"、"varlen_sparse"
    dimension: int = 1  # 稠密特征的维度
    trainable: bool = True  # 是否可训练
    max_len: int = 1  # 最大长度
    combiner: str = "mean"  # 变长特征聚合方式
    l2_reg: float = 0.0  # L2正则化系数
    initializer: Union[str, Initializer] = "uniform"  # 初始化器
    dtype: str = "int32"  # 数据类型
    att_key_name: str = (
        None  # 注意力键名称，当特征是变长特征且通过din方式进行聚合时使用
    )

    def __post_init__(self):
        """初始化后处理方法，用于设置默认值和基本验证"""
        # 如果emb_name未指定，则默认与特征名称相同
        if self.type in ["sparse", "varlen_sparse"] and self.emb_name is None:
            self.emb_name = self.name

        # 验证特征类型是否有效
        valid_types = ["sparse", "dense", "varlen_sparse"]
        if self.type not in valid_types:
            raise ValueError(f"Invalid type: {self.type}. Must be one of {valid_types}")

        # 验证combiner是否有效（仅对变长特征有意义）
        if self.type == "varlen_sparse":
            valid_combiners = [
                "mean",
                "din",
                "mha",
                "dien",
            ]  # None表示不聚合, 返回原始序列特征
            if self.combiner is not None:
                for t in self.combiner.split(","):
                    if t not in valid_combiners:
                        raise ValueError(
                            f"combiner: {self.combiner}. 必须为 {valid_combiners} 中的一个"
                        )

        # 序列din聚合时需要指定对应的key
        if self.combiner is not None and "din" in self.combiner:
            if self.att_key_name is None:
                raise ValueError("att_key_name 不能为空，当combiner为'din'时")
            if not isinstance(self.att_key_name, str):
                raise ValueError("att_key_name 必须为字符串，当combiner为'din'时")

        # 序列dien聚合时需要指定对应的key
        if self.combiner is not None and "dien" in self.combiner:
            if self.att_key_name is None:
                raise ValueError("att_key_name 不能为空，当combiner为'dien'时")
            if not isinstance(self.att_key_name, str):
                raise ValueError("att_key_name 必须为字符串，当combiner为'dien'时")
