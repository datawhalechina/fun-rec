import sys
sys.path.append("./")
import json
from flask_cors import * 
from flask import Flask, jsonify, request
import snowflake.client  
from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from dao.entity.logitem import LogItem
from dao.entity.user_likes import UserLikes
from dao.entity.user_collections import UserCollections
from controller.user_action_controller import UserAction
from controller.log_controller import LogController
from recprocess.online import OnlineServer as RecsysServer

app = Flask(__name__)

# 允许跨域访问
CORS(app, supports_credentials=True)

# 定义推荐服务的实例, 是一个单例类
recsys_server = RecsysServer()

@app.route('/recsys/register', methods=["POST"])
def register():
    """用户注册
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    # print(request_dict)
    
    user = RegisterUser()
    user.username = request_dict["username"]
    user.passwd = request_dict["passwd"]

    # 查询当前用户名是否已经被用过了
    result = UserAction().user_is_exist(user, "register")

    if result != 0:
        return jsonify({"code": 500, "mgs": "this username is exists"})

    user.userid = snowflake.client.get_guid() # 雪花算法
    
    user.age = request_dict["age"]
    user.gender = request_dict["gender"]
    user.city = request_dict["city"]

    # 添加注册用户
    save_res = UserAction().save_user(user)
    if not save_res:
        return jsonify({"code": 500, "mgs": "register fail."})

    return jsonify({"code": 200, "msg": "register success."})


@app.route('/recsys/login', methods=["POST"])
def login():
    """用户登录
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    
    user = RegisterUser()
    user.username = request_dict["username"]
    user.passwd = request_dict["passwd"]

    # 查询数据库中的用户名或者密码是否存在
    try:
        result = UserAction().user_is_exist(user, "login")
        # print(result,"login")
        if result == 1:
            return jsonify({"code": 200, "msg": "login success"})
        elif result == 2:
            # 密码错误
            return jsonify({"code": 500, "msg": "passwd is error"})
        else:
            return jsonify({"code": 500, "msg": "this username is not exist!"})
    except Exception as e:
        return jsonify({"code": 500, "mgs": "login fail."})


@app.route('/recsys/rec_list', methods=["GET"])
def rec_list():
    """推荐页
    """
    user_name = request.args.get('user_id')
    page_id = request.args.get('page_id')

    # 查询用户的id
    user_id = UserAction().get_user_id_by_name(user_name)  
    if not user_id:
        return False

    if user_id is None or page_id is None:
        return jsonify({"code": 2000, "msg": "user_id or page_id is none!"}) 
    try:
        rec_news_list = recsys_server.get_cold_start_rec_list_v2(user_id)
        # 冷启动策略
        # rec_news_list = recsys_server.get_cold_start_rec_list(user_id)
        
        if len(rec_news_list) == 0:
            return jsonify({"code": 500, "msg": "rec_list data is empty."})
        return jsonify({"code": 200, "msg": "request rec_list success.", "data": rec_news_list, "user_id": user_id})
    except Exception as e:
        print(str(e))
        return jsonify({"code": 500, "msg": "redis fail."}) 


@app.route('/recsys/hot_list', methods=["GET"])
def hot_list():
    """热门页面
    """
    if request.method == "GET":
        user_name = request.args.get('user_id')
        page_id = request.args.get('page_id')

        if user_name is None or page_id is None:
            return jsonify({"code": 2000, "msg": "user_name or page_id is none!"}) 

        # 查询用户的id
        user_id = UserAction().get_user_id_by_name(user_name)  
        if not user_id:
            return False

    try:
        # 这里需要改成get_hot_list, 当前get_hot_list方法还没有实现
        # rec_news_list = recsys_server.get_hot_list(user_id)

        rec_news_list = recsys_server.get_hot_list_v2(user_id)

        if len(rec_news_list) == 0:
            return jsonify({"code": 200, "msg": "request redis data fail."})
        # rec_news_list = recsys_server.get_hot_list(user_id, page_id)
        return jsonify({"code": 200, "msg": "request hot_list success.", "data": rec_news_list, "user_id": user_id})
    except Exception as e:
        print(str(e))
        return jsonify({"code": 2000, "msg": "request hot_list fail."}) 


@app.route('/recsys/news_detail', methods=["GET"])
def news_detail():
    """一篇文章的详细信息
    """
    user_name = request.args.get('user_name')
    news_id = request.args.get('news_id')
    
    user_id = UserAction().get_user_id_by_name(user_name)  

    # if news_id is None or user_id is None:
    if news_id is None or user_name is None:
        return jsonify({"code": 2000, "msg": "news_id is none or user_name is none!"}) 
    try:
        news_detail = recsys_server.get_news_detail(news_id)

        # recsys_server.save_user_consume(user_id,news_id)  # 记录用户消费的
  
        if UserAction().get_likes_counts_by_user(user_id,news_id) > 0:
            news_detail["likes"] = True
        else:
            news_detail["likes"] = False

        if UserAction().get_coll_counts_by_user(user_id,news_id) > 0:
            news_detail["collections"] = True
        else:
            news_detail["collections"] = False
        # print("test",news_detail)
        return jsonify({"code": 0, "msg": "request news_detail success.", "data": news_detail})
    except Exception as e:
        print(str(e))
        return jsonify({"code": 2000, "msg": "error"}) 


@app.route('/recsys/action', methods=["POST"])
def actions():
    """用户的行为：阅读，点赞，收藏
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    
    username = request_dict.get('user_name')
    newsid = request_dict.get('news_id')
    actiontype = request_dict.get("action_type")
    actiontime = request_dict.get("action_time")

    userid = UserAction().get_user_id_by_name(username)   # 获取用户 id
    if not userid:
        return jsonify({"code": 2000, "msg": "user not register"})

    #TODO 先判断当前的action_type是否是取消的意思，如果是的话，需要将数据库中对应的操作删掉
    action_type_list = actiontype.split(":")
    # print(actiontype)
    if len(action_type_list) == 2:
        _action_type = action_type_list[0]
        if action_type_list[1] == "false": # 如果数据库中这个参数为false的话
            # 删除数据 
            if _action_type=="likes": 
                UserAction().del_likes_by_user(userid,newsid)    # 删除用户喜欢记录
            elif _action_type=="collections":
                UserAction().del_coll_by_user(userid,newsid)     # 删除用户收藏记录 
        else: 
            if _action_type=="likes":
                userlikes = UserLikes()
                userlikes.new(userid,username,newsid)
                UserAction().save_one_action(userlikes)       # 记录用户喜欢记录
            elif _action_type=="collections":
                usercollections = UserCollections()
                usercollections.new(userid,username,newsid)
                UserAction().save_one_action(usercollections)   # 记录用户收藏记录 

    try:
        # 落日志
        logitem = LogItem()
        logitem.new(userid,newsid,action_type_list[0])
        LogController().save_one_log(logitem)

        # 更新redis中的展示数据   新闻侧
        # if action_type_list[0] in ["read","likes","collections"]:
        recsys_server.update_news_dynamic_info(news_id=newsid,action_type=action_type_list)
        return jsonify({"code": 200, "msg": "action success"})

    except Exception as e:
        print(str(e))
        return jsonify({"code": 2000, "msg": "action error"})

    
if __name__ == '__main__':
    # 允许服务器被公开访问
    app.run(debug=True, host='0.0.0.0', port=3000, threaded=True)
    # 只能被自己的机子访问
    # app.run(debug=True, host='127.0.0.1', port=10086, threaded=True)

