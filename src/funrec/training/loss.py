import tensorflow as tf
from tensorflow.keras import backend as K


def contrastive_loss(y_true, y_pred, temperature=0.1):
    """
    Batch内对比损失 (InfoNCE)。
    参数:
        y_true: 未使用，但为了与Keras兼容而保留
        y_pred: 来自模型的余弦相似度分数
        temperature: 温度参数控制分布的集中度
    返回:
        对比损失值
    """
    batch_size = tf.shape(y_pred)[0]

    # 通过温度参数缩放相似度
    scaled_sim = y_pred / temperature

    # 为正样本对创建掩码（对角线元素）
    pos_mask = tf.eye(batch_size)

    # 计算log softmax
    log_softmax = scaled_sim - tf.math.log(
        tf.reduce_sum(tf.exp(scaled_sim), axis=1, keepdims=True)
    )

    # 计算损失作为选择正样本的负对数似然
    loss = -tf.reduce_sum(pos_mask * log_softmax, axis=1)

    return tf.reduce_mean(loss)


def sampledsoftmaxloss(y_true, y_pred):
    """因为在模型构建的时候使用了sampled_softmax_loss,这里只需要计算mean就可以了"""
    return K.mean(y_pred)


def sum_loss(y_true, y_pred):
    return K.sum(y_pred)


def mean_loss(y_true, y_pred):
    return K.mean(y_pred)
