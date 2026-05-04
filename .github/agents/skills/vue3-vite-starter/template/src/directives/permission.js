/**
 * 按钮级权限指令 v-permission
 * 复制自 skills/auth-pattern/permission-directive.js
 * 注册：main.js 中 app.directive('permission', permissionDirective)
 * 使用：<el-button v-permission="['admin']">仅管理员</el-button>
 */
import { useUserStore } from '@/stores/user'

function hasPermission(value) {
  const userStore = useUserStore()
  const userRoles = userStore.userInfo?.roles ?? []
  const required = Array.isArray(value) ? value : [value]
  return required.some((role) => userRoles.includes(role))
}

export const permissionDirective = {
  mounted(el, binding) {
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
}
