import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types'
import { getUserInfoApi, logoutApi } from '@/api/modules/auth'
import { getToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken())
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])

  async function fetchUserInfo() {
    const t = getToken()
    if (!t) throw new Error('no token')
    const info = await getUserInfoApi(t)
    userInfo.value = info
    roles.value = info.roles
    permissions.value = info.permissions
    return info
  }

  async function logout() {
    await logoutApi()
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    removeToken()
  }

  function resetState() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
  }

  return { token, userInfo, roles, permissions, fetchUserInfo, logout, resetState }
}, {
  persist: {
    key: 'hermes-user',
    storage: localStorage,
    pick: ['token']
  }
})
