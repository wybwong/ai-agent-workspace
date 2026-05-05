/**
 * 按钮级权限指令 v-permission
 *
 * 注册方式（main.js）：
 *   import { permissionDirective } from '@/directives/permission'
 *   app.directive('permission', permissionDirective)
 *
 * 使用方式：
 *   <el-button v-permission="'admin'">仅管理员可见</el-button>
 *   <el-button v-permission="['admin', 'editor']">管理员或编辑可见</el-button>
 */

// 默认路径匹配 vue3-vite-starter 模板结构，若使用 modules 子目录请改为 '@/stores/modules/user'
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
      // 移除元素（比 display:none 更彻底，防止 CSS 覆盖）
      el.parentNode?.removeChild(el)
    }
  },
}
