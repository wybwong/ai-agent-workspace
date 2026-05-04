/**
 * Token 无感刷新方案
 * 在 src/utils/request.js 的响应拦截器中集成
 *
 * 原理：
 * 1. access token 过期，接口返回 401
 * 2. 拦截器捕获 401，用 refresh token 换新 access token
 * 3. 重新发起原请求
 * 4. 若 refresh token 也过期，跳转登录页
 */

import axios from 'axios'
import { getToken, setToken, getRefreshToken, removeToken } from '@/utils/auth'
import router from '@/router'

let isRefreshing = false
// 401 期间挂起的请求队列
let pendingQueue = []

function processPendingQueue(newToken) {
  pendingQueue.forEach(({ config, resolve, reject }) => {
    config.headers.Authorization = `Bearer ${newToken}`
    axios(config).then(resolve).catch(reject)
  })
  pendingQueue = []
}

/**
 * 在 request.js 的响应拦截器 error 分支中调用此函数
 * @param {import('axios').AxiosError} error
 * @param {import('axios').AxiosInstance} instance - axios 实例自身
 */
export async function handleTokenRefresh(error, instance) {
  const originalConfig = error.config

  if (error.response?.status !== 401 || originalConfig._retry) {
    return Promise.reject(error)
  }

  if (isRefreshing) {
    // 已在刷新中，将请求挂起
    return new Promise((resolve, reject) => {
      pendingQueue.push({ config: originalConfig, resolve, reject })
    })
  }

  originalConfig._retry = true
  isRefreshing = true

  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) throw new Error('no refresh token')

    // 调用刷新接口（替换为实际接口地址）
    const { data } = await axios.post('/api/auth/refresh', { refreshToken })
    const newToken = data.accessToken

    setToken(newToken)
    originalConfig.headers.Authorization = `Bearer ${newToken}`
    processPendingQueue(newToken)

    return instance(originalConfig)
  } catch {
    removeToken()
    pendingQueue = []
    router.push('/login')
    return Promise.reject(error)
  } finally {
    isRefreshing = false
  }
}
