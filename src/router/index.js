import Vue from 'vue'
import Router from 'vue-router'

// 定义自定义路由的map
export const componentMap = {
  'layout': require('@/layout').default,
  'user': () => import('@/views/sys/user').then(m => m.default),
  'role': () => import('@/views/sys/role').then(m => m.default),
  'menu': () => import('@/views/sys/menu').then(m => m.default),
  'dictionary': () => import('@/views/sys/dictionary').then(m => m.default),
  'files': () => import('@/views/sys/file').then(m => m.default)
}

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 固定路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
