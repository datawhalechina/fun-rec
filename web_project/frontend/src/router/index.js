import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetail from '../views/MovieDetail.vue'
import Auth from '../views/Auth.vue'
import Profile from '../views/Profile.vue'
import AddMovie from '../views/AddMovie.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail,
    props: true,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { guest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/movies/new',
    name: 'AddMovie',
    component: AddMovie,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由导航
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !token) {
    next('/auth')
  }
  // 检查路由是否需要管理员权限
  else if (to.meta.requiresAdmin) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.is_superuser === 1) {
          next()
        } else {
          // 非管理员，重定向到首页
          next('/')
        }
      } catch (e) {
        next('/auth')
      }
    } else {
      next('/auth')
    }
  }
  // 检查路由是否仅供访客使用（已认证用户将被重定向）
  else if (to.meta.guest && token) {
    next('/')
  }
  else {
    next()
  }
})

export default router

