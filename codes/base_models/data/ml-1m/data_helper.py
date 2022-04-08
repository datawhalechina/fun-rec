# /usr/bin/Python2
#coding=utf8

import random

def loadfile(path):
    with open(path,"r") as f:
        for i,line in enumerate(f):
            yield line

def read_users(path = "users.dat"):
    """
                返回user的list
        Args:
            path :    文件路径
        Return:
            user的list形式,格式为（userId,性别，年龄，职业）
    """
    users = []
    for line in loadfile(path):
        users.append(line.split("::")[:-1])
    return users

def read_movies(path = "movies.dat"):
    """
                返回movie的list
        Args:
            path :    文件路径
        Return:
            movie的list形式,格式为（movieId,电影名，类型）
    """
    movies = []
    for line in loadfile(path):
        movies.append(line.split("::"))
    return movies

def read_ratings(path,pivot = 0.8):
    """ 
        Return:
                        点击的字典形式，格式为{userId : { movieId : rating}}
    """
    train_set = dict()
    test_set = dict() 
    
    for line in loadfile(path):
        user,movie,rating,_ = line.split("::")
        if random.random() < pivot:
            train_set.setdefault(user,{})
            train_set[user][movie] = int(rating)
        else:
            test_set.setdefault(user,{})
            test_set[user][movie] = int(rating)
    
    return train_set,test_set

