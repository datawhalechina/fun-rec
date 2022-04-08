import tensorflow as tf
from collections import namedtuple
from tensorflow.keras.initializers import RandomNormal

# 默认分组名称
DEFAULT_GROUP_NAME="default_group"

# 定义feature columns父类
BaseDenseFeat = namedtuple('DenseFeat', 
                            ['name', 'dimension', 'dtype', 'transform_fn'])
BaseSparseFeat = namedtuple('SparseFeat',
                            ['name', 'vocabulary_size', 'embedding_dim', 
                            'use_hash', 'vocabulary_path', 'dtype', 
                            'embeddings_initializer','embedding_name',
                            'group_name', 'trainable'])
BaseVarLenSparseFeat = namedtuple('VarLenSparseFeat',
                                  ['sparsefeat', 'maxlen', 'combiner', 
                                  'length_name', 'weight_name', 'weight_norm'])

class DenseFeat(BaseDenseFeat):
    """ Dense feature
    Args:
        name: feature name,
        dimension: dimension of the feature, default = 1.
        dtype: dtype of the feature, default="float32".
        transform_fn: If not `None` , a function that can be used to transform
        values of the feature.  the function takes the input Tensor as its
        argument, and returns the output Tensor.
        (e.g. lambda x: (x - 3.0) / 4.2).
    """
    # 加上__slots__ = ()限制，在生成实例的时候，不会为实例生成一个属性字典，
    # 可以节省内存
    __slots__ = ()

    def __new__(cls, name, dimension=1, dtype="float32", transform_fn=None):
        return super(DenseFeat, cls).__new__(
            cls, name, dimension, dtype, transform_fn)

    def __hash__(self):
        return self.name.__hash__()


class SparseFeat(BaseSparseFeat):
    __slots__ = ()

    def __new__(cls, name, vocabulary_size, embedding_dim=4, use_hash=False, 
            vocabulary_path=None, dtype="int32", embeddings_initializer=None,
            embedding_name=None, group_name=DEFAULT_GROUP_NAME, trainable=True):

        if embedding_dim == "auto":
            embedding_dim = 6 * int(pow(vocabulary_size, 0.25))
        if embeddings_initializer is None:
            # 随机初始化
            embeddings_initializer = RandomNormal(
                mean=0.0, stddev=0.0001, seed=2020)

        if embedding_name is None:
            embedding_name = name

        return super(SparseFeat, cls).__new__(cls, name, vocabulary_size, 
            embedding_dim, use_hash, vocabulary_path, dtype, 
            embeddings_initializer, embedding_name, group_name, trainable)

    def __hash__(self):
        return self.name.__hash__()


class VarLenSparseFeat(BaseVarLenSparseFeat):
    __slots__ = ()

    def __new__(cls, sparsefeat, maxlen, combiner="mean", length_name=None, 
                    weight_name=None, weight_norm=True):
        return super(VarLenSparseFeat, cls).__new__(cls, sparsefeat, maxlen, 
            combiner, length_name, weight_name, weight_norm)

    @property
    def name(self):
        return self.sparsefeat.name

    @property
    def vocabulary_size(self):
        return self.sparsefeat.vocabulary_size

    @property
    def embedding_dim(self):
        return self.sparsefeat.embedding_dim

    @property
    def use_hash(self):
        return self.sparsefeat.use_hash

    @property
    def vocabulary_path(self):
        return self.sparsefeat.vocabulary_path

    @property
    def dtype(self):
        return self.sparsefeat.dtype

    @property
    def embeddings_initializer(self):
        return self.sparsefeat.embeddings_initializer

    @property
    def embedding_name(self):
        return self.sparsefeat.embedding_name

    @property
    def group_name(self):
        return self.sparsefeat.group_name

    @property
    def trainable(self):
        return self.sparsefeat.trainable

    def __hash__(self):
        return self.name.__hash__()
