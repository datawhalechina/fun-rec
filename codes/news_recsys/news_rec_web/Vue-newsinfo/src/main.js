// 导入vue
import Vue from 'vue'

// 导入根组件
import App from './App.vue'

// 导入路由
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//导入store状态管理
import store from './store';

// 导入axios,axios不是一个插件所以不能Vue.use使用，vue-axios是个插件。
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);
// axios公共基路径，以后所有的请求都会在前面加上这个路径
axios.defaults.baseURL = "http://47.108.56.188:3000";
// 设置表单提交方式，默认是 json
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 导入缩略图插件
import VuePreview from 'vue-preview'
Vue.use(VuePreview);

// 导入Vue的组件
import routerObj from './router.js'

// 全局组件
// 时间过滤组件
import moment from 'moment'  // node的一个时间格式化插件
// 定义全局时间过滤的组件
Vue.filter('timeFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
    return moment(dataStr).format(pattern)
});


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
import 'vant/lib/toast/style'


Vue.config.devtools = false; //生产环境中需要设置为false
Vue.config.productionTip = false; //阻止vue启动时生成生产消息

import cookie from './assets/js/cookie'
Vue.prototype.cookie = cookie

// 创建vue对象
let vm = new Vue({
    el: '#app',
    data() {
        return {}
    },
    methods: {},
    render: c => c(App),
    router: routerObj,
    store,
    created() {
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


