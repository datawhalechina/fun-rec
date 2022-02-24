#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : run_deepfm_ppnet.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/8


from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.metrics import AUC

from models.deepfm_ppnet import DeepFM_PPNet


def run(train_data, test_data, feature_columns, args):
    # 1. 建模
    model = DeepFM_PPNet(
        feature_columns=feature_columns,
        ppnet_size=args.ppnet_size,
        ppnet_features=args.ppnet_features,
        dnn_hidden_units=args.hidden_units,
        dnn_drop_rate=args.drop_rate,
        dnn_use_bn=args.use_bn)
    # 2. 编译
    model.compile(optimizer=Adam(learning_rate=args.learning_rate),
                  loss="binary_crossentropy",
                  metrics=[AUC()])
    model.summary()
    # 3. 训练
    model.fit(train_data[0],
              train_data[1],
              batch_size=args.batch_size,
              epochs=args.epochs,
              callbacks=[EarlyStopping(monitor='val_loss',
                                       patience=args.patience,
                                       mode='min',
                                       restore_best_weights=args.restore_best_weights)],
              validation_split=args.val_splite,
              )
    # 4. 测试
    print('test AUC: %f' % model.evaluate(test_data[0], test_data[1], batch_size=args.batch_size)[1])
