/**
 * persist-plugin.js — 轻量 Pinia localStorage 持久化插件
 *
 * 无需安装额外依赖，适合小型项目或只需持久化少量 store 的场景。
 *
 * 注册方式（main.js）：
 *   import { createPinia } from 'pinia'
 *   import { piniaLocalStorage } from '@/stores/persist-plugin'
 *
 *   const pinia = createPinia()
 *   pinia.use(piniaLocalStorage)
 *
 * 在 Store 中开启持久化：
 *   export const useSettingsStore = defineStore('settings', () => {
 *     const theme = ref('light')
 *     return { theme }
 *   }, {
 *     persist: true           // 持久化全部 state
 *     // persist: ['theme']   // 只持久化指定字段
 *   })
 */

/**
 * @param {import('pinia').PiniaPluginContext} context
 */
export function piniaLocalStorage({ store, options }) {
  const persist = options?.persist
  if (!persist) return

  const storageKey = `pinia_${store.$id}`

  // 初始化时从 localStorage 恢复
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      const keys = Array.isArray(persist) ? persist : Object.keys(store.$state)
      keys.forEach((key) => {
        if (key in parsed) {
          store.$patch({ [key]: parsed[key] })
        }
      })
    } catch {
      // 数据损坏时静默忽略，使用默认值
      localStorage.removeItem(storageKey)
    }
  }

  // 订阅 state 变化，自动写入 localStorage
  store.$subscribe((_, state) => {
    const keys = Array.isArray(persist) ? persist : Object.keys(state)
    const toSave = keys.reduce((acc, key) => {
      acc[key] = state[key]
      return acc
    }, {})
    localStorage.setItem(storageKey, JSON.stringify(toSave))
  })
}
