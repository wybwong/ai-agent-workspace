/**
 * 路由守卫
 * 使用方式：在 router/index.js 中 import 并调用 setupRouteGuard(router)
 */

import { useUserStore } from '@/stores/modules/user'
import { getToken } from '@/utils/auth'

// 不需要登录即可访问的白名单路由
const WHITE_LIST = ['/login', '/404', '/403']

export function setupRouteGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const token = getToken()

    // 已登录
    if (token) {
      if (to.path === '/login') {
        // 已登录不允许再访问登录页
        next({ path: '/' })
      } else {
        const userStore = useUserStore()
        // 如果用户信息未加载，则请求一次
        if (!userStore.userInfo) {
          try {
            await userStore.fetchUserInfo()
            // 动态路由加载后需要 replace 一次，避免 404
            next({ ...to, replace: true })
          } catch {
            // 获取用户信息失败，清除 token 重新登录
            userStore.resetToken()
            next(`/login?redirect=${to.path}`)
          }
        } else {
          next()
        }
      }
    } else {
      // 未登录
      if (WHITE_LIST.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })
}
