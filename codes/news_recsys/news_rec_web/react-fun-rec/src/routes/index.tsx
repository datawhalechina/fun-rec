import { lazy } from 'react'
import { Router } from '../assets/type'
import SignIn from '../pages/SignIn'
 
const router: Array<Router> = [
   {
    path: '/',
    component: SignIn,
    auth: false,
   },
   {
     path: '/signIn',
     auth: false,
     component: lazy(() => import('../pages/SignIn'))
   },
   {
     path: '/signUp',
     auth: false,
     component: lazy(() => import('../pages/SignUp'))
  },
  {
    path: '/recLists',
    auth: true,
    component: lazy(() => import('../pages/RecLists'))
  },
  {
    path: '/hotLists',
    auth: true,
    component: lazy(() => import('../pages/HotLists'))
  },
  {
    path: "/newsInfo/:id",
    name: "newsInfo",
    auth: true,
    component: lazy(() => import('../pages/NewsInfo'))
  },
  {
    path: '/mySelf',
    auth: true,
    component: lazy(() => import('../pages/MySelf'))
  },
  {
    path: '*',
    auth: false,
    component: lazy(() => import('../pages/404'))
  },
]
 
 export default router
 
 