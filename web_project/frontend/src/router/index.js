import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetail from '../views/MovieDetail.vue'
import Auth from '../views/Auth.vue'
import Profile from '../views/Profile.vue'
import AddMovie from '../views/AddMovie.vue'
import ChatRecommend from '../views/ChatRecommend.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/chat',
    name: 'ChatRecommend',
    component: ChatRecommend,
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/auth')
  }
  else if (to.meta.requiresAdmin) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.is_superuser === 1) {
          next()
        } else {
          next('/')
        }
      } catch (e) {
        next('/auth')
      }
    } else {
      next('/auth')
    }
  }
  else if (to.meta.guest && token) {
    next('/')
  }
  else {
    next()
  }
})

export default router
