import os
# 切换目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE_DIR)
print(os.getcwd())

import pandas as pd
from examples.utils import get_hist_and_last_click
from recall_methods import sdm_recall
from metrics import H_Rate
import warnings
warnings.filterwarnings('ignore')

if __name__ == "__main__":
    data_path = 'data'
    data = pd.read_csv(os.path.join(data_path, 'train_data.csv'), index_col=0, parse_dates=['expo_time'])

    # 选择出需要用到的列
    use_cols = ['user_id', 'article_id', 'expo_time', 'net_status', 'exop_position', 'duration', 'city', 'age',
                'gender', 'click', 'cat_1', 'cat_2']
    data_new = data[use_cols]

    # 划分训练集和测试集
    click_df = data_new[data_new['click'] == 1]
    user_click_hist_df, user_click_last_df = get_hist_and_last_click(click_df)

    # sdm 召回
    user_recall_doc_dict = sdm_recall(user_click_hist_df)

    # 评估
    H_Rate(user_recall_doc_dict, user_click_last_df, topk=200)







