## 1.Web 前端

 Web 前端网页主要由文字、图像和超链接等元素构成。当然，除了这些元素，网页中还可以包含音频、视频以及 Flash 等。

### 1.1 什么是 Web

 Web（World Wide Web）即全球广域网，也称为万维网，它是一种基于超文本和 HTTP 的、全球性的、动态交互的、跨平台的分布式图形信息系统。是建立在 Internet 上的一种网络服务，为浏览者在 Internet 上查找和浏览信息提供了图形化的、易于访问的直观界面，其中的文档及超级链接将 Internet 上的信息节点组织成一个互为关联的网状结构。

 Web 前端主要是通 `HTML`,`CSS`,`JS`,`ajax`,`DOM` 等前端技术,实现网站在客服端的正确显示及交互功能。

### 1.2 Web 标准构成

主要包括结构（Structure）、表现（Presentation）和行为（Behavior）三个方面。

- **结构标准**：结构用于对网页元素进行整理和分类，对于网页来说最重要的一部分 。通过对语义的分析，可以对其划分结构。具有了结构的内容，将更容易阅读
- **表现标准**：表现用于设置网页元素的版式、颜色、大小等外观样式，主要指的是 CSS 。为了让网页能展现出灵活多样的显示效果

- **行为标准**：行为是指网页模型的定义及交互的编写 。使用户对网页进行操作，网页可以做出响应性的变化

总的来说，

- Web 标准有三层结构，分别是结构（`HTML`）、表现（`CSS`）和行为（`JS`）
- 结构类似人的身体， 表现类似人的着装， 行为类似人的行为动作

- 理想状态下，他们三层都是独立的， 放到不同的文件里面

### 1.2.1 HTML

- `HTML` 指的是超文本标记语言 (**H**yper **T**ext **M**arkup **L**anguage)是用来描述网页的一种语言。
- `HTML` 不是一种编程语言，而是一种标记语言 (markup language)
- 标记语言是一套标记标签 (markup tag)

##### 1.2.1.1 超文本的含义

- **超越文本限制**：可以加入图片、声音、动画、多媒体等内容
- **超级链接文本**：可以从一个文件跳转到另一个文件，与世界各地主机的文件连接

##### 1.2.1.2 语法骨架格式

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>我的第一个页面</title>
    </head>
    <body>
        <h1>一个一级标题</h1>
		<p>一个段落。</p>
    </body>
</html>
```

- `<!DOCTYPE html>` 声明为 HTML5 文档
- `<html>` 元素是 HTML 页面的根元素
- `<head>` 元素包含了文档的元（meta）数据
  - `<meta charset="utf-8">` 定义网页编码格式
  - `<title>` 元素描述了文档的标题
- `<body>` 元素包含了可见的页面内容

  - `<h1>` 元素定义一个标题
  - `<p>` 元素定义一个段落

![html](https://files.mdnice.com/user/28784/2c141964-f366-494d-a7cc-c2abcd21161b.png)

#### 1.2.2 CSS

- `CSS`(**C**ascading **S**tyle **S**heets) ，通常称为 `CSS` 样式表或层叠样式表（级联样式表）
- `CSS` 主要用于设置 `HTML` 页面中的文本内容（字体、大小、对齐方式等）、图片的外形（宽高、边框样式、边距等）以及版面的布局和外观显示样式。
- `CSS` 以 `HTML` 为基础，提供了丰富的功能，如字体、颜色、背景的控制及整体排版等，而且还可以针对不同的浏览器设置不同的样式。

##### 1.2.2.1 CSS 规则

![CSS](https://files.mdnice.com/user/28784/87d28c2f-e9f9-47bd-a3e5-2659f2008b2c.png)

- **选择器**：需要改变样式的 HTML 元素

- **声明**：由一个属性和一个值组成。声明之间用分号结束

  - 属性：希望设置的样式属性。每个属性有一个值。属性和值用冒号分开

##### 1.2.2.2 语法格式

```html
<标签名 style="属性1:属性值1; 属性2:属性值2; 属性3:属性值3;"> 内容 </标签名>
```

例如：

```css
<style>
   /*选择器{属性:值；}*/
   p {
   	  color:#06C;
   	  font-size:14px;
   	}
   /*文字的颜色是 蓝色*/
   h4 {
   	 color:#900;
   }
   h1 {
   	 color:#090;
   	 font-size:16px;
   	}
   body {
   	 background:url(bg2.jpg);
   }
</style>
```

#### 1.2.3 JS

- `JS` (**J**ava**S**cript)是 Web 的编程语言，是一种基于对象和事件驱动并具有相对安全性的客户端脚本语言。同时也是一种广泛用于客户端 Web 开发的脚本语言，常常用来给 `HTML` 网页添加动态效果，从而实现人机交互的网页
- 脚本语言不需要编译，在运行过程中由 `js` 解释器逐行来进行解释并执行

##### 1.2.3.1 JS 的组成

![JS](https://files.mdnice.com/user/28784/259c84c2-7570-4ab0-b192-eefe14463a47.png)

- **ECMAScript**： 是由 ECMA 国际（ 原欧洲计算机制造商协会）进行标准化的一门编程语言，这种语言在万维网上应用广泛，它往往被称为 JavaScript 或 JScript，但实际上后两者是 ECMAScript 语言的实现和扩展
- **DOM**：文档对象模型（DocumentObject Model，简称 DOM），是 W3C 组织推荐的处理可扩展标记语言的标准编程接口。通过 DOM 提供的接口可以对页面上的各种元素进行操作（大小、位置、颜色等）
- **BOM**：浏览器对象模型(Browser Object Model，简称 BOM) 是指浏览器对象模型，它提供了独立于内容的、可以与浏览器窗口进行互动的对象结构。通过 BOM 可以操作浏览器窗口，比如弹出框、控制浏览器跳转、获取分辨率等

##### 1.2.3.2 书写位置

**1.行内式**

```html
<input type="button" value="点我试试" onclick="alert('Hello World')" />
```

- 可以将单行或少量 `JS` 代码写在 `HTML` 标签的事件属性中（以 `on` 开头的属性），如：`onclick`
- 可读性差， 在 `HTML` 中编写 `JS` 大量代码时，不方便阅读
- 引号易错，引号多层嵌套匹配时，非常容易弄混

**2.内嵌式**

```html
<script>
    alert('Hello  World~!');
</script>
```

- 可以将多行`JS`代码写到 `script` 标签中

**3.外部 JS 文件**

```html
<script src="myScript.js"></script>
```

```javascript
//myScript.js文件内容
function myFunction()
{
    document.getElementById("demo").innerHTML="我的第一个 JavaScript 函数";
}
```

- 利于`HTML`页面代码结构化，把大段 `JS`代码独立到 `HTML` 页面之外，既美观，也方便文件级别的复用
- 引用外部 `JS`文件的 `script` 标签中间不可以写代码
- 适合于`JS` 代码量比较大的情况

---

## 2. Vue 简介

 `Vue` 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，`Vue` 被设计为可以自底向上逐层应用。`Vue` 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，`Vue` 也完全能够为复杂的单页应用提供驱动。

### 2.1 安装

#### 2.1.1 通过< script>标签引入

直接下载并用 `<script>` 标签引入，`Vue` 会被注册为一个全局变量。

- **开发版本**：https://cn.vuejs.org/js/vue.js

- **生产版本**：https://cn.vuejs.org/js/vue.min.js

#### 2.1.2 通过 CDN 安装

- **制作原型或学习**：

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
```

- **用于生产环境**：

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
```

- **使用原生 ES Modules**：

```html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
</script>
```

#### 2.1.3 通过 npm 安装

 在用 `Vue` 构建大型应用时推荐使用 `npm` 安装。`npm` 能很好地和诸如 `webpack`模块打包器配合使用。同时 `Vue` 也提供配套工具来开发单文件组件。

1.npm 版本需要大于 3.0，如果低于此版本需要升级它：

```shell
# 查看版本
npm -v

#升级 npm
npm install npm -g
```

2.安装 Vue

```shell
# 使用npm安装
npm install vue
```

### 2.2 创建一个 Vue 实例

每个 `Vue` 应用都需要通过实例化 `Vue` 来实现。

#### 2.2.1 语法格式

```javascript
var vm = new Vue({
  // 选项
})
```

例如：

```html
<div id="example">
    <h1>title : {{title}}</h1>
    <h1>url : {{url}}</h1>
</div>
<script>
    var vm = new Vue({
        el: '#example',
        data: {
            title: "一个Vue实例",
            url: "https://cn.vuejs.org/",
        },
        methods: {
            details: function() {
                return  this.title + " ------";
            }
        }
    })
</script>
```

在 `Vue` 构造器中有一个`el` 参数，它是 `DOM` 元素中的 `id`。在上面实例中 `id` 为 `example`，这表示接下来的改动全部在以上指定的 `div` 内，`div` 外部不受影响。

#### 2.2.2 定义数据对象

在上述`Vue`实例中：

- `data` ：定义属性，实例中有 2 个属性分别为：`title`、`url`。

- `methods` ：定义的函数，可以通过 `return` 来返回函数值。

- `{{ }}` ：输出对象属性和函数返回值。

 当一个 `Vue` 实例被创建时，它向 `Vue` 的响应式系统中加入了其 `data` 对象中能找到的所有的属性。当这些属性的值发生改变时，`html` 视图将也会产生相应的变化。

### 2.3 Vue 的生命周期

 每个 `Vue` 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 `DOM` 并在数据变化时更新 `DOM` 等。同时在这个过程中也会运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会。

 下图是一个 `Vue` 实例的生命周期：
![Vue生命周期](https://files.mdnice.com/user/28784/96265b5a-a5f0-4b13-83ad-742d9167f4cd.png)

#### 2.3.1 beforeCreate

 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用。

 此时组件的选项对象还未创建，`el` 和 `data` 并未初始化，因此无法访问`methods`， `data`， `computed`等上的方法和数据。

#### 2.3.2 created

 在实例创建完成后被立即调用。

 实例已完成对选项的处理，以下内容已被配置完毕：数据侦听、计算属性、方法、事件/侦听器的回调函数。然而，挂载阶段还没开始，且 `$el` 目前尚不可用。

 在这一步中可以调用`methods`中的方法，改变`data`中的数据，并且修改可以通过 `Vue` 的响应式绑定体现在页面上，获取`computed`中的计算属性等等，通常我们可以在这里对实例进行预处理。但需要注意的是，这个周期中是没有什么方法来对实例化过程进行拦截的，因此假如有某些数据必须获取才允许进入页面的话，并不适合在这个方法发请求，建议在组件路由钩子`beforeRouteEnter`中完成。

#### 2.3.3 beforeMount

 在挂载开始之前被调用：相关的 `render` 函数首次被调用（虚拟 `DOM`）。

 实例已完成以下的配置： 编译模板，把`data`里面的数据和模板生成`HTML`，完成了`el`和`data` 初始化，但此时还没有挂在`HTML`到页面上。

#### 2.3.4 mounted

 实例被挂载后调用，这时 `el` 被新创建的 `vm.$el` 替换了。

 模板中的`HTML`渲染到`HTML`页面中，此时一般可以做一些`ajax`操作，`mounted`只会执行一次。

 但`mounted` 不会保证所有的子组件也都被挂载完成。如果希望等到整个视图都渲染完毕再执行某些操作，可以在 `mounted` 内部使用 `vm.$nextTick`：

```javascript
mounted: function () {
  this.$nextTick(function () {
    // 仅在整个视图都被渲染之后才会运行的代码
  })
}
//生命周期钩子的 this 上下文指向调用它的 Vue 实例。
```

#### 2.3.5 beforeUpdate

 在数据发生改变后，`DOM` 被更新之前被调用。

 适合在现有 `DOM` 将要被更新之前访问它，比如移除手动添加的事件监听器。可以在该钩子中进一步地更改状态，不会触发附加地重渲染过程.

#### 2.3.6 updated

 在数据更改导致的虚拟 `DOM` 重新渲染和更新完毕之后被调用。

 当这个钩子被调用时，组件 `DOM` 已经更新，所以可以执行依赖于`DOM`的操作，然后在大多是情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。

 但`updated` 不会保证所有的子组件也都被重新渲染完毕。如果希望等到整个视图都渲染完毕，可以在 `updated` 里使用 `vm.$nextTick`：

```javascript
updated: function () {
  this.$nextTick(function () {
    //  仅在整个视图都被重新渲染之后才会运行的代码
  })
}
```

#### 2.3.7 beforeDestroy

 实例销毁之前调用。在这一步，实例仍然完全可用。

 这一步还可以用`this`来获取实例，一般用来做一些重置的操作，比如清除掉组件中的定时器和监听的`DOM`事件。

#### 2.3.8 destroyed

 实例销毁后调用。该钩子被调用后，对应 `Vue` 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。

## 3 创建 Vue 项目

 `Vue CLI` 是一个基于 `Vue.js` 进行快速开发的完整系统，提供：

- 通过 `@vue/cli` 实现的交互式的项目脚手架
- 通过 `@vue/cli` + `@vue/cli-service-global` 实现的零配置原型开发
- 一个运行时依赖 (`@vue/cli-service`)，该依赖
  - 可升级
  - 基于 `webpack` 构建，并带有合理的默认配置
  - 可以通过项目内的配置文件进行配置
  - 可以通过插件进行扩展
- 一个丰富的官方插件集合，集成了前端生态中最好的工具
- 一套完全图形化的创建和管理 `Vue.js` 项目的用户界面

 `Vue CLI` 致力于将 `Vue` 生态中的工具基础标准化。它确保了各种构建工具能够基于智能的默认配置即可平稳衔接。与此同时，它也为每个工具提供了调整配置的灵活性

### 3.1 安装 vue CLI

 Vue CLI 的包名称由 `vue-cli` 改成了 `@vue/cli`。 如果已经全局安装了旧版本的 `vue-cli` (1.x 或 2.x)，需要先通过 `npm uninstall vue-cli -g`卸载它。

1.安装新的包

```shell
npm install -g @vue/cli
```

2.检查其版本是否正确

```shell
vue --version
```

3.升级包

```shell
npm update -g @vue/cli
```

### 3.2 创建 Vue 项目

#### 3.2.1 通过 vue create 创建

```shell
vue create hello-world
```

- **默认配置**：包含了基本的 Babel + ESLint 设置。适合快速创建一个新项目的原型。

![cli-new-project](https://files.mdnice.com/user/28784/e7fe4d8a-f923-4ed8-a638-740546a155af.png)

- **手动选择特性**：选取需要的特性。适合面向生产的项目。

![cli-select-features](https://files.mdnice.com/user/28784/1ff16084-17d5-4d10-9084-cf99d9aa2fe2.png)

```shell
# 进入项目具体路径
cd hello-world

# 下载依赖
npm install

# 启动运行项目
npm run serve

# 项目打包
npm run build
```

#### 3.2.2 使用图形化界面创建

```shell
vue ui
```

 打开一个浏览器窗口，并以图形化界面将你引导至项目创建的流程。
![ui-new-project](https://files.mdnice.com/user/28784/d6ad9e95-fb2a-4999-ba07-bb2d04ce17e9.png)

#### 3.2.3 使用 2.x 模板 (旧版本)创建

```shell
# 全局安装一个桥接工具
npm install -g @vue/cli-init

# `vue init` 的运行效果将会跟 `vue-cli@2.x` 相同
vue init webpack vue_map_test
```

![init-vue](https://files.mdnice.com/user/28784/8534940b-6667-4c12-b6c1-689399b47c15.png)

```shell
# 进入项目具体路径
cd vue_map_test

# 下载依赖
npm install

# 启动运行项目，默认为8080端口
npm run dev

# 项目打包
npm run build
```

### 3.3 Vue 项目目录

```
├── v-proj
|	├── node_modules  	// 当前项目所有依赖，一般不可以移植给其他电脑环境
|	├── public
|	|	├── favicon.ico	// 标签图标
|	|	└── index.html	// 当前项目唯一的页面
|	├── src
|	|	├── assets		// 静态资源img、css、js
|	|	├── components	// 小组件
|	|	├── App.vue		// 根组件
|	|	├── main.js		// 全局脚本文件（项目的入口）
|	|	└── router.js   // 路由脚本文件
|	├── README.md
└	└── package.json  //配置文件,使用npm install安装
```

#### 3.3.1 public

 可以理解为入口目录。

##### **favicon.ico**

 用于作为缩略的网站标志，它显示位于浏览器的地址栏或者在标签上，用于显示网站的 logo。

##### **index.html**

 首页入口文件，可以添加一些 `meta` 信息或统计代码。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Title</title>
</head>
<body style="background-color: #fff;">
    <div id="app" >

    </div>
</body>
</html>
```

#### 3.3.2 src

 是整个项目的主文件夹 ，代码大部分都在这里完成。

##### **assets**

 放置一些资源文件。比如`js` 、`css`、`image`等。

![assets](https://files.mdnice.com/user/28784/211ea341-58ef-4bc4-a9e0-baf390ec791a.png)

##### **components**

 放置组件文件。一个`Vue`项目就是由一个个的组件拼装起来的。

例如：

```html
<template>
    <div class="test">

    </div>
</template>

<script>
    export default {
        name: "Test"
    }
</script>

<style scoped>

</style>
```

- `<template>` 有且只有一个根标签（Vue2）
- `<script>` 必须将组件对象导出
- `<style>` 标签明确 scoped 属性，代表该样式只在组件内部起作用(样式的组件化)

##### **App.vue**

 是整个项目的入口文件，相当于包裹整个页面的最外层的`div`。

```html
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
  components:{

  },
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

</style>
```

##### **main.js**

 是项目的主`JS`，全局的使用的各种变量、插件 都在这里引入定义。

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
```

##### **router.js**

 路由脚本文件（配置路由 url 链接 与 页面组件的映射关系）

```javascript
// 导入VueRoute路由组件
import VueRouter from 'vue-router'


// 导入各个组件
import homePage from "./components/homePage.vue";
import test from "./components/test.vue";

// 创建路由对象
let routerObj = new VueRouter({
    routes: [
        {path: '/', component: homePage},
        {path: '/test', component: test},
    ],
});

// 把routerObj对象暴漏出去。main.js导入这个数据
export default routerObj
```

#### 3.3.3 README.md

 项目的说明文档，markdown 格式

```markdown
## 项目依赖下载

npm install

## 项目启动

npm run serve

## 项目打包

npm run build
```

#### 3.3.4 package.json

 是整个项目用的到的所有的插件的 json 的格式，比如插件的名称、版本号。 当在项目里使用 npm install 时 node 会自动安装文件里的所有插件。

```javascript
{
  "name": "test",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/compiler-sfc": "^3.0.0",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^7.0.0"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "babel-eslint"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

---

## 4.基于 Vue 的移动端 H5 项目

### 4.1 什么是 H5

 `HTML5` 是第五代 `HTML` 的标准，可以说，`H5` 是基于 `HTML5` 实现的，是当前互联网前端开发的主流语言。`H5` 页面与普通 `web` 页面相比，最大的区别在于 `HTML5` 页面可以与不同大小的移动设备相匹配，支持市场上不同浏览器的兼容。移动网络和移动设备的快速发展，使得 `H5` 在移动设备上能够被更好的应用。

`H5` 页面有以下特点：

- **具有移动端自适应能力**，`H5` 页面会根据不同的手机屏幕尺寸进行适配，以达到不同屏幕的最佳显示效果
- **支持多媒体功能**，支持背景音乐，视频播放等多种多媒体功能
- **页面素材预加载**，为了保证整个页面的播放流畅，`H5` 页面都搭配预加载功能，即用户点击之前就完成了页面的加载，保证阅读流畅性
- **支持滑动翻页**，每个页面内容单独成页
- **使用滚动侦测特效，**即滑动页面的同时，大量文字或图片会自动加载出来，造成一种动态美感


### 4.2 使用 Vue 开发 H5 页面

#### 4.2.1 创建 Vue 项目

```shell
# vue create创建项目
vue create test

# 进入项目具体路径
cd test

# 下载依赖
npm install

# 启动运行项目
npm run serve
```

![vue-h5](https://files.mdnice.com/user/28784/d707e635-31da-4dec-ae68-2aab7f44f84d.png)

#### 4.2.2 自适应布局

 移动端的布局相对 PC 较为简单，关键在于对不同设备的适配。

1.根据屏幕大小 / 750 = 所求字体 / 基准字体大小比值相等，动态调节`html`的`font-size`大小。

2.根据设备设备像素比设置`scale`的值，保持视口`device-width`始终等于设备物理像素，接着根据屏幕大小动态计算根字体大小，具体是将屏幕划分为 10 等分，每份为 a，1rem 就等于 10a。

这里主要用到两种单位:

- **vw**: viewport width，相对于视口的宽度，1vw 为视口宽度的 1%，100vw 为设备的宽度

- **rem**: 相对于根元素 html 的字体大小的单位，比如 2rem=2 倍的根字体大小
。rem 的基本原理是根据屏幕不同的分辨率,动态修改根字体的大小,让所有的用 rem 单位的元素跟着屏幕尺寸一起缩放,从而达到自适应的效果。

#### 4.2.3 路由配置

##### 下载 vue-router

```shell
npm install vue-router
```

##### 配置 router.js

```javascript
//新建router.js文件

import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "@/components/HelloWorld"

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            component: HelloWorld
        },
    ]
})
```

```javascript
//main.js中引入router

import Vue from 'vue'
import App from './App.vue'
import router from '../router'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
```

#### 4.2.4 数据请求

##### 安装 axios

```shell
npm install axios
```

##### 引入 axios

 在`msin.js`中引用

```javascript
// 导入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

// axios公共基路径，以后所有的请求都会在前面加上这个路径
// axios.defaults.baseURL = "http://**********"

```

##### 使用 axios

 修改`HelloWorld.vue`文件

```html
<template>
    <div  @click="login">index page</div>
</template>
<script>
    export default {
        methods: {
           anysc login() {
              let url = '/login';
              let data = {username: 'user', passwd: '123'};
              let successData = await this.axios.post(url, data).then(res => {
                  return res
              })
              console.log(successData)
           }
    }
</script>
```

#### 4.2.5 UI 组件库

 UI 设计组件（UI KIT），直译过来就是用户界面成套元件，是界面设计常用控件或元件，「组」是设计元素的组合方式，「件」由不同的元件组成。

组件有如下优势：

- **保证一致性**

 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。

- **反馈用户**

 控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。

- **提高效率，减少成本**

 简化流程：设计简洁直观的操作流程；清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。

##### Vant

 **下载地址**：https://youzan.github.io/vant

 是有赞前端团队基于有赞统一的规范实现的 Vue 组件库，提供了一整套 UI 基础组件和业务组件。

- 60+ 高质量组件
- 90% 单元测试覆盖率
- 完善的中英文文档和示例
- 支持按需引入
- 支持主题定制
- 支持国际化
- 支持 TS
- 支持 SSR

![vantui](https://files.mdnice.com/user/28784/1295d906-9ff6-4ac9-adf4-cad474fa42ec.png)  

&emsp;

---
### **参考资料：**

https://www.runoob.com/html/html-tutorial.html

https://www.w3school.com.cn/html/index.asp

https://www.runoob.com/css/css-tutorial.html

https://www.w3school.com.cn/css/index.asp

https://www.runoob.com/js/js-tutorial.html

https://vuejs.org/guide/introduction.html
