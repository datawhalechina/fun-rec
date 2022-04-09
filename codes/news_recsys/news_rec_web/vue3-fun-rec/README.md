**演示链接：**
http://theneverlemon.gitee.io/vue3-fun-rec-project/#/

- 测试用户名: `11`   测试密码: `111111` (连接远程服务器，具有推荐功能，优先使用这个)
- 测试用户名: `user`   测试密码: `pass` (mock数据模拟，远程服务器获取不到数据时使用，没有推荐功能)

---


### 新闻推荐系统

  + 基于vue3的框架Vant UI的基本使用。

  + 基于nodejs的npm包管理工具、打包工具webpack和与之相对应的插件。

  + vue路由的相关知识，路由的配置和渲染以及路由守卫的使用。

  + vue-axios的使用,项目里调用接口都是用的这个异步ajax插件。

  + 全局组件的使用。

---


### 运行

1. 跳转到前端项目文件目录：`cd vue3-fun-rec`

2. 本地安装node环境，在项目根目录命令行输入命令`npm install`安装依赖包
   
   如果因为版本或者网络问题下载失败请执行`npm install -g cnpm -registry=https://registry.npm.taobao.org/
`和`cnpm install`

1. 启动前端服务：`npm run server`

2. 本机访问地址`http://localhost:8080/#/` 

3. 点击`F12`或者右键选择`检查`打开`开发者模式`,选中移动端浏览（点击左上角箭头右边的手机按钮）开始体验

---



### 目标功能
- [X] **用户登录** —— 老用户登录
  
- `记住我`可以保存将登录信息保存7天

- `忘记密码` 暂时没有写逻辑不能使用

如果获取不到远程数据库 将使用mock进行数据模拟
测试用户名`user` 密码`pass`

<div  align="center">    
<img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E7%99%BB%E5%BD%95.jpg" width = "30%" height = "30%" alt="登录"/>
</div>


- [X] **用户注册** —— 新用户注册信息

- 用户名可以为英文和数字

- 密码是大于6位的英文和数字

- 年龄是1-100的整数

- 注册成功后将跳转至主页面

<div  align="center">    
<img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E6%B3%A8%E5%86%8C.jpg" width = "30%" height = "30%" alt="注册"/>
</div>


- [X] **推荐页及热门页内容显示** —— 根据不同用户个性化显示不同新闻内容

- 推荐页和热门页之间的切换（首次切换时会刷新，正在修复这个bug） 

- 点进新闻详情页后阅读次数会实时增加

<div  align="center"> 
   <img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E6%8E%A8%E8%8D%90.jpg" width = "30%" height = "30%" alt="推荐"/>   
   <img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E7%83%AD%E9%97%A8.jpg" width = "30%" height = "30%" alt="热门"/>  
</div>


- [x] **新闻详情** —— 显示当前新闻的详细信息

- 显示标题、内容等信息

- 底部点击`喜欢`或者`收藏`可以记录将当前用户行为，并在列表页相应增加

<div  align="center">    
<img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E6%96%B0%E9%97%BB%E8%AF%A6%E6%83%85.jpg" width = "30%" height = "30%" alt="新闻详情"/>
<img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E6%96%B0%E9%97%BB%E8%AF%A6%E6%83%852.jpg" width = "30%" height = "30%" alt="新闻详情2"/>
</div>

- [X] **个人中心** —— 记录用户的头像和用户名

- 显示头像和登录名（头像暂时统一为DataWhle图标）

- 显示DataWhale相关介绍

<div  align="center">    
<img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%831.jpg" width = "30%" height = "30%" alt="个人中心1"/> 
<img src="https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-img%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%832.jpg" width = "30%" height = "30%" alt="个人中心2"/>
</div>




### 项目目录
```markdown 
├─ .browserslistrc  配置兼容浏览器 
├─ .eslintrc.js  eslintrc配置文件
├─ babel.config.js  兼容js语法
├─ package.json  项目配置文件
├─ public
│  ├─ favicon.ico  浏览器小图标
│  └─ index.html  首页入口文件
├─ README.md  项目介绍
├─ src
│  ├─ App.vue  根组件
│  ├─ assets  资源目录
│  │  ├─ css  样式文件
│  │  │  ├─ sign.css  登录注册页的样式
│  │  │  └─ test.css  顶部导航样式
│  │  ├─ images  静态图片
│  │  │  ├─ collects.png  未选中收藏
│  │  │  ├─ collects1.png  选中收藏
│  │  │  ├─ datawhale.png  DataWhale头像
│  │  │  ├─ dw.png  DataWhale二维码
│  │  │  ├─ favicon.ico  浏览器小图标
│  │  │  ├─ likes.png  未选中喜欢
│  │  │  └─ likes1.png  选中喜欢
│  │  └─ js  功能文件
│  │     ├─ cookie.js  定义cookie的相关操作
│  │     └─ encrypt.js  密码加密
│  ├─ components  组件
│  │  └─ bottomBar.vue  底部导航
│  ├─ main.js  入口js文件
│  ├─ mock
│  │  └─ index.js  数据模拟
│  ├─ router
│  │  └─ index.js  配置路由控制页面跳转
│  ├─ store
│  │  └─ index.js  状态管理
│  └─ views  视图
│     ├── hotLists.vue  热门页
│     ├── Myself.vue  个人中心
│     ├── NewsInfo.vue  新闻详情页
│     ├── recLists.vue  推荐页
│     ├── signIn.vue  登录
│     └── signUp.vue  注册
└─ vue.config.js  vue项目的配置文件，专用于vue项目
```

---

### 数据获取
在远程服务器偶尔获取不到的情况下通过`mockjs`进行数据的模拟

#### 定义flag
```javascript
// store/index.js
state: {
  flag:false,
},
```

#### 判断服务器是否正常运行
```javascript
// main.js

// 如果数据可以获取到 将flag赋值为true 否则赋值为false
axios.post('http://47.108.56.188:3000/recsys/login?username=11&passwd=111111').then(() => {
    store.state.flag = true
}).catch(()=>{
    store.state.flag = false
})

// 如果为false 引入mockjs进行数据模拟
!store.state.flag && require("./mock/index.js")
```

#### 通过flag请求不同的数据链接
```javascript
// hotList.vue

async getList() {
  let url = '/recsys/hot_list?' + 'user_id=' + this.$store.state.user.username 

  let successData
  // 通过flag判断url地址
  if(this.$store.state.flag){
    successData = await this.axios.get(url).then(res => {
      return res
    })
  }else {
    successData = await this.axios.get("/hotList").then(res => {
      return res
    })
  }

  if (successData.data.code === 200) {
    this.$store.state.hotList.push(...successData.data.data)
    this.vanListLoading = false
  }
},
```



---
### 主要文件说明

#### assets/js/cookie.js

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

#### router/index.js

定义路由相关配置，控制页面跳转

``` javascript
const routes = [
  {
    path: '/',
    alias: '/signIn',  // 设置别名 当访问'/signIn'时，显示'/'的页面
    component: SignIn,  // 同步加载组件，加载完成后进入首页
    name: 'signIn',
    meta: {
        keepAlive: false,
    },
  },
  {
      path: '/signUp',
      component: () => import('../views/SignUp.vue'),  //异步加载组件，进入组件时再加载提高进入首页时的加载速度
      name: 'signUp',
      meta: {
          keepAlive: false,
      },

  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

路由守卫，用户未登录时通过外部链接进入页面会跳转到首页

``` javascript
/*
* beforeEach:从一个页面跳转到另外一个页面时触发
* to:要跳转的页面
* from:从哪个页面出来
* next:决定是否通过
*/

router.beforeEach((to, from, next) => {
  if (cookie.getCookie("openId")) {
      next()
  } else {
      if (to.path == "/" || to.path == '/signUp') {
        next()
      } else {
        Toast({
            message: '暂未登录，请先登录',
          });
        let second = 1;
        // 延迟一秒执行
        const timer = setInterval(() => {
          second--;
          if (!second) {
              clearInterval(timer);
            // 手动清除 Toast
            Toast.clear();
          }
        }, 1000);
        next('/')
    }
  }
  if(to.path == '/myself'){
    document.documentElement.scrollTop = 0
  }
})
```


#### store/index.js

管理用户的各种状态


``` javascript
//创建一个 store
export default createStore({
   // 添加 state 状态
    state: {
      
    },

    // 更改 store 中的 state 状态
    mutations: {
       
    },
})
```

**state:**

在store中存储状态，在组件中通过 `this.$store.state.type` 调用

``` javascript
state: {
   flag:false,  // 判断是否引入mock
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

更改 store 中的状态,在组件中通过 `store.commit('FunctionName')`调用

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



#### APP.vue

定义了组件的缓存

从新闻列表跳到详情页，然后返回详情页的时列表不需要刷新，并且滚动条保持在之前的位置,使用keep-alive组件进行状态缓存

被keep-alive包裹住的组件在重新进入时不会刷新,通过设置router中的meta.keepAlive属性值选择需要被缓存的组件

``` html
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
```


#### signIn.vue/signUp.vue

登录注册时将信息存入store

``` javascript
store.state.type = 'signIn'
store.state.user.username = res.username
```

存入cookie值

``` javascript
// checke:true--选中记住我   checke:false--未选中记住我
if(data.checked){
   // 调用setCookie方法，同时传递需要存储的数据，保存天数
   data.cookie.setCookie(loginInfo, 7)
}else{
   data.cookie.setCookie(loginInfo, 1)
}
```

#### views/recLists.vue(hotLists.vue)


再次进入页面时定位在退出时的位置

``` javascript
// 当组件在 <keep-alive> 内被切换，activated 会被对应执行
// 每次进入该组件时会执行,设置滚动条的位置
onActivated(()=>{
  document.documentElement.scrollTop = data.scrollTop
})

//在离开该组件时执行，执行完后跳转
// to:要去到的组件  from:离开的组件(本组件)  next():执行的函数，下一步
onBeforeRouteLeave((to, from, next) => {
  // 如果下一个去到的组件是新闻详情页，触发store中的numChange函数，使阅读次数+1
    if(to.name == 'NewsInfo' ){
    store.commit('numChange', {item:'recList',path:to.path})
  }
  // 存储离开时的滚动条位置
  data.scrollTop = document.documentElement.scrollTop
  // next()必须要写，不写不会发生跳转
  next();
})
```


#### views/NewsInfo.vue

发送action请求

``` javascript
sendInfo() {
   // 阅读
   var val = {
      user_name: store.state.user.username,
      news_id: data.id,
      action_time: Date.now(),
      action_type: 'read',
   }

   // 喜欢
   var val = {
      user_name: store.state.user.username,
      news_id: data.id,
      action_time: Date.now(),
      action_type: `likes:${data.islike}`,
   }

   // 收藏
   var val = {
      user_name: store.state.user.username,
      news_id: data.id,
      action_time: Date.now(),
      action_type: `collections:${data.iscollection}`,
   }

   // 发送对应请求
   proxy.axios.post("/recsys/action", val).then(resource => {
      if (resource.status !== 200) {
        Toast('加载数据失败')
      }
   })
},
```

#### views/Myself.vue

退出登录时删除该用户相关信息

``` javascript
quit() {
   // 清空该用户的新闻列表
   store.commit('clearUser');

   /*删除cookie*/
   proxy.cookie.clearCookie('LoginName')
   proxy.cookie.clearCookie('openId')

   // 跳转到登录页
   router.push('/signIn')
}
```