### 新闻推荐系统

  + 基于vue的框架Vant UI的基本使用。

  + 基于nodejs的npm包管理工具、打包工具webpack和与之相对应的插件。

  + vue路由的相关知识，路由的配置和渲染以及路由守卫的使用。

  + vue-axios的使用,项目里调用接口都是用的这个异步ajax插件。

  + 全局组件的使用。

---

### 项目地址

#### vue2(自动打包 方便运行在远程服务器)

**源代码:**
[GitHub](https://github.com/datawhalechina/fun-rec/tree/master/codes/news_recsys/news_rec_web/Vue-newsinfo)

**演示链接：**
http://47.108.56.188:8686/#/

- 测试用户名: `11`   测试密码: `111111`

<br>

#### vue2(不打包 方便本地调试)

**源代码:**
[GitHub](https://github.com/datawhalechina/fun-rec/tree/master/codes/news_recsys/news_rec_web/vue2-fun-rec) 　[Gitee](https://gitee.com/theNeverLemon/vue-fun-rec)

**演示链接:**
http://theneverlemon.gitee.io/vue2-fun-rec-project/#/

- 测试用户名: `11`   测试密码: `111111` (连接远程服务器，具有推荐功能，优先使用这个)
- 测试用户名: `user`   测试密码: `pass` (mock数据模拟，远程服务器获取不到数据时使用，没有推荐功能)

---


### 目标功能
- [X] **用户登录** —— 老用户登录
  
- `记住我`可以保存将登录信息保存7天

- `忘记密码` 暂时没有写逻辑不能使用


<div  align="center">    
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/登录.jpg" width = "30%" height = "30%" alt="登录"/>
</div>


- [X] **用户注册** —— 新用户注册信息

- 用户名可以为英文和数字

- 密码是大于6位的英文和数字

- 年龄是1-100的整数

- 注册成功后将跳转至主页面

<div  align="center">    
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/注册.jpg" width = "30%" height = "30%" alt="注册"/>
</div>


- [X] **推荐页及热门页内容显示** —— 根据不同用户个性化显示不同新闻内容

- 推荐页和热门页之间的切换（首次切换时会刷新，正在修复这个bug） 

- 点进新闻详情页后阅读次数会实时增加

<div  align="center">    
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/推荐.jpg" width = "30%" height = "30%" alt="推荐"/>  
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/热门.jpg" width = "30%" height = "30%" alt="热门"/>
</div>


- [x] **新闻详情** —— 显示当前新闻的详细信息

- 显示标题、内容等信息

- 底部点击`喜欢`或者`收藏`可以记录将当前用户行为，并在列表页相应增加

<div  align="center">    
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/新闻详情.jpg" width = "30%" height = "30%" alt="新闻详情"/>
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/新闻详情2.jpg" width = "30%" height = "30%" alt="新闻详情2"/>
</div>

- [X] **个人中心** —— 记录用户的头像和用户名

- 显示头像和登录名（头像暂时统一为DataWhle图标）

- 显示DataWhale相关介绍

- 点击`退出登录`回到登录页

<div  align="center">    
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/个人中心1.jpg" width = "30%" height = "30%" alt="个人中心1"/> 
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/个人中心2.jpg" width = "30%" height = "30%" alt="个人中心2"/>
</div>