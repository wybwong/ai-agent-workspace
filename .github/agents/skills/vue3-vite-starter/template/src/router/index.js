import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/demo',
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/demo/DemoList.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
