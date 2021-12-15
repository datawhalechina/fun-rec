### 新闻推荐系统

- 项目学习到的知识点

  + 基于vue的框架Vant UI的基本使用。

  + 基于nodejs的npm包管理工具、打包工具webpack和与之相对应的插件。

  + vue路由的相关知识，路由的配置和渲染以及路由守卫的使用。

  + vue-axios的使用,项目里调用接口都是用的这个异步ajax插件。

  + 全局组件的使用。

---


### 运行

1. 跳转到前端项目文件目录：`cd Vue-newsinfo`

2. 本地安装node环境，在项目根目录命令行输入命令`npm install`安装依赖包
   
   如果因为版本或者网络问题下载失败请执行`npm install -g cnpm -registry=https://registry.npm.taobao.org/
`和`cnpm install`

1. 启动前端服务：`npm run dev`

2. 本机访问地址`http://localhost:8686/#/` 

   (根据需要修改package.json下`"scripts": {
    "dev": "webpack-dev-server --open --port 8686 --contentBase src --hot --host 0.0.0.0"},`中的ip和端口号)

3. 点击`F12`或者右键选择`检查`打开`开发者模式`,选中移动端浏览（点击左上角箭头右边的手机按钮）开始体验

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

<div  align="center">    
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/个人中心1.jpg" width = "30%" height = "30%" alt="个人中心1"/> 
<img src="https://gitee.com/theNeverLemon/news-img/raw/master/img/个人中心2.jpg" width = "30%" height = "30%" alt="个人中心2"/>
</div>




### 项目目录

```
.
├── package.json  项目配置文件
├── package-lock.json
├── README.md  项目介绍
├── src
│   ├── api
│   │   └── newVue.js  引入'EventBus'进行参数传递 (最后未使用)
│   ├── App.vue  根组件
│   ├── assets  资源目录，这里的资源会被wabpack构建
│   │   ├── css  样式文件
│   │   │   ├── sign.css  登录注册页的样式
│   │   │   ├── tab.css  vant顶部导航样式 (最后未使用)
│   │   │   └── test.css  顶部导航样式
│   │   ├── js  功能文件
│   │   │   └── cookie.js  定义cookie的相关操作
│   │   └── logo.png  vue的logo（未使用）
│   ├── components  组件
│   │   ├── bottomBar.vue  底部导航
│   │   ├── common.vue  存放全局变量
│   │   ├── hotLists.vue  热门页
│   │   ├── Myself.vue  个人中心
│   │   ├── NewsInfo.vue  新闻详情页
│   │   ├── recLists.vue  推荐页
│   │   ├── signIn.vue  登录
│   │   └── signUp.vue  注册
│   ├── images  图片
│   │   ├── datawhale.png  DataWhale头像
│   │   └── dw.png  DataWhale二维码
│   ├── index.html  首页入口文件
│   ├── lib  库（(最后未使用)）
│   │   └── mui
│   ├── main.js  入口js文件
│   ├── router.js   配置路由页面跳转
│   └── store.js  应用级数据（state）
├── vue.config.js  vue项目的配置文件，专用于vue项目
└── webpack.config.js  webpack的配置文件，所有使用webpack作为打包工具的项目都可以使用
```

