/**
 * useRequest — 请求状态管理 Composable
 *
 * 使用方式：
 *   const { data, loading, error, run } = useRequest(apiFunction)
 *   run(params)  // 手动触发
 *
 *   // 自动触发（页面挂载立即请求）
 *   const { data, loading } = useRequest(apiFunction, { immediate: true, params: { page: 1 } })
 */
import { ref, shallowRef } from 'vue'

/**
 * @template T
 * @param {(...args: any[]) => Promise<T>} apiFn - 返回 Promise 的接口函数
 * @param {object} [options]
 * @param {boolean} [options.immediate=false] - 是否立即执行
 * @param {any} [options.params] - 立即执行时的初始参数
 * @param {T | null} [options.initialData=null] - 初始数据
 * @returns {{ data: import('vue').Ref<T|null>, loading: import('vue').Ref<boolean>, error: import('vue').Ref<Error|null>, run: Function }}
 */
export function useRequest(apiFn, options = {}) {
  const { immediate = false, params = undefined, initialData = null } = options

  const data = shallowRef(initialData)
  const loading = ref(false)
  const error = ref(null)

  async function run(...args) {
    loading.value = true
    error.value = null
    try {
      data.value = await apiFn(...args)
      return data.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    run(params)
  }

  return { data, loading, error, run }
}
