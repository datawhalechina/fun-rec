// 导入VueRoute路由组件
import VueRouter from 'vue-router'

//导入cookie
import cookie from './assets/js/cookie'

import Myself from "./components/Myself.vue";
// 新闻组件
import NewsLists from "./components/NewsLists.vue";
import NewsInfo from "./components/NewsInfo.vue";
import Login from './components/Login.vue'
import signIn from './components/signIn.vue'
import signUp from './components/signUp.vue'

let routerObj = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: signIn,
            meta: {
                isPublic: true,
                keepAlive: false,
                scrollTop: 0
            },

        },
        {
            path: '/signUp',
            component: signUp,
            meta: {
                isPublic: true,
                keepAlive: false,
                scrollTop: 0
            },

        },
        {
            path: '/NewsLists',
            component: NewsLists,
            meta: {
                isPublic: false,
                keepAlive: true,
                scrollTop: 0
            }
        },
        {
            path: '/Myself',
            component: Myself,
            meta: {
                isPublic: false,
                keepAlive: false,
                scrollTop: 0
            },

        },
        {
            path: '/NewsInfo/:id',
            name: 'NewsInfo',
            component: NewsInfo,
            meta: {
                isPublic: false,
                keepAlive: false,
                scrollTop: 0
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

// 未登录直接跳转至登录页
// routerObj.beforeEach(async (to, from, next) => {
//     console.log(localStorage.tokens)
//     if (!to.meta.isPublic && !localStorage.username) {
//         return next('/login')
//     }
//     next()
// })

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
    // if (from.meta.keepAlive) {
    //     const $wrapper = document.querySelector('.van-tabs__content'); // 列表的外层容器 注意找到滚动的盒子
    //     console.log($wrapper);
    //     const scrollTop = $wrapper ? $wrapper.scrollTop : 0;
    //     console.log('scrollTop=', scrollTop)
    //     from.meta.scrollTop = scrollTop;
    // }
    //     next();
})


// 把routerObj对象暴漏出去。main.js导入这个数据
export default routerObj