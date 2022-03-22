import { createApp } from 'vue'
import App from './App.vue'
// 创建根实例
const app = createApp(App)

// 导入路由
import router from './router/index';
app.use(router);
// 导入状态管理
import store from "./store/index";
app.use(store);

// 导入axios,axios不是一个插件所以不能Vue.use使用，vue-axios是个插件。
import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios);
// axios公共基路径，以后所有的请求都会在前面加上这个路径
// axios.defaults.baseURL = "http://47.108.56.188:3000";
// 设置表单提交方式，默认是 json
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 数据模拟
// 如果服务器可以正常获取到数据则不引入mock
// 否则引入mock模拟数据
axios.post('http://47.108.56.188:3000/recsys/login?username=11&passwd=111111').then(() => {
    store.state.flag = true
}).catch((e)=>{
    store.state.flag = false
    console.log(e)
})
!store.state.flag && require("./mock/index.js")

app.config.globalProperties.axios = axios;

//将cookie绑定在vue的原型上，在各个组件通过 this.coookie调用
import cookie from './assets/js/cookie'
app.config.globalProperties.cookie = cookie;

// 导入vant
import Vant from "vant";
import "vant/lib/index.css";
import "amfe-flexible";
app.use(Vant);

// 挂载根实例
app.mount("#app");
