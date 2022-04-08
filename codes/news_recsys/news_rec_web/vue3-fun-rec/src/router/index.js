import { createRouter, createWebHashHistory } from 'vue-router'
//导入cookie
import cookie from '../assets/js/cookie'
import { Toast} from 'vant'
import SignIn from '../views/SignIn.vue'

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
  {
      path: '/recLists',
      component: () => import('../views/RecLists.vue'),
      name: 'recLists',
      meta: {
          keepAlive: true,
      }
  },
  {
      path: '/hotLists',
      component: () => import('../views/HotLists.vue'),
      name: 'hotLists',
      meta: {
          keepAlive: true,
      }
  },
  {
      path: '/myself',
      component: () => import('../views/Myself.vue'),
      name: 'myself',
      meta: {
          keepAlive: false,
      },

  },
  {
      path: '/NewsInfo/:id',
      name: 'NewsInfo',
      component: () => import('../views/NewsInfo.vue'),
      meta: {
          keepAlive: false,
      }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/*
beforeEach:从一个页面跳转到另外一个页面时触发
to:要跳转的页面
from:从哪个页面出来
next:决定是否通过
*/

/* 设置了一个全局守卫，只要发生页面跳转，会执行里面的代码，
调用cookie.getCookie()方法读取用户信息，
如果不存在代表没有登录，用next('/')进入登录页面进行登录，
如果读取到了用户信息，不做拦截直接放行。 */

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


export default router
