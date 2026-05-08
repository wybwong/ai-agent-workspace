import { defineStore } from 'pinia'
import { ref } from 'vue'
import { asyncRoutes } from '@/router/modules/system'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  const addedRoutes = ref(false)
  const accessibleRoutes = ref<RouteRecordRaw[]>([])
  const menus = ref<RouteRecordRaw[]>([])

  function filterRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = []
    routes.forEach(route => {
      const routeRoles = route.meta?.roles as string[] | undefined
      const hasPermission = !routeRoles || roles.includes('admin') || routeRoles.some(r => roles.includes(r))
      if (hasPermission) {
        const r = { ...route }
        if (r.children) {
          r.children = filterRoutes(r.children, roles)
        }
        result.push(r)
      }
    })
    return result
  }

  function generateRoutes(roles: string[]) {
    if (addedRoutes.value) return
    const filtered = filterRoutes(asyncRoutes, roles)
    accessibleRoutes.value = filtered
    menus.value = filtered
    filtered.forEach(route => {
      router.addRoute('layout', route)
    })
    addedRoutes.value = true
  }

  function resetRoutes() {
    addedRoutes.value = false
    accessibleRoutes.value = []
    menus.value = []
  }

  return { addedRoutes, accessibleRoutes, menus, generateRoutes, resetRoutes }
})
