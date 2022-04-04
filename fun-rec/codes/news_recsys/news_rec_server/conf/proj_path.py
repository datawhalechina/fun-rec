import os

home_path = os.environ['HOME']
proj_path = home_path + "/fun-rec/codes/news_recsys/news_rec_server/"

stop_words_path = proj_path + "conf/stop_words.txt"
bad_case_news_log_path = proj_path + "logs/news_bad_cases.log"

root_data_path = "/home/recsys/news_data/5w_data/"
log_data_path = root_data_path + "train_data_5w.csv"
doc_info_path = root_data_path + "doc_info.txt"
user_info_path = root_data_path + "user_info_data_5w.csv" 