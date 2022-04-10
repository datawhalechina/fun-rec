**演示链接：**
http://theneverlemon.gitee.io/react-fun-rec

- 测试用户名: `user`   测试密码: `pass` (mock数据模拟，远程服务器获取不到数据时使用，没有推荐功能)

---


# 新闻推荐系统

  + 基于react的框架antd-mobile UI的基本使用。

  + TypeScript的使用。

  + 基于nodejs的npm包管理工具。

  + react路由的相关知识，路由的配置和渲染以及路由守卫的使用。

  + axios的使用,项目里调用接口都是用的这个异步ajax插件。

  + 全局组件的使用。

---


### 运行

1. 跳转到前端项目文件目录：`cd react-fun-rec`

2. 本地安装node环境，在项目根目录命令行输入命令`npm install`安装依赖包
   
   如果因为版本或者网络问题下载失败请执行`npm install -g cnpm -registry=https://registry.npm.taobao.org/
`和`cnpm install`

1. 启动前端服务：`npm start`

2. 本机访问地址`http://localhost:3000/#/` 

3. 点击`F12`或者右键选择`检查`打开`开发者模式`,选中移动端浏览（点击左上角箭头右边的手机按钮）开始体验

---



### 目标功能
- [X] **用户登录** —— 老用户登录
  
- `记住我`可以保存将登录信息保存7天


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

- 推荐页和热门页之间的切换

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
├─package.json  项目配置文件
├─README.md  项目介绍
├─tsconfig.json  ts配置文件
├─src
|  ├─App.css  根组件样式
|  ├─App.tsx  根组件
|  ├─index.css  入口文件样式
|  ├─index.tsx  入口文件
|  ├─routes
|  |   └index.tsx  配置路由控制页面跳转
|  ├─redux  状态管理
|  |   ├─actions.ts  定义更改状态时action的接收和返回值
|  |   ├─reducers.ts  汇总所有reducers
|  |   ├─store.ts  状态管理入口
|  |   ├─types
|  |   |   ├─constant.ts  定义常量
|  |   |   └─hooks.ts  重新定义useSelector
|  |   ├─reducers  根据action对状态进行更改
|  |   |    ├─numChange.ts  阅读/喜欢/收藏次数的改变
|  |   |    ├─pushLists.ts  列表添加数据
|  |   |    └─userLog.ts  用户登录/注册/退出
|  ├─pages
|  |   ├─SignUp  用户注册
|  |   |   ├─index.scss
|  |   |   └index.tsx
|  |   ├─SignIn  用户登录
|  |   |   ├─index.scss
|  |   |   └index.tsx
|  |   ├─RecLists  推荐页
|  |   |    └index.tsx
|  |   ├─NewsInfo  新闻详情页
|  |   |    ├─index.scss
|  |   |    └index.tsx
|  |   ├─MySelf  个人中心
|  |   |   ├─index.scss
|  |   |   └index.tsx
|  |   ├─HotLists  热门页
|  |   |    └index.tsx
|  |   ├─404  404页
|  |   |  └index.tsx
|  ├─mock
|  |  └index.ts  数据模拟
|  ├─components
|  |     ├─BottomBar  底部导航
|  |     |     ├─index.scss
|  |     |     └index.tsx
|  ├─assets
|  |   ├─type  
|  |   |  └─index.ts  定义所有数据的类型
|  |   ├─js
|  |   | ├─cookie.js  定义cookie的相关操作
|  |   | ├─encrypt.js  密码加密
|  |   ├─images
│  │   │    ├─ collects.png  未选中收藏
│  │   │    ├─ collects1.png  选中收藏
│  │   │    ├─ datawhale.png  DataWhale头像
│  │   │    ├─ dw.png  DataWhale二维码
│  │   │    ├─ favicon.ico  浏览器小图标
│  │   │    ├─ likes.png  未选中喜欢
│  │   │    └─ likes1.png  选中喜欢
|  |   ├─data
|  |   |  ├─city.ts  城市选择数据
|  |   ├─css
|  |   |  └─topBar.scss  顶部导航样式
└─public
    ├─favicon.ico  浏览器小图标
    └─index.html  首页入口文件

```

---

### 数据获取

通过`mockjs`进行数据的模拟

定义获取数据的url和出现错误时的状态码

```  typescript
import { NewsInfo } from '../assets/type'
import store from '../redux/store'

let Mock = require('mockjs')

// 登录
Mock.mock('/login', 'post', (req: { body: string }) => {
  const { username, passwd } = JSON.parse(req.body)
  // 用户名默认为user 密码默认为pass 
  // 密码由前端加密后转换为h
  if (username === 'user' && passwd === 'h') {
    return {
      code:200
    }
  } else if(username !== 'user'){
    return {
      code:502
    }
  }else if(passwd !== 'h'){
    return {
      code:501
    }
  } else {
    return {
      code:500
    }
  }
})

export { }
```
在登录时使用

```typescript
let successData = await axios.post("/login", res).then((res) => {
  return res.data
})

if (successData.code === 200) {
  Toast.show({
    icon: 'success',
    content: '登录成功',
  })
} else if (successData.code === 500) {
  Toast.show({
    icon: 'fail',
    content: '登陆失败',
  })
} else if (successData.code === 501) {
  Toast.show({
    icon: 'fail',
    content: '密码输入错误',
  })
} else if (successData.code === 502) {
  Toast.show({
    icon: 'fail',
    content: '用户名不存在',
  })
}
```
### 路由守卫

用户为登录时通过外链访问推荐/热门/详情页会跳转至首页进行登录

#### App.tsx

在 `App` 组件中注册路由

在这里区分`auth`，通过`router.map`遍历所有路由


当`auth`值为`false`时，也就是(`!item.auth`)，即不需要身份就可以进入的页面（登录和注册页），那么就渲染当前组件`< item.component />`

```typescript
if (!item.auth) {
 return (
   <Route key={i} path={item.path} element={
     <Suspense fallback={
       <>
         <Skeleton.Title animated />
         <Skeleton.Paragraph lineCount={20} animated />
       </>
     }>
       < item.component />
     </Suspense>
   } />
 )
```
当`auth`值为`true`时，也就是(`item.auth`)，即需要身份才可以进入的页面（内容页），那么就通过`RequireAuth`函数判断是否有身份权限，如果有，渲染当前组件；如果没有，定位到登录

RequireAuth函数

通过是否有cookie判断，在登录或者注册时候会存储一个cookie，退出登录时再删掉

```typescript
function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation()
  if (!getCookie('openId')) {

    Toast.show({
      content: '暂未登录，请先登录',
    })

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

    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  return children;
}

```
渲染的代码

```typescript
else {
  return (
    <Route key={i} path={item.path} element={
      <Suspense fallback={
        <>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={20} animated />
        </>
      }>
        <RequireAuth>
          <item.component />
        </RequireAuth>
      </Suspense>
    }>
    </Route>
  )
}
```

### 状态管理

![redux](https://raw.githubusercontent.com/kenken-xr/image/main/fun-rec-imgredux.png)

- action:动作的对象，包含2个属性
  - type：标识属性, 值为字符串, 唯一, 必要属性
  - data：数据属性, 值类型任意, 可选属性

- reducer：用于初始化状态、加工状态
- store：将state、action、reducer联系在一起的对象


#### redux/actions.ts

引入常量变量

``` typescript
import { COLLECT_DECREASE,COLLECT_INCREASE, CLEAR_INFO } from './types/constant'
```

用户登录（注册）时的action

- type：`signIn` / `signUp` / `CLEAR_INFO`
- data：登录或者注册时提交的表单数据，退出时清空数据

返回对应的type和data

``` typescript
export const userLog = (type: string, data: object) => ({ type, data })
```

#### redux/reducers/userLog.ts

引入常量和类型约束

``` typescript
import { userLogState } from '../../assets/type'
import { CLEAR_INFO, SIGNIN, SIGNUP } from '../types/constant'
```

定义初始状态

``` typescript
const userLogDefault: userLogState = {
  type: SIGNIN,
  data: {
    username: '',
    passwd: '',
  }
}
```

通过用户的action定义对应的reducer

通过action.type判断不同的登录状态

``` typescript
export function userLog(preState = userLogDefault, action: userLogState) {
  switch(action.type) {
    case SIGNIN:
      return ({ type: action.type, data: action.data })
    case SIGNUP:
      return ({ type: action.type, data: action.data })
    case CLEAR_INFO:
      return ({ type: action.type, data: action.data })
    default: 
      return preState
  } 
}
```

#### redux/redecers.ts

汇总所有的reducer变为一个总的reducer

``` typescript
//引入combineReducers，用于汇总多个reducer
import { combineReducers } from 'redux'

import {userLog} from './reducers/userLog'
import { pushRecLists, pushHotLists } from './reducers/pushLists'
import { readChange, likesChange, collectionsChange } from './reducers/numChange'

export default combineReducers({
  userLog,
  pushRecLists, pushHotLists,
  readChange, likesChange, collectionsChange
})
```


#### redux/store.ts

创建redux的store对象，只有一个store对象

引入
- createStore：创建store对象
- applyMiddleware：中间件，对redux的扩展
- redux-thunk：支持异步action
- rootReducer：汇总之后的所有reducer
- redux-persist：使用sessionstorage持久化数据，解决页面刷新数据丢失的问题
- redux-devtools-extension：在浏览器中可以使用redux扩展插件

``` typescript
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import  rootReducer  from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

const storageConfig = {
  key: 'root', // 必须
  storage: storageSession, // 缓存机制
}

const myPersistReducer = persistReducer(storageConfig, rootReducer);
const store = createStore(myPersistReducer, composeWithDevTools(applyMiddleware(thunk)));

export const persistor = persistStore(store)
export default store;
```

#### 使用

##### 登录
``` typescript
let res = { 
  username: values.name, 
  passwd: encrypt.Decrypt(values.passwd) 
};

const dispatch = useDispatch();
dispatch(userLog(SIGNIN, res))
```

##### 注册
``` typescript
const dispatch = useDispatch();
dispatch(userLog(SIGNUP, values))
```

##### 退出
``` typescript
const dispatch = useDispatch();
dispatch(userLog(CLEAR_INFO, []))
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

#### router/index.tsx

定义路由相关配置，控制页面跳转

``` typescript
// 路由懒加载
import { lazy } from 'react'
// 引入路由的类型
import { Router } from '../assets/type'
 
const router: Array<Router> = [
  {
    path: '/signIn',  // 路径
    auth: false,  // 是否需要身份验证
    component: lazy(() => import('../pages/SignIn'))  // 组件
  },
  {
    path: '/recLists',
    auth: true,  // 登录后才可以访问
    component: lazy(() => import('../pages/RecLists'))
  }
]
 
 export default router
```


#### SignIn.tsx/SignUp.tsx

存入cookie值

``` typescript
let loginInfo = {
  LoginName: res.username,
  openId: "asfafsfsfsdfsdfsdfdsf"
}

// checke:true--选中记住我   checke:false--未选中记住我
if (values.remember) {
  // 调用setCookie方法，同时传递需要存储的数据，保存天数
  setCookie(loginInfo, 7)
} else {
  setCookie(loginInfo, 1)
}
```


#### NewsInfo.tsx

发送action请求

``` javascript
sendInfo() {
   // 阅读
   let val = {
    user_name: user_name,
    news_id: id,
    action_time: Date.now(),
    action_type: 'read',
  }

   // 喜欢
  let val = {
    user_name: user_name,
    news_id: id,
    action_time: Date.now(),
    action_type: `likes:${isLike}`,
  }


  // 收藏
  let val = {
    user_name: user_name,
    news_id: id,
    action_time: Date.now(),
    action_type: `collections::${isCollection}`,
  }


   // 发送对应请求
   let successData = await axios.post("/action", val).then(res => {
      return res
    })

    if (successData.status === 200) {
      setIsCollection(!isCollection)
      // 调用store中的actionChange函数控制次数的变化
      if (isCollection === true) {
        dispatch(collectionsDecrease({ lists, id }))
      } else {
        dispatch(collectionsIncrease({ lists, id }))
      }
    } else {
      Toast.show({
        content: '加载数据失败',
      })
    }
},
```