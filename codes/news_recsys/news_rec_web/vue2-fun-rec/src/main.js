import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 导入axios,axios不是一个插件所以不能Vue.use使用，vue-axios是个插件。
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

// axios公共基路径，以后所有的请求都会在前面加上这个路径
// axios.defaults.baseURL = "http://47.108.56.188:3000";
// 设置表单提交方式，默认是 json
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 数据模拟
// 如果服务器可以正常获取到数据则不引入mock
// 否则引入mock模拟数据
axios.post('http://47.108.56.188:3000/recsys/login?username=11&passwd=111111').then(() => {
    store.state.flag = true
}).catch(()=>{
    store.state.flag = false
})
!store.state.flag && require("./mock/index.js")

// 导入缩略图插件
import VuePreview from 'vue-preview'
Vue.use(VuePreview);

// 三方组件按需导入
import { Form } from 'vant';
import { Field } from 'vant';
import { RadioGroup, Radio } from 'vant';
import 'vant/lib/radio/style'
import 'vant/lib/radio-group/style'
import { Area } from 'vant';
import 'vant/lib/area/style'
import { Popup } from 'vant';
import 'vant/lib/popup/style'
Vue.use(Popup);
Vue.use(Area);
Vue.use(Form);
Vue.use(Field);
Vue.use(Radio);
Vue.use(RadioGroup);
import { Checkbox } from 'vant';
Vue.use(Checkbox);
import { List } from 'vant';
Vue.use(List);
import { Cell } from 'vant'
Vue.use(Cell)
import { PullRefresh } from 'vant'
import 'vant/lib/pull-refresh/style';
Vue.use(PullRefresh)
import { Tabbar, TabbarItem } from 'vant';
import 'vant/lib/tabbar/style'
import 'vant/lib/tabbar-item/style'
Vue.use(Tabbar);
Vue.use(TabbarItem);
import { NavBar } from 'vant';
import 'vant/lib/nav-bar/style'
Vue.use(NavBar);
import { Button } from 'vant';
import 'vant/lib/button/style'
Vue.use(Button);
import 'vant/lib/toast/style';

//将cookie绑定在vue的原型上，在各个组件通过 this.coookie调用
import cookie from './assets/js/cookie'
Vue.prototype.cookie = cookie

new Vue({
  el:'#app',
  router,
  store,
  render: (h) => h(App),
  created() {
    //store中的数据在刷新后会丢失，
    //在页面刷新时将store中的数据存入sessionStorage，刷新完成后再赋值给store

    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
        console.log('页面重新加载');
        let storet = sessionStorage.getItem("store");
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(storet == null ? '' : storet)))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
        console.log('页面被刷新');
        let state = JSON.stringify(this.$store.state)
        sessionStorage.setItem("store", state == null ? '' : state)
    })
}
});
