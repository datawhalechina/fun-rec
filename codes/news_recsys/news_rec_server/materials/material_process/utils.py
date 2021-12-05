# -*- coding: utf-8 -*-
"""
这里主要实现一些工具类的函数
"""
import re
import sys
sys.path.append("../../")
import jieba
import jieba.analyse
from conf.proj_path import stop_words_path

def get_key_words(words_str):
    """提取中文中的关键词
    """
    # 字符串进行清洗
    # 去除一些符号
    words_str.replace('\n', '').replace('\u3000', '').replace('\u00A0', '') 
    # 去除数字，特殊字符
    words_str = re.sub('[a-zA-Z0-9.。:：,，]', '', words_str)  
    # 切词
    words_list = jieba.cut(words_str)
    
    # 加载停用词
    stopword_set = set()
    with open(stop_words_path, encoding="utf-8") as f:
        line = f.readline().rstrip()
        stopword_set.add(line)
    
    # 去除停用词
    new_words_list = []
    for word in words_list:
        if word in stopword_set:
            continue
        new_words_list.append(word)
    
    new_words_str = " ".join(new_words_list)

    # 提取关键词   
    # 默认是TF-IDF
    key_words_list_tfidf = jieba.analyse.extract_tags(new_words_str, topK=10, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))
    key_words_list_textrank = jieba.analyse.textrank(new_words_str, topK=10, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))
    
    tfidf_textrank_list = list(set(key_words_list_tfidf) & set(key_words_list_textrank))[:3]

    return tfidf_textrank_list

if __name__ == "__main__":
    key_words = get_key_words("本教程主要是针对具有机器学习基础并想找推荐算法岗位的同学，由推荐算法基础、推荐算法入门赛、新闻推荐项目及推荐算法面经组成，形成了一个完整的从基础到实战再到面试的闭环。主要分为三个阶段，分别是推荐系统基础、推荐系统进阶和推荐算法面经，每个阶段的具体内容如下")
    print(key_words)