import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'

export function usePermission() {
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.roles.includes('admin'))

  function hasPermission(permission: string | string[]): boolean {
    if (isAdmin.value || userStore.permissions.includes('*')) return true
    const required = Array.isArray(permission) ? permission : [permission]
    return required.some(p => userStore.permissions.includes(p))
  }

  function hasRole(role: string | string[]): boolean {
    const required = Array.isArray(role) ? role : [role]
    return required.some(r => userStore.roles.includes(r))
  }

  return { isAdmin, hasPermission, hasRole }
}
