/**
 * 1.react-router-dom使用
 * HashRouter:如有多个子元素，则需要一个父容器将多个子元素全部包裹，否则报错
 * Switch\Route:将需要路由的组件写在双标签Switch中，并使用单标签Route，将定义好的组件给到component
 * Link:跳转
 * Redirect：重定向
 * 2.redux的结合
 * Provider：provider包裹在根组件外层，使所有的子组件都可以拿到state
 *
 *
 */
 import { lazy } from 'react'
 interface Router {
   name?: string,
   path: string,
   children?: Array<Router>,
   component: any
}
 
 const router: Array<Router> = [
   {
     path: '/signIn',
     component: lazy(() => import('../pages/SignIn'))
   },
   {
     path: '/signUp',
     component: lazy(() => import('../pages/SignUp'))
   }
 ]
 
 export default router
 
 