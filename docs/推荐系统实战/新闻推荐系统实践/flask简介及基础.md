本文属于新闻推荐实战—前后端交互—后端构建之Flask。Flask作为该项目中会用来作为系统的后台框架，作为一个算法工程师需要了解一些关于开发的知识，因为在实际的工作中经常调试线上的代码来调用策略或模型。本文将对Flask以及一些基本的使用进行了简单的介绍，方便大家快速理解项目中的相关内容。

# Flask简介

    Flask是一个轻量级的可定制框架，使用Python语言编写，较其他同类型框架更为灵活、轻便、安全且容易上手。它可以很好地结合MVC模式进行开发，开发人员分工合作，小型团队在短时间内就可以完成功能丰富的中小型网站或Web服务的实现。
    
    Flask是目前十分流行的web框架，采用Python编程语言来实现相关功能。Flask框架的主要特征是核心构成比较简单，但具有很强的扩展性和兼容性，程序员可以使用Python语言快速实现一个网站或Web服务。一般情况下，它不会指定数据库和模板引擎等对象，用户可以根据需要自己选择各种数据库。


[百度百科]: https://baike.baidu.com/item/Flask/1241509
[维基百科]: https://zh.wikipedia.org/zh-hans/Flask



# 一、 准备工作

在学习Flask之前，已经假设你对python已经有了一定的基础，并且对于计算机知识有了一定的掌握。

## 1.1 环境配置

为了保持全局环境的干净，指定不同的依赖版本，我们可以利用virtualenv来构建虚拟的环境，类似于anaconda。

```bash
pip install virtualenv
```

通过上述指令安装virtualenv，之后将在文件夹中创建新的虚拟环境。

```bash
mkdir newproj
cd newproj
virtualenv venv
```

要在Linux激活相应的环境。

```bash
venv/bin/activate
```

接下来就可以在这个环境中安装 Flask，当然如果你也可以选择使用下述指令直接在全局环境中安装Flask。

```bash
pip install Flask
```

## 1.2 测试安装

为了测试装的Flask是否能正常使用，可以在编译器中输入一下代码：

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
   return 'Hello World'

if __name__ == '__main__':
   app.run()
```

运行上述代码，在浏览器中打开**localhost: 5000**，将显示**Hello World**`消息。

```python
python Hello.py
```

上述代码中，Flask将(__name__)作为参数，即Flask在当前模块运行，route()函数是一个装饰器，将请求的url映射到对应的函数上。上述代码将'/'与hello_world()函数进行绑定，因此在请求localhost：5000时，网页显示 Hello World 结果。

程序的启动是用过Flask类的run()方法在本地启动服务器应用程序。

```python
app.run(host, port, debug, options)
```

其中参数是可选的。

| 序号 | 参数与描述                                                   |
| ---- | ------------------------------------------------------------ |
| 1    | **host** 要监听的主机名。 默认为127.0.0.1（localhost）。设置为“0.0.0.0”以使服务器在外部可用 |
| 2    | **port** 默认值为5000                                        |
| 3    | **debug** 默认为false。 如果设置为true，则提供调试信息       |
| 4    | **options** 要转发到底层的Werkzeug服务器。                   |

# 二、主要内容

## 2.1 路由

在Flask中，路由是指用户请求的*URL*与*视图函数*之间的映射。Flask通过利用路由表将URL映射到对应的视图函数，根据视图函数的执行结果返回给WSGI服务器。路由表的内容是由开发者进行填充，主要有一下两个方式。

- **route装饰器**：使用Flask应用实例的*route*装饰器将一个URL规则绑定到 一个视图函数上。

  ```python
  @app.route('/test')
  def test():
    return 'this is response of test function.'
  ```

  通过装饰器的方式，Flask框架会将URL规则<i>/test</i> 绑定到视图函数 <i>test()</i>上。

- **add_url_rule()** ：该方法直接会在路由表中注册映射关系。其实*route*装饰器内部也是通过调用<i>add_url_rule()</i>方法实现的路由注册。

  ```python
  def test():
    return 'this is response of test function.'
  app.add_url_rule('/test',view_func=test)
  ```

### 2.1.1 指定HTTP方法

默认情况下，Flask的路由支持HTTP的*GET*请求，如果需要视图函数支持HTTP的其他方法，可以通过*methods*关键字参数进行设置。关键字参数*methods*的类型为*list*，可以同时指定多种HTTP方法。

```python
@app.route('/user', methods = ['POST', 'GET'])
def get_users():
  if request.method == 'GET':
    return ... # 返回用户列表
  else:
    return ... # 创建新用户 
```



###  2.1.2 匹配动态URL

动态URL用于当需要将*同一类URL*映射到同一个视图函数处理，比如，使用同一个视图函数 来显示不同用户的个人信息。那么可以将URL中的可变部分*使用一对小括号*<>声明为变量， 并为视图函数声明同名的参数:

```python
@app.route('/user/<uname>')
def get_userInfo(uname):
  return '%s\'s Informations' % uname
```

除了上述方式来设置参数，还可以在URL参数前添加转换器来转换参数类型：

```python
@app.route('/user/<int:uname>')
def get_userInfo(uname):
    return '%s\'s Informations' % uname
```

使用该方法时，请求的参数必须是属于int类型，否则将会出现404错误。目前支持的参数类型转换器有：

| 类型转换器 | 作用                 |
| :--------- | :------------------- |
| 缺省       | 字符型，但不能有斜杠 |
| int:       | 整型                 |
| float:     | 浮点型               |
| path:      | 字符型，可有斜杠     |



### 2.1.3 匹配动态URL

为了满足一个视图函数可以解决多个问题，因此每个视图函数可以配置多个路由规则。

```python
@app.route('/user')
@app.route('/user/<uname>')
@app.route('/user/<int:uname>')
def get_userInfo(uname=None):
    if uname:
    	return '%s\'s Informations' % uname
    else:
        return 'this is all informations of users'
```



### 2.1.4 URL构建方法

在很多时候，在一个实用的视图中需要指向其他视图的连接，为了防止路径出现问题，我们可以让Flask框架帮我们计算链接URL。简单地给url_for()函数传入一个访问点，它返回将是一个可靠的URL地址：

```python
@app.route('/')
def hello():
    return 'Hello world!'

@app.route('/user/<uname>')
def get_userInfo(uname=None):
    if uname: return '%s\'s Informations' % uname
    else: return 'this is all informations of users'
@app.route('/test')
def test_url_for():
    print(url_for('hello'))  # 输出：/
```

添加URL变量 ： 如果指定访问点对应的视图函数接收参数，那么关键字参数将生成对应的参数URL。下面的 示例将生成 /user/zhangsan：

```python
@app.route('/')
def hello():
    return 'Hello world!'

@app.route('/user/<uname>')
def get_userInfo(uname=None):
    if uname:
        return '%s\'s Informations' % uname
    else:
        return 'this is all informations of users'

@app.route('/test')
def test_url_for():
    print(url_for('get_userInfo', uname='zhangsan'))  # 输出：/user/zhangsan
    print(url_for('test_url_for', num=2))  # 输出：/test?num=2
```



## 2.2  请求，响应及会话

对于一个完整的HTTP请求，包括了来自客户端的请求对象(Request)，服务器端的响应对象(Respose)和会话对象(Session)等。在Flask框架中，当然也具有这些对象，这些对象不仅可以在请求函数中使用，同时也可以在模板中使用。那我们来简单看看这些对象具体怎么使用。

### 2.2.1 请求对象 request

在Flask包中，可以直接引入request对象，其中包含**Form**，**args** ，**Cookies** ，**files** 等属性。**Form** 是一个字典对象，包含表单当中所有参数及其值的键和值对；**args** 是解析查询字符串的内容，它是问号（？）之后的URL的一部分，当使用get请求时，通过URL传递参数时可以通过**args**属性获取；**Cookies** 是用来保存Cookie名称和值的字典对象；**files** 属性和上传文件有关的数据。我们以一个登陆的例子看看如何搭配使用这些属性

```python
from flask import request, session, make_response

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'admin':
            session['username'] = request.form['username']
            response = make_response('Admin login successfully!')
            response.set_cookie('login_time', time.strftime('%Y-%m-%d %H:%M:%S'))
            return 'Admin login successfully!'
        else:
            return 'No such user!'
    elif request.method == 'GET':
        if request.args.get("username") == 'admin':
            session['username'] = request.form['username']
            return 'Admin login successfully!'
        else:
            return 'No such user!'
        
app.secret_key = '123456'
```

上述代码中，可以根据method属性判断当前请求的类型，通过form属性可以获取表单信息，并通过session来存储用户登陆信息。特别提醒，使用session时一定要设置一个密钥`app.secret_key`，并且密钥要尽量复杂。

我们可以使用make_response的方法就是用来构建`response`对象的第二个参数代表响应状态码，缺省就是”200”。`response`对象的详细使用可参阅Flask的[官方API文档](http://flask.pocoo.org/docs/0.10/api/#response-objects)。通过创建的`response`对象可以使用`response.set_cookie()`函数，来设置Cookie项，之后这个项值会被保存在浏览器中，等下次请求时可以从request对象中获取到cookies对象。

由于现在前后端的交互会采用json的数据格式进行传输，因此当前端请求的数据是json类型的时候，可以使用get_data()方法来获取。

```python
from flask import Flask, jsonify, request
@app.route('/login', methods=["POST"])
def login():
    request_str = request.get_data()
    request_dict = json.loads(request_str)
```

获取json数据之后，可以使用flask中的jsonify对象来处理json类型数据。



### 2.2.2 响应对象 response

如果视图函数想向前端返回数据，必须是`Response`的对象, 主要讲返回数据的几种方式：

**视图函数 return 多个值**

```python
@app.route("/user_one")
def user_one():
    return "userInfo.html", "200 Ok", {"name": "zhangsan"; "age":"20"}
```

当return多个值的时候，第一个是字符串，也是网页的内容；"200 Ok"表示状态码及解析；{"name": "zhangsan"; "age":"20"} 表示请求头。其中前面两个值是必须要的并且顺序不能改变，请求头不是必须要的，这样Flask会自动将返回值转换成一个相应的Response对象。如果仅返回一个字符串，则返回的Response对象会将该字符串作为body，状态码置为200。

**使用Response()构造Response对象**

可以使用Response()手动构造一个Response对象，配置其参数后返回该对象。

```python
from flask import Response

@app.route("/user_one")
def user_one():
    response = Response("user_one")
    response.status_code = 200
    response.status = "200 ok"
    response.data = {"name": "zhangsan"; "age":"20"}
    return response
```

**使用make_response函数构造Response对象**

`make_response` 函数可以传递三个参数 第一个是一个字符串，第二个传状态码，第三个传请求头。

```python
@app.route("/user_one")
def user_one():
    response = make_response('user_one', 200, {"name": "zhangsan"; "age":"20"})
    return response
```

由于现在前后端交互往往采用的是json的数据格式，因此可以将数据通过 jsonify 函数将其转化成json格式，再通过response对象发送给前端。

```python
@app.route('/hot_list', methods=["GET"])
def hot_list():
    if request.method == "GET":
        user_id = request.args.get('user_id')
        page_id = request.args.get('page_id')
        if user_id is None or page_id is None:
            return make_response(jsonify({"code": 2000, "msg": "user_id or page_id is none!"}), 200)
```



## 2.3 重定向与错误处理

### 2.3.1重定向

当一个请求过来后可能还需要再请求另一个视图函数才能达到目的，那么就可以调用`redirect(location, code=302, Response=None)`函数指定重定向页面。

```python
from flask import Flask, redirect, url_for

app = Flask(__name__)

@app.route("/demo")
def demo():
    url = url_for("demo2")  # 路由反转，根据视图函数名获取路由地址
    return redirect(url)

@app.route("/demo2")
def demo2():
    return "this is demo2 page"

@app.route("/")
def index():
    # 使用方法：redirect(location, code=302, Response=None) 
    return redirect("/demo", 301) 
```

#### 常用重定向状态码

| 状态码 | 说明                          |
| ------ | ----------------------------- |
| 300    | Multiple Choice，让用户选择   |
| 301    | Moved Permanently，永久重定向 |
| 302    | Found，临时重定向             |
| 303    | See Other，查看其它位置       |
| 304    | Not Modified，资源未发生变化  |
| 305    | Use Proxy，需要通过代理访问   |



### 2.3.2错误处理

当请求或服务器出现错误的时候，我们希望遇到特定错误代码时重写错误页面，可以使用 **errorhandler()** 装饰器：

```python
from flask import render_template

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404
```

当遇到404错误时，会调用page_not_found()函数，返回元组数据，第一个元素是”page_not_found.html”的模板页，第二个元素代表错误代码，返回值会自动转成 response 对象。

## 2.4 SQLAlchemy

SQLAlchemy 是一个功能强大的Python ORM 工具包，为应用程序开发人员提供了SQL的全部功能和ORM操作。其中ORM (Object Relation Mapping)指的是将对象参数映射到底层RDBMS表结构的技术，ORM API提供了执行CRUD操作的方法，不需要程序员编写原始SQL语句。

### 2.4.1安装

通过下面指令可以进行安装：

```shell
pip install SQLalchemy
```

在连接数据库时，我们使用pymysql框架进行连接，因此还需要使用下面指令下载pymysql框架：

```shell
pip install pymysql
```



### 2.4.2 创建连接

```python
from sqlalchemy import create_engine

def mysql_db(host='127.0.0.1',dbname='3306'):
    engine = create_engine("mysql+pymysql://root:123456@{}:49168/{}?charset=utf8".format(host,dbname))
    print(engine)  # Engine(mysql+pymysql://root:***@127.0.0.1:49168/3306?charset=utf8)
```

通过create_engine函数已经创建了Engine，在Engine内部实际上会创建一个Pool(连接池)和Dialect(方言)，并且可以发现此时Engine并不会建立连接，只会等到执行到具体的语句时才会连接到数据库。上述代码默认本地已经存在并开启mysql服务。

对于 create_engine 函数可以有以下参数

```javascript
create_engine("mysql://user:password@hostname/dbname?charset=utf8",
                       echo=True,
                       pool_size=8,
                       pool_recycle=60*30)
```

第一个参数是和框架表明连接数据库所需的信息，"数据库+数据库连接框架://用户名:密码@IP地址:端口号/数据库名称?连接参数"；echo是设置当前ORM语句是否转化为SQL打印；pool_size是用来设置连接池大小，默认值为5；pool_recycle设置连接失效的时间，超过时间连接池会自动断开。

### 2.4.3 **创建数据库表类**

由于SQLAlchemy 是对象关系映射，在操作数据库表时需要通过操作对象实现，因此就需要创建一个数据库表类。

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'UserInfo'
    index = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), unique=True)
    username = Column(String(30))
    passwd = Column(String(500))

    def __init__(self,index, user_id, username, passwd):
        self.index = index
        self.user_id = user_id
        self.username = username
        self.passwd = passwd
```

通过declarative_base()函数，可以将python类和数据库表进行关联映射，并通过 \__tablename\__ 属性将数据库模型类和表进行管理。其中Column() 表示数据表中的列，Integer()和String()表示数据库的数据类型。

### 2.4.4 **操作数据库**

创建完连接之后，我们需要借助sqlalchemy中的session来创建程序与数据库之间的会话。换句话来说，需要通过session才能利用程序对数据库进行CURD。这里我们可以通过 sessionmaker() 函数来创建会话。

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

def mysql_db(host='127.0.0.1',dbname='test'):
    engine = create_engine("mysql+pymysql://root:123456@{}:49168/{}?charset=utf8mb4".format(host,dbname))

    session = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)
    return engine, session()
```

session常用的方法如下：

- flush：预提交，提交到数据库文件，还未写入数据库文件中
- commit：提交了一个事务
- rollback：回滚
- close：关闭session连接

**增加数据**

增加一个用户：

```python
engine, session = mysql_db()
user = User("100","zhangsan","11111")
session.add(user)
session.commit()
```

注意一点，session.add()不会直接提交到数据库，而是在 commit 时才会提交到数据库。add操作会把user加入当前session维护的持久空间(可以从session.dirty看到)中。

也可以通过add_all() 进行批量提交。

```python
engine, session = mysql_db()
user1 = User("101","lisi","11111")
user2 = User("102","wangwu","22222")
session.add_all([user1,user2])
session.commit()
```

**查询数据**

```python
engine, session = mysql_db()
users = session.query(User).filter_by(passwd='11111').all()

for item in users:
    print(item.username,item.passwd)
```

通过上面代码可以查询获取数据，通过 **session.query()** 我们查询返回了一个Query对象，此时没有去数据库查询，只有等到.count() .first() .all() 具体函数时才会去数据库执行。还可以使用 **filter()** 方法查询，与 **filter_by()** 的区别如下：

|                                            |                              |
| :----------------------------------------- | :--------------------------- |
| filter                                     | filter_by                    |
| 支持所有比较运算符，相等比较用比较用==     | 只能使用"="，"!="和"><"      |
| 过滤用类名.属性名                          | 过滤用属性名                 |
| 不支持组合查询，只能连续调用filter变相实现 | 参数是**kwargs，支持组合查询 |
| 支持and，or和in等                          |                              |

**修改数据**

通过 query 中的 update() 方法：

```python
session.query(User).filter_by(username="zhangsan").update({'passwd': "123456"})
```

或者

```python
users = session.query(User).filter_by(username="zhangsan").first()
users.username = "zhangsan-test"
session.add(users)
session.commit()
```

**删除数据**

通过 query 中的 delete() 方法：

```python
session.query(User).filter(User.username == "zhangsan-test").delete()
session.commit()
```

或者 通过 session.delete() 方法

```python
users = session.query(User).filter(User.username == "lisi").first()
if users:
    session.delete(users)
    session.commit()
```



### 参考资料

1. [Flask教程](https://www.w3cschool.cn/flask/flask_sqlalchemy.html)

2. [[SQLAlchemy 1.4 Documentation](https://www.osgeo.cn/sqlalchemy/index.html)

   
