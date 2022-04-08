from random import seed
import sys
sys.path.append("..")
import os 
import time 
from sklearn.preprocessing import LabelEncoder
from features import DenseFeat, SparseFeat, VarLenSparseFeat
from models import FiBiNet
import tensorflow as tf
from tensorflow.keras.callbacks import TensorBoard
from preprocess import process_data

os.environ["CUDA_VISIBLE_DEVICES"] = "2"


if __name__  == "__main__":
    feature_max_index_dict, train_input_dict, train_label = process_data(sample_num=1000)
    embed_dim = 4

    linear_feature_names = ['is_weekend','weekday','hour_v2']
        
    dnn_feature_names = ['id', 'C1', 'banner_pos', 'site_id', 'site_domain', 
        'site_category', 'app_id', 'app_domain', 'app_category', 'device_id', 
        'device_ip', 'device_model', 'device_type','device_conn_type', 'C14', 
        'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'is_weekend', 'weekday', 
        'hour_v2']

    linear_feature_columns = [SparseFeat(name, vocabulary_size=feature_max_index_dict[name],
        embedding_dim=embed_dim, embedding_name=name) for name in linear_feature_names]

    dnn_feature_columns = [SparseFeat(name, vocabulary_size=feature_max_index_dict[name],
        embedding_dim=embed_dim, embedding_name=name, group_name='bilinear') for name in dnn_feature_names]

    model = FiBiNet(linear_feature_columns, dnn_feature_columns, bilinear_type='each')
    # model.summary()

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3), 
        loss=tf.keras.losses.BinaryCrossentropy(), 
        metrics=[tf.keras.metrics.AUC()])
    
    model_name = "fibinet-{}".format(int(time.time()))
    tensorboard = TensorBoard(
        log_dir='logs/{}'.format(model_name), 
        update_freq='batch')
    
    model.fit(train_input_dict, train_label, 
                    batch_size=2048, epochs=5, verbose=1, 
                    validation_split=0.2, callbacks=[tensorboard])

    # evaluation = model.evaluate(test_input_dict, test_label, batch_size=2048, 
    #     verbose=1, return_dict=True, callbacks=[tensorboard])
    # print(evaluation)