// 导入VueRoute路由组件
import VueRouter from 'vue-router'


//导入cookie
import cookie from './assets/js/cookie'

import Myself from "./components/Myself.vue";
import NewsInfo from "./components/NewsInfo.vue";
import signIn from './components/signIn.vue'
import signUp from './components/signUp.vue'
import recLists from './components/recLists.vue'
import hotLists from './components/hotLists.vue'

let routerObj = new VueRouter({
    // mode: 'history',
    // base: '/home/recsys/',
    routes: [
        {
            path: '/',
            component: signIn,
            name: 'signIn',
            meta: {
                keepAlive: false,
            },

        },
        {
            path: '/signUp',
            component: signUp,
            name: 'signUp',
            meta: {
                keepAlive: false,
            },

        },
        {
            path: '/recLists',
            component: recLists,
            name: 'recLists',
            meta: {
                keepAlive: true,
            }
        },
        {
            path: '/hotLists',
            component: hotLists,
            name: 'hotLists',
            meta: {
                keepAlive: true,
            }
        },
        {
            path: '/Myself',
            component: Myself,
            name: 'Myself',
            meta: {
                keepAlive: false,
            },

        },
        {
            path: '/NewsInfo/:id',
            name: 'NewsInfo',
            component: NewsInfo,
            meta: {
                keepAlive: false,
            }
        },
    ],
    linkActiveClass: 'mui-active',
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

/*
* beforeEach:从一个页面跳转到另外一个页面时触发
* to:要跳转的页面
* from:从哪个页面出来
* next:决定是否通过
*/

/* router.beforeEach意思是在router.index设置了一个全局守卫，
只要发生页面跳转，会执行里面的代码，首先先去判断跳转的页面是否存在，
调用cookie.getCookie()方法读取用户信息，
如果不存在代表没有登录，用next('/Login')进入Login登录页面进行登录，
如果读取到了用户信息，不做拦截直接放行。 */

routerObj.beforeEach((to, from, next) => {
    if (cookie.getCookie("openId")) {
        next()
    } else {
        if (to.path === "/") {
            next()
        } if (to.path == '/signUp') {
            next()
        } else {
            next('/')
        }
    }
    // if (from.name == 'signIn' || from.name == 'signUp') {
    //     to.meta.keepAlive = false
    //     console.log('router true', from, to);
    // } else if (to.name == 'NewsInfo' || to.name == 'Myself') {
    //     to.meta.keepAlive = false
    //     console.log('to');
    // } else {
    //     to.meta.keepAlive = true
    //     console.log('router false', from, to);
    // }
    // next();
})
export default routerObj