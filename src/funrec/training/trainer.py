"""
模型训练
"""

import importlib
from typing import Dict, Any, List, Tuple, Union
import tensorflow as tf
import platform

from ..features.feature_column import FeatureColumn
from ..features.processors import apply_training_preprocessing


def train_model(
    training_config: Dict[str, Any],
    feature_columns: List[FeatureColumn],
    processed_data: Dict[str, Any],
) -> Union[Tuple[tf.keras.Model, tf.keras.Model, tf.keras.Model], Any]:
    """
    基于配置和处理后的数据训练模型。
    参数:
        training_config: 训练配置字典，包含以下内容：
            - build_function: 模型构建函数的完整路径 (例如：'funrec.models.dssm.build_dssm_model')
            - model_params: 模型特定参数
            - classical_model: 布尔值，指示是否为经典模型 (默认: False)
            - data_preprocessing: 要应用的预处理规则列表
            - optimizer: 使用的优化器 (默认: 'adam')
            - loss: 损失函数 (默认: ['binary_crossentropy'])
            - metrics: 要跟踪的指标 (默认: ['binary_accuracy'])
            - batch_size: 训练批次大小 (默认: 1024)
            - epochs: 训练轮数 (默认: 1)
            - validation_split: 验证集分割比例 (默认: 0.2)
            - verbose: 训练详细程度 (默认: 1)
        feature_columns: 特征列规范列表
        processed_data: 处理后的数据字典，包含训练/测试特征和标签
    返回:
        对于神经网络模型: 元组 (main_model, user_model, item_model)
        对于经典模型: 训练后的经典模型实例
    """
    # 从配置中获取构建函数路径和参数
    build_function_path = training_config.get(
        "build_function", "funrec.models.dssm.build_dssm_model"
    )
    model_params = training_config.get("model_params", {})
    is_classical = training_config.get("classical_model", False)
    is_external_embedding = training_config.get("embedding_external", False)

    # 解析模块和函数名
    module_path, function_name = build_function_path.rsplit(".", 1)

    # 动态导入并调用构建函数
    module = importlib.import_module(module_path)
    build_function = getattr(module, function_name)

    if is_classical:
        # 经典模型：直接构建和拟合
        model = build_function(feature_columns, model_params)

        # 经典模型：准备交互数据
        # 经典模型期望用户-物品交互：[(user_id, item_id, label), ...]
        train_interactions = []
        # 当特征配置为空时，processed_data已经直接包含训练字典
        train_features = (
            processed_data["train"]["features"]
            if "features" in processed_data["train"]
            else processed_data["train"]
        )
        train_labels = processed_data["train"]["labels"]

        # 从特征中提取用户和物品ID
        # 假设第一个特征是user_id，第二个是item_id
        user_ids = (
            train_features[0]
            if isinstance(train_features, list)
            else train_features["user_id"]
        )
        item_ids = (
            train_features[1]
            if isinstance(train_features, list)
            else train_features["item_id"]
        )

        # 转换为交互格式
        for i in range(len(user_ids)):
            train_interactions.append((user_ids[i], item_ids[i], train_labels[i]))

        # 训练经典模型
        model.fit(train_interactions)

        # 返回模型和None作为用户和物品模型（经典模型）
        return model, None, None

    elif is_external_embedding:
        # 外部嵌入模型（例如Item2Vec）从用户历史序列训练
        # 使用自己的参数签名构建模型
        model = build_function(model_params)

        # 从处理后的数据准备训练序列
        train_features = (
            processed_data["train"]["features"]
            if "features" in processed_data["train"]
            else processed_data["train"]
        )
        # 支持多个潜在键
        hist_key_candidates = [
            "hist_movie_id_list",
            "hist_movie_ids",
            "hist_item_id_list",
            "hist_item_ids",
        ]
        hist_array = None
        for key in hist_key_candidates:
            if key in train_features:
                hist_array = train_features[key]
                break
        if hist_array is None:
            raise ValueError(
                "外部嵌入训练需要训练特征中包含'hist_movie_id_list'（或兼容键）"
            )

        # 转换为token序列列表（过滤填充0）
        try:
            import numpy as np

            if isinstance(hist_array, list):
                train_sequences = [np.array(seq) for seq in hist_array]
            else:
                train_sequences = [hist_array[i] for i in range(len(hist_array))]
            train_hist_sequences = [
                seq[np.where(seq != 0)[0]].tolist() for seq in train_sequences
            ]
        except Exception:
            train_hist_sequences = []
            for seq in hist_array:
                try:
                    train_hist_sequences.append([token for token in seq if token != 0])
                except Exception:
                    train_hist_sequences.append(list(seq))

        model.fit(train_hist_sequences)

        # 以统一元组形式返回
        return model, None, None

    else:
        # 神经网络模型：原始训练流水线
        model, user_model, item_model = build_function(feature_columns, model_params)

        # 编译模型
        optimizer_name = training_config.get("optimizer", "adam")
        optimizer_params = training_config.get("optimizer_params", {})
        loss = training_config.get("loss", ["binary_crossentropy"])
        loss_weights = training_config.get("loss_weights", None)
        metrics = training_config.get("metrics", ["binary_accuracy"])

        # 处理自定义损失函数
        if isinstance(loss, str) and loss == "sampledsoftmaxloss":
            from .loss import sampledsoftmaxloss

            loss = sampledsoftmaxloss

        # 处理优化器 - 对Apple Silicon使用legacy Adam
        is_apple_silicon = platform.machine().lower() in ["arm64", "aarch64"]

        if optimizer_name == "adam":
            if is_apple_silicon:
                optimizer = (
                    tf.keras.optimizers.legacy.Adam(**optimizer_params)
                    if optimizer_params
                    else tf.keras.optimizers.legacy.Adam()
                )
            else:
                optimizer = (
                    tf.keras.optimizers.Adam(**optimizer_params)
                    if optimizer_params
                    else tf.keras.optimizers.Adam()
                )
        else:
            optimizer = optimizer_name

        # 编译时包含loss_weights如果提供的话
        compile_kwargs = {"optimizer": optimizer, "loss": loss, "metrics": metrics}
        if loss_weights is not None:
            compile_kwargs["loss_weights"] = loss_weights
        model.compile(**compile_kwargs)

        # 获取训练参数
        batch_size = training_config.get("batch_size", 1024)
        epochs = training_config.get("epochs", 1)
        validation_split = training_config.get("validation_split", 0.2)
        verbose = training_config.get("verbose", 0)

        # 基于配置应用训练特定的预处理
        # 支持完全准备的字典和原始字典
        if "features" in processed_data["train"]:
            train_features = processed_data["train"]["features"]
            train_labels = processed_data["train"].get("labels")
        else:
            train_features = processed_data["train"]
            train_labels = (
                processed_data["train"].get("labels")
                if isinstance(processed_data["train"], dict)
                else None
            )
        train_features, train_labels = apply_training_preprocessing(
            training_config, train_features, train_labels
        )

        labels_for_fit = train_labels
        if isinstance(labels_for_fit, list) and len(labels_for_fit) == 1:
            labels_for_fit = labels_for_fit[0]

        # 处理多输出模型：如果模型有多个输出但只有一个标签集，复制标签
        if (
            isinstance(loss, list)
            and len(loss) > 1
            and not isinstance(labels_for_fit, list)
        ):
            # 对于PRS等模型：两个输出都使用相同的标签
            labels_for_fit = [labels_for_fit] * len(loss)

        history = model.fit(
            train_features,
            labels_for_fit,
            batch_size=batch_size,
            epochs=epochs,
            verbose=verbose,
            validation_split=validation_split,
        )

        return model, user_model, item_model
