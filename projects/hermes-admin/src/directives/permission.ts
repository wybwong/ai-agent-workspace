import type { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'

function checkPermission(el: Element, binding: DirectiveBinding) {
  const { value } = binding
  if (!value) return
  const userStore = useUserStore()
  const permissions = userStore.permissions
  const roles = userStore.roles

  if (roles.includes('admin') || permissions.includes('*')) return

  const required: string[] = Array.isArray(value) ? value : [value]
  const hasPermission = required.some(p => permissions.includes(p))

  if (!hasPermission) {
    el.parentNode?.removeChild(el)
  }
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', {
    mounted: checkPermission,
    updated: checkPermission
  })
}
