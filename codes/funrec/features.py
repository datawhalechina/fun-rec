from ast import Add
from copy import copy, deepcopy
from itertools import chain
import pandas as pd
from collections import OrderedDict, defaultdict
import tensorflow as tf
from feature_column import DenseFeat, SparseFeat, VarLenSparseFeat
from layers import NoMask, PoolingLayer
from tensorflow.keras.layers import Input, Embedding, Flatten, \
    Concatenate, Dense
from tensorflow.keras.regularizers import l2
from tensorflow.keras.initializers import Zeros


def get_linear_logits(linear_dense_list, linear_input_sparse_list):
    logits_list = []
    if len(linear_dense_list) > 0:
        linear_dense_feature = Concatenate(axis=-1)(linear_dense_list)
        linear_logits = Dense(1, use_bias=False)(linear_dense_feature)
        logits_list.append(linear_logits)
    if len(linear_input_sparse_list) > 0:
        linear_sparse_feature = Flatten()(Concatenate(axis=1)(
            linear_input_sparse_list))
        linear_sparse_logits = tf.reduce_sum(linear_sparse_feature, axis=-1, 
            keepdims=True)
        logits_list.append(linear_sparse_logits)
    if len(logits_list) == 0:
        raise ValueError("")
    elif len(logits_list) == 1:
        return logits_list[0]
    return tf.keras.layers.add(logits_list)


class FeatureMap(object):
    """将feature columns转换成Input层
    分为三种情况：
    1. DenseFeat, 这是用来处理dense特征，例如数值特征，向量特征（图片、搜索兴趣等）
    2. SparseFeat, 这是用来处理id特征，例如商品类别，用户的职业等
    3. VarLenSparseFeat, 这是用来处理序列特征，对于序列特征可以是有序的，例如用户
        的行为序列，也可以是多兴趣或多标签特征，例如multi-hot相关的无序标签id特征
        【对于序列特征，可能还会伴随着序列每个位置的权重，或者序列长度等特征】
    注：这里返回的是一个字典，字典的key对应的是特征的名字，网络层的名字也命名为对
        应特征的名字
    """
    def __init__(self, feature_columns):
        self.feature_columns = feature_columns 
        self.feature_input_layer_dict = self._create_keras_input_layers()

    def _create_keras_input_layers(self):
        feature_input_layer_dict = OrderedDict()
        for fc in self.feature_columns:
            if isinstance(fc, DenseFeat):
                feature_input_layer_dict[fc.name] = Input(shape=(fc.dimension,),
                    name=fc.name, dtype=fc.type)
            elif isinstance(fc, SparseFeat):
                feature_input_layer_dict[fc.name] = Input(shape=(1, ), 
                    name=fc.name, dtype=fc.dtype)
            elif isinstance(fc, VarLenSparseFeat):
                feature_input_layer_dict[fc.name] = Input(shape=(fc.maxlen, ), 
                    name=fc.name, dtype=fc.dtype)
                # 判断序列特征中是否包含权重和序列长度
                if fc.weight_name is not None:
                    feature_input_layer_dict[fc.weight_name] = Input(shape=(
                        fc.maxlen,), name=fc.weight_name, 
                        dtype='float32')
                if fc.length_name is not None:
                    feature_input_layer_dict[fc.length_name] = Input(shape=(1,), 
                        name=fc.length_name, dtype='int32')
            else:
                raise TypeError("Invalid feature column type:", type(fc))
        return feature_input_layer_dict


class FeatureEncoder(object):
    """特征编码
    主要的目标是：将特征按照三种类型进行分组，并将id类特征的Input层与对应的Embedding
        层关联，最终可以生成三类特征的字典，给不同模型的特征处理部分用
    
    这个类中需要先调用FeatureMap类获取到不同特征的Input层

    相关方法：
    1. _filter_feature_columns：过滤出不同类型的特征，便于对不同特征进行处理
    2. get_linear_sparse_feature：这个是将应用于线性层的id特征，将他们的初始化维度
        设置为1，一般用在Wide & Deep系列模型的Wide侧
    3. create_embedding_layers_dict：根据SparseFeat、VarLenSparseFeat的配置信息，
        创建Embedding层，这里的一些关键参数包括，模型是否可训练、模型是否用0填充等
        最终返回一个Embedding层的字典，字典的key是embedding_name, 而不是feature_name
    4. embedding_look_up：将不同的id特征的Input层与其对应的Embedding层进行关联，
        这里对于SparseFeat特征，我们采用了嵌套字典，方便不同的id特征做不同的特征
        处理，对于VarLenSparseFeat特征，直接用单层字典存储
    5. encode_to_dict：将三类特征分别封装成字典的形式
    """
    def __init__(self, feature_column_list, linear_sparse_feature=None):
        """
        linear_sparse_feature：对于某些模型可能需要单独这个参数进来处理，因为
            模型底层的Input都是一样的，所以需要在这里一起将这类特征处理了，否则在
            外面就非常不方便处理
        """
        self.feature_column_list = feature_column_list
        self.feature_map = FeatureMap(feature_columns=feature_column_list)
        self.feature_input_layer_dict = self.feature_map.\
            feature_input_layer_dict

        # 过滤出不同类型的特征，方便后续统一处理
        self._filter_feature_columns()

        # 单独处理linear sparse特征
        if linear_sparse_feature is not None:
            self.linear_sparse_feature_dict = self.get_linear_sparse_feature(
                linear_sparse_feature
            )

        # 处理三类不同的特征
        self.dense_feature_dict, self.sparse_feature_dict, \
            self.varlen_sparse_feature_dict = self.encode_to_dict()

    def _filter_feature_columns(self):
        """过滤不同的特征
        """
        self.dense_feature_columns = [fc for fc in self.feature_column_list 
            if isinstance(fc, DenseFeat)]
        self.sparse_feature_columns = [fc for fc in self.feature_column_list 
            if isinstance(fc, SparseFeat)]
        self.varlen_sparse_feature_columns = [fc for fc in
             self.feature_column_list if isinstance(fc, VarLenSparseFeat)]

    def create_embedding_layers_dict(self, sparse_feature_columns, 
        varlen_sparse_feature_columns=None, l2_reg=1e-5, seed=2022, 
        seq_mask_zeros=True, prefix='sparse_'):
        """创建 Embedding 层，返回一个字典
        注意：创建Embedding层的时候，可能包含序列特征，这里以一个单独的参数传进来
            方便后续处理
        """
        embedding_layers_dict = {}
        for fc in sparse_feature_columns:
            if isinstance(fc, SparseFeat):
                emb = Embedding(fc.vocabulary_size, 
                    fc.embedding_dim, 
                    embeddings_initializer=fc.embeddings_initializer,
                    embeddings_regularizer=l2(l2_reg),
                    name=prefix + fc.name + '_emb')
                emb.trainable = fc.trainable
                embedding_layers_dict[fc.embedding_name] = emb
        
        if varlen_sparse_feature_columns is not None:
            for fc in varlen_sparse_feature_columns:
                if isinstance(fc, VarLenSparseFeat):
                    emb = Embedding(fc.vocabulary_size, 
                        fc.embedding_dim,
                        embeddings_initializer=fc.embeddings_initializer,
                        embeddings_regularizer=l2(l2_reg),
                        name=prefix + fc.name + '_emb',
                        mask_zero=seq_mask_zeros) # 变长序列的差异，长度不够用0填充
                    emb.trainable = emb.trainable
                    # 这里对于在sparse_feature_columns中出现的emb，如果embedding_name相同就会
                    # 将上述的embedding覆盖，对于sparsefeat特征，使用带有mask的embedding
                    # 效果是一样的，只不过在输出的向量里面会包含masking，这个可以在输出之后通
                    # 过NoMask()去掉，这样就不会随着后面的计算不断地传播
                    embedding_layers_dict[fc.embedding_name] = emb 

        return embedding_layers_dict
    
    def embedding_look_up(self, sparse_feature_columns, embedding_layers_dict, 
                        is_varlen=False):
        """将Input层和Embedding层串起来
        这里有两种情况：
            1. SparseFeat：此时需要考虑id特征之间的分组，所以返回的是一个嵌套的字典
            2. VarLenSparseFeat：直接返回一个字典，方便后续聚合或者序列特征的提取
        """
        if not is_varlen:
            group_embedding_feature_dict = defaultdict(dict)
        else:
            varlen_embedding_feature_dict = {}

        for fc in sparse_feature_columns:
            feature_name = fc.name
            embedding_name = fc.embedding_name
            input_layer = self.feature_input_layer_dict[feature_name]
            embedding_layer = embedding_layers_dict[embedding_name]
            emb_feat = embedding_layer(input_layer)
            if not is_varlen:
                group_embedding_feature_dict[fc.group_name][embedding_name]=emb_feat
            else:
                varlen_embedding_feature_dict[feature_name] = emb_feat
        
        if not is_varlen:
            return group_embedding_feature_dict
        
        return varlen_embedding_feature_dict

    def get_linear_sparse_feature(self, linear_sparse_feature):
        """id特征输入到linear层中
        1. 需要先拷贝一份SparseFeat特征的配置信息，并将embedding_dim重置为1，
        2. 然后在单独创建这类特征的Embedding层，并将其与对应的Input层关联
        """
        # linear_sparse_feature_copy = copy(linear_sparse_feature)
        new_linear_sparse_feature_list = []
        # 重置SparseFeat的embedding_dim=1，这里需要先拷贝一分
        for fc in linear_sparse_feature:
            new_fc = copy(fc)
            new_fc = fc._replace(embedding_dim=1, embeddings_initializer=Zeros())
            new_linear_sparse_feature_list.append(new_fc)

        print(new_linear_sparse_feature_list)

        # 构建embedding层并将对应的Input层进行关联
        linear_embedding_layers_dict = self.create_embedding_layers_dict(
            new_linear_sparse_feature_list, prefix="linear_")
        # 因为所有特征的输入都是一样的，只不过后续的特征走向不一样，所以都使用的是
        # 同一份Input层，self.feature_input_layer_dict
        linear_sparse_feature_dict = self.embedding_look_up(
            new_linear_sparse_feature_list, linear_embedding_layers_dict, 
            is_varlen=False)

        return linear_sparse_feature_dict

    def encode_to_dict(self):
        dense_feature_dict = {}
        if len(self.dense_feature_columns) > 0:
            for fc in self.feature_column_list:
                if isinstance(fc, DenseFeat):
                    dense_feature_dict[fc.name] = \
                        self.feature_input_layer_dict[fc.name] 
        
        embedding_layers_dict = {}
        if len(self.sparse_feature_columns) > 0 or \
            len(self.varlen_sparse_feature_columns) > 0:
            embedding_layers_dict = self.create_embedding_layers_dict(
                self.sparse_feature_columns,
                self.varlen_sparse_feature_columns
            )

        sparse_feature_dict = {}
        varlen_sparse_feature_dict = {}
        if len(embedding_layers_dict) > 0: 
            if len(self.sparse_feature_columns) > 0:
                sparse_feature_dict = self.embedding_look_up(
                    self.feature_column_list, embedding_layers_dict, 
                    is_varlen=False)

            if len(self.varlen_sparse_feature_columns) > 0:
                varlen_sparse_feature_dict = self.embedding_look_up(
                    self.varlen_sparse_feature_columns, embedding_layers_dict, 
                    is_varlen=True)

        return dense_feature_dict, sparse_feature_dict, varlen_sparse_feature_dict


# TODO
# 将tfrecord的FeatureMap和FeatureEncoder完善，可以方便用于实际的大规模训练