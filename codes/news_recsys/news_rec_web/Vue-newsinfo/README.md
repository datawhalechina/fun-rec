### 新闻推荐系统



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

- 推荐页和热门页之间的切换 

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

``` markdown
.
├── package.json  项目配置文件
├── package-lock.json
├── README.md  项目介绍
├── src
│   ├── App.vue  根组件
│   ├── assets  资源目录，这里的资源会被wabpack构建
│   │   ├── css  样式文件
│   │   │   ├── sign.css  登录注册页的样式
│   │   │   └── test.css  顶部导航样式
│   │   ├── js  功能文件
│   │   │   └── cookie.js  定义cookie的相关操作
│   ├── components  组件
│   │   ├── bottomBar.vue  底部导航
│   │   ├── hotLists.vue  热门页
│   │   ├── Myself.vue  个人中心
│   │   ├── NewsInfo.vue  新闻详情页
│   │   ├── recLists.vue  推荐页
│   │   ├── signIn.vue  登录
│   │   └── signUp.vue  注册
│   ├── images  图片
│   │   ├── datawhale.png  DataWhale头像
│   │   ├── dw.png  DataWhale二维码
│   │   └── favicon.ico  浏览器小图标
│   ├── index.html  首页入口文件
│   ├── main.js  入口js文件
│   ├── router.js   配置路由页面跳转
│   └── store.js  状态管理
├── vue.config.js  vue项目的配置文件，专用于vue项目
└── webpack.config.js  webpack的配置文件，所有使用webpack作为打包工具的项目都可以使用
```

---
#### cookie.js

定义cookie的相关操作

定义了`setCookie`,`getCookie`,`clearCookie`三个函数

在用户登录注册时存入cookie

``` javascript
function setCookie(json, days) {
    // 设置过期时间
    let data = new Date(
        new Date().getTime() + days * 24 * 60 * 60 * 1000
    ).toUTCString();

    for (var key in json) {
        document.cookie = key + "=" + json[key] + "; expires=" + data
    }
}
```

获取cookie

``` javascript
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2])
    } else {
        return null
    }
}
```

用户退出登录时删除cookie

``` javascript
function clearCookie(name) {
    let json = {};
    json[name] = '';
    setCookie(json, -1)
}
```


#### APP.vue

定义了组件的缓存

从新闻列表跳到详情页，然后返回详情页的时列表不需要刷新，并且滚动条保持在之前的位置,使用keep-alive组件进行状态缓存

被keep-alive包裹住的组件在重新进入时不会刷新,通过设置router中的meta.keepAlive属性值选择需要被缓存的组件

``` javascript
<keep-alive v-if="isLoggedIn">
   <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive||!isLoggedIn"></router-view>
```


#### signIn.vue/signUp.vue

登录注册时将信息存入store

``` javascript
this.$store.state.type = 'signIn'
this.$store.state.user.username = res.username
```

存入cookie值

``` javascript
// checke:true--选中记住我   checke:false--未选中记住我
if(this.checked){
   // 调用setCookie方法，同时传递需要存储的数据，保存天数
   this.cookie.setCookie(loginInfo, 7)
}else{
   this.cookie.setCookie(loginInfo, 1)
}
```

#### recLists.vue/hotLists.vue

获取后端接口数据

``` javascript
getList() {
   var url;
   if(this.$store.state.type == 'signIn'){
      url = '/recsys/rec_list?' + 'user_id=' + this.$store.state.user.username
   }else if(this.$store.state.type == 'signUp'){
      url = '/recsys/rec_list?' + 'user_id=' + this.$store.state.user.username  + '&age=' + this.$store.state.user.age + '&gender=' + this.$store.state.user.gender
   }

   this.axios.get(url).then(res => {
      if (res.data.code === 200) {
      this.$store.state.recList.push(...res.data.data)
      this.vanListLoading = false
      }
   })
},
```

再次进入页面时定位在退出时的位置

``` javascript
// 当组件在 <keep-alive> 内被切换，activated 会被对应执行
// 每次进入该组件时会执行,设置滚动条的位置
activated(){
   document.documentElement.scrollTop = this.scrollTop
},

//在离开该组件时执行，执行完后跳转
// to:要去到的组件  from:离开的组件(本组件)  next():执行的函数，下一步
beforeRouteLeave(to, from, next) {
   // 如果下一个去到的组件是新闻详情页，触发store中的numChange函数，使阅读次数+1
      if(to.name == 'NewsInfo' ){
      this.$store.commit('numChange', {item:'hotList',path:to.path})
   }
   // 存储离开时的滚动条位置
   this.scrollTop = document.documentElement.scrollTop
   // next()必须要写，不写不会发生跳转
   next();
},
```


#### router.js

定义路由相关配置，控制页面跳转

``` javascript
let routerObj = new VueRouter({
   routes: [
      {
         path: '/',
         component: signIn,  // 同步加载组件，加载完成后进入首页
         name: 'signIn',
         meta: {
               keepAlive: false,
         },
      },
      {
         path: '/signUp',
         component: () => import('./components/signUp.vue'),  //异步加载组件，进入组件时再加载提高进入首页时的加载速度
         name: 'signUp',
         meta: {
               keepAlive: false,
         },
      },
})
```

解决跳转相同路由时会报错的问题

``` javascript
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
```

路由守卫，用户未登录时通过外部链接进入页面会跳转到首页

``` javascript
/*
* beforeEach:从一个页面跳转到另外一个页面时触发
* to:要跳转的页面
* from:从哪个页面出来
* next:决定是否通过
*/

routerObj.beforeEach((to, from, next) => {
   if (cookie.getCookie("openId")) {
      next()
   } else {
      if (to.path == "/") {
         next()
      } if (to.path == '/signUp') {
         next()
      } else {
         next('/')
      }
   }
})
```


#### store.js

管理用户的各种状态


``` javascript
//创建一个 store
export default new Vuex.Store({
   // 添加 state 状态
    state: {
      
    },

    // 更改 store 中的 state 状态
    mutations: {
        //点进新闻详情页时触发，让阅读次数增加
        numChange(state, payload) {
            let reg = /NewsInfo\//
            if(payload.item == 'recList'){
                for (let i = 0; i < state.recList.length; i++) {
                    if (state.recList[i].news_id == payload.path.split(reg)[1]) {
                        state.recList[i].read_num++
                    }
                }
            }else if(payload.item == 'hotList'){
                for (let i = 0; i < state.hotList.length; i++) {
                    if (state.hotList[i].news_id == payload.path.split(reg)[1]) {
                        state.hotList[i].read_num++
                    }
                }
            }
        },

        //点击喜欢或者收藏时触发，让相应次数增加或者减少
        actionChange(state, payload){
            if(payload.type == 'likes'){
                for(let i = 0; i<state.recList.length; i++){
                    if(state.recList[i].news_id == payload.id){
                        state.recList[i].likes = state.recList[i].likes + payload.num
                    }
                }
                for(let i = 0; i<state.hotList.length; i++){
                    if(state.hotList[i].news_id == payload.id){
                        state.hotList[i].likes = state.hotList[i].likes + payload.num
                    }
                }
            }else if(payload.type == 'collections'){
                for(let i = 0; i<state.recList.length; i++){
                    if(state.recList[i].news_id == payload.id){
                        state.recList[i].collections = state.recList[i].collections + payload.num
                    }
                }
                for(let i = 0; i<state.hotList.length; i++){
                    if(state.hotList[i].news_id == payload.id){
                        state.hotList[i].collections = state.hotList[i].collections + payload.num
                    }
                }
            }
            
        }
    },
})
```

**state:**

在store中存储状态，在组件中通过 `this.$store.state.type` 调用

``` javascript
state: {
   type: '',  //signIn,signUp  区分获取接口时的url
   user: {
      username: '',
      age: '',
      gender: ''
   },  //存储用户信息
   recList: [],  //推荐页的新闻列表
   hotList: [],  //热门页的新闻列表
},
```

**mutations:**

更改 store 中的状态,在组件中通过 `this.$store.commit('numChange')`调用

``` javascript
mutations: {
   //点进新闻详情页时触发，让阅读次数增加
   numChange(state, payload) {
      let reg = /NewsInfo\//
      if(payload.item == 'recList'){
            for (let i = 0; i < state.recList.length; i++) {
               if (state.recList[i].news_id == payload.path.split(reg)[1]) {
                  state.recList[i].read_num++
               }
            }
      }else if(payload.item == 'hotList'){
            for (let i = 0; i < state.hotList.length; i++) {
               if (state.hotList[i].news_id == payload.path.split(reg)[1]) {
                  state.hotList[i].read_num++
               }
            }
      }
   },

   //点击喜欢或者收藏时触发，让相应次数增加或者减少
   actionChange(state, payload){
      if(payload.type == 'likes'){
            for(let i = 0; i<state.recList.length; i++){
               if(state.recList[i].news_id == payload.id){
                  state.recList[i].likes = state.recList[i].likes + payload.num
               }
            }
            for(let i = 0; i<state.hotList.length; i++){
               if(state.hotList[i].news_id == payload.id){
                  state.hotList[i].likes = state.hotList[i].likes + payload.num
               }
            }
      }else if(payload.type == 'collections'){
            for(let i = 0; i<state.recList.length; i++){
               if(state.recList[i].news_id == payload.id){
                  state.recList[i].collections = state.recList[i].collections + payload.num
               }
            }
            for(let i = 0; i<state.hotList.length; i++){
               if(state.hotList[i].news_id == payload.id){
                  state.hotList[i].collections = state.hotList[i].collections + payload.num
               }
            }
      }
      
   }
},
```






#### NewsInfo.vue

发送action请求

``` javascript
sendInfo() {
   // 阅读
   var val = {
      user_name: this.$store.state.user.username,
      news_id: this.id,
      action_time: Date.now(),
      action_type: 'read',
   }

   // 喜欢
   var val = {
      user_name: this.$store.state.user.username,
      news_id: this.id,
      action_time: Date.now(),
      action_type: `likes:${this.islike}`,
   }

   // 收藏
   var val = {
      user_name: this.$store.state.user.username,
      news_id: this.id,
      action_time: Date.now(),
      action_type: `collections:${this.iscollection}`,
   }

   // 发送对应请求
   this.axios.post("/recsys/action", val).then(resource => {
      if (resource.status === 200) {} else {
         Toast('加载数据失败')
      }
   })
},
```

#### Myself.vue

退出登录时删除该用户相关信息

``` javascript
quit() {
   // 清空该用户的新闻列表
   this.$store.state.recList = [];
   this.$store.state.hotList = [];

   /*删除cookie*/
   this.cookie.clearCookie('LoginName')
   this.cookie.clearCookie('openId')

   // 跳转到登录页
   this.$router.push('/signIn')
}
```

进入页面时保持滚动条在顶部

``` javascript
// 在进入该组件时触发，执行完后进入组件
// 设置滚动条保持在顶部
beforeRouteEnter(to, from, next){
   document.documentElement.scrollTop = 0
   next()
},
```
