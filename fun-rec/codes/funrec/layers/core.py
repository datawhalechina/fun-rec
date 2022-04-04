import tensorflow as tf
from tensorflow.keras.layers import Layer, Dense, Activation, Dropout, \
    BatchNormalization
from tensorflow.keras.initializers import Zeros


class DNN(Layer):
    def __init__(self, hidden_unit, activation='relu', use_bias=True, 
        use_dp=True, dropout_rate=0.2, use_bn=True, after_bn=False, 
        get_logits=False, **kwargs):
        """初始化DNN
        get_logits=True, 返回logits
        """
        super().__init__(**kwargs)
        self.hidden_unit = hidden_unit
        self.activation = activation
        self.after_bn = after_bn
        self.get_logits = get_logits
        self.use_dp = use_dp
        self.use_bn = use_bn
        
        self.dnn_layers = [Dense(units, activation=None, use_bias=use_bias) 
            for units in self.hidden_unit]
        self.activate_layer = Activation(activation) 
        if self.get_logits:
            self.last_dnn_layer = Dense(1, activation=None, use_bias=False)
        if self.use_dp:
            self.dp_layers = [Dropout(dropout_rate) for _ in 
                range(len(self.hidden_unit))]
        if self.use_bn:
            self.bn_layers = [BatchNormalization() for _ in 
                range(len(self.hidden_unit))]
        
    def call(self, x):
        for i in range(len(self.hidden_unit)):
            x = self.dnn_layers[i](x)
            if self.use_bn:
                if not self.after_bn:
                    x = self.activate_layer(x)
                    x = self.bn_layers[i](x)
                else:
                    x = self.bn_layers[i](x)
                    x = self.activate_layer(x)
            if self.use_dp:
                x = self.dp_layers[i](x)
        # 最后一层dnn的输出单独处理
        if self.get_logits:
            x = self.last_dnn_layer(x)
        return x


class CosinSimilarity(Layer):
    def __init__(self, temperature=1, axis=-1, **kwargs):
        super(CosinSimilarity, self).__init__(**kwargs)
        self.temperature = temperature
        self.axis = axis
        self.type = type 

    def build(self, input_shape):
        return super().build(input_shape)

    def call(self, inputs, **kwargs):
        """inputs 是一个列表"""
        query, candidate = inputs 
        # 计算两个向量的二范数
        query_norm = tf.norm(query, axis=self.axis) # (B, 1)
        candidate_norm = tf.norm(candidate, axis=self.axis)
        # 计算相似度
        scores = tf.reduce_sum(tf.multiply(query, candidate), axis=-1)#(B,1)
        # 相似度除以二范数, 防止除零
        scores = tf.divide(scores, query_norm * candidate_norm + 1e-8)
        # 对score的范围限制到(-1, 1)之间
        scores = tf.clip_by_value(scores, -1, 1)
        # 乘以温度系数
        score = scores * self.temperature 
        return score 
    
    def compute_output_shape(self, input_shape):
        return (None, 1)
    
    def get_config(self):
        config = {'temperature': self.temperature, 'axis':self.axis}
        base_config = super(CosinSimilarity, self).get_config()
        return dict(list(config.items() + base_config.items()))


class PredictLayer(Layer):
    """模型的任务分类
    # TODO 后续需要将其他任务的形式都考虑进来
        二分类 
        多分类 sampled_softmax
        回归
        多任务 
    """
    def __init__(self, task='binary', use_bias=False, **kwargs):
        if task not in ["binary", "multiclass", "regression"]:
            raise ValueError("task must be binary,multiclass or regression")
        self.task = task
        self.use_bias = use_bias
        super(PredictLayer, self).__init__(**kwargs)

    def build(self, input_shape):

        if self.use_bias:
            self.global_bias = self.add_weight(
                shape=(1,), initializer=Zeros(), name="global_bias")

        # Be sure to call this somewhere!
        super(PredictLayer, self).build(input_shape)

    def call(self, inputs, **kwargs):
        x = inputs
        if self.use_bias:
            x = tf.nn.bias_add(x, self.global_bias, data_format='NC')
        if self.task == "binary":
            x = tf.sigmoid(x)

        output = tf.reshape(x, (-1, 1))

        return output

    def compute_output_shape(self, input_shape):
        return (None, 1)

    def get_config(self, ):
        config = {'task': self.task, 'use_bias': self.use_bias}
        base_config = super(PredictLayer, self).get_config()
        return dict(list(base_config.items()) + list(config.items()))


# TODO Activation


# TODO Normalization

