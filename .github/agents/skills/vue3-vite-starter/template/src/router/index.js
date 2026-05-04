import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 登录页（不带 Layout）
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
  // 主框架路由（带 BasicLayout 侧边栏+顶栏）
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    redirect: '/demo',
    children: [
      {
        path: 'demo',
        name: 'Demo',
        component: () => import('../views/demo/DemoList.vue'),
        meta: { title: '示例列表' },
      },
      // 在此处追加业务路由 ↓
    ],
  },
  // 错误页
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/404.vue'),
  },
  // 未匹配路由全部跳转 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
