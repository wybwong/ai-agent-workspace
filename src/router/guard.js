/**
 * 路由守卫 — 复制自 skills/auth-pattern/route-guard.js
 * 使用方式：在 main.js 中 import { setupRouteGuard } from './router/guard'
 */
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'

const WHITE_LIST = ['/login', '/404', '/403']

export function setupRouteGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const token = getToken()

    if (token) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        const userStore = useUserStore()
        if (!userStore.userInfo) {
          try {
            await userStore.fetchUserInfo()
            next({ ...to, replace: true })
          } catch {
            userStore.resetToken()
            next(`/login?redirect=${to.path}`)
          }
        } else {
          next()
        }
      }
    } else {
      if (WHITE_LIST.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })
}
