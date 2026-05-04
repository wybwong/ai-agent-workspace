import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || "")
  const userInfo = ref(null)

  function setUserToken(val) {
    token.value = val
    setToken(val)
  }

  // 路由守卫调用：获取用户信息（替换为实际接口）
  async function fetchUserInfo() {
    const { getUserInfo } = await import('@/api/modules/user')
    const data = await getUserInfo()
    userInfo.value = data
    return data
  }

  // 路由守卫调用：清除登录状态
  function resetToken() {
    token.value = ""
    userInfo.value = null
    removeToken()
  }

  function logout() {
    resetToken()
  }

  return { token, userInfo, setUserToken, fetchUserInfo, resetToken, logout }
})
