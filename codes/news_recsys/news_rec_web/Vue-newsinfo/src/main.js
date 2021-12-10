// 导入vue
import Vue from 'vue'
// 导入根组件
import App from './App.vue'

// 导入路由
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import store from './store';

// 导入axios,axios不是一个插件所以不能Vue.use使用，vue-axios是个插件。
import axios from 'axios'
import VueAxios from 'vue-axios'


// Vue.prototype.$http = axios
Vue.use(VueAxios, axios);
// axios公共基路径，以后所有的请求都会在前面加上这个路径
// axios.defaults.baseURL = "http://10.170.4.60:3000";
axios.defaults.baseURL = "http://47.108.56.188:3000";

// 设置表单提交方式，默认是 json
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// 请求超时时间
// axios.defaults.timeout=5000;

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


// 三方组件
// 导入mint-ui组件,不建议全部导入体积太大
// 按需导入：先安装babel-plugin-component,然后在.babelrc加上官网说的配置加载css,如下
import Mint from 'mint-ui';


import CityPicker from 'vue-addr-picker';
Vue.use(CityPicker)

Vue.use(Mint);
import 'mint-ui/lib/style.css'


// 导入mui的css样式
import './lib/mui/css/mui.css'
import './lib/mui/css/icons-extra.css'

// import { Field } from 'mint-ui';

// Vue.component(Field.name, Field);


// import './assets/css/index.less'
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
    store
});


