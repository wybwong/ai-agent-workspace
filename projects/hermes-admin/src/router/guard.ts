import router from '@/router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { getToken } from '@/utils/auth'
import { WHITE_LIST } from '@/constants'

router.beforeEach(async (to, _from, next) => {
  const token = getToken()

  if (!token) {
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
    return
  }

  if (to.path === '/login') {
    next('/')
    return
  }

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch {
      userStore.resetState()
      next(`/login?redirect=${to.path}`)
      return
    }
  }

  if (!permissionStore.addedRoutes) {
    permissionStore.generateRoutes(userStore.roles)
    next({ ...to, replace: true })
    return
  }

  next()
})
