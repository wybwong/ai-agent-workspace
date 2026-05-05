import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, setToken, getRefreshToken, removeToken } from '@/utils/auth'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 请求拦截器 — 附加 token
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Token 无感刷新状态
let isRefreshing = false
let pendingQueue = []

function processPendingQueue(newToken) {
  pendingQueue.forEach(({ config, resolve, reject }) => {
    config.headers.Authorization = `Bearer ${newToken}`
    request(config).then(resolve).catch(reject)
  })
  pendingQueue = []
}

// 响应拦截器 — 统一错误处理 + 自动刷新 token
request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    if (code === 0 || code === 200) {
      return data
    }
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  async (error) => {
    const status = error.response?.status
    const originalConfig = error.config

    // 401 自动刷新 token（若无 refresh token 机制可删除此段）
    if (status === 401 && !originalConfig._retry) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ config: originalConfig, resolve, reject })
          })
        }
        originalConfig._retry = true
        isRefreshing = true
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh`,
            { refreshToken }
          )
          const newToken = data.accessToken
          setToken(newToken)
          originalConfig.headers.Authorization = `Bearer ${newToken}`
          processPendingQueue(newToken)
          return request(originalConfig)
        } catch {
          removeToken()
          pendingQueue = []
          router.push('/login')
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      }
      // 无 refresh token，直接跳登录
      removeToken()
      router.push('/login')
    }

    const msgMap = {
      401: '登录已过期，请重新登录',
      403: '无权限访问',
      404: '请求资源不存在',
      500: '服务器错误，请稍后重试',
    }
    if (status !== 401) {
      ElMessage.error(msgMap[status] || error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
