/**
 * cancel-request — 基于 AbortController 的请求取消模式
 *
 * 适用场景：搜索框输入联想（防止旧请求覆盖新结果）、页面离开时取消进行中请求
 *
 * 使用方式：
 *   import { useCancelableRequest } from '@/utils/cancel-request'
 *
 *   const { signal, cancel } = useCancelableRequest()
 *   // 在 axios 请求中传入 signal
 *   await request.get('/api/search', { params, signal })
 *   // 需要取消时调用
 *   cancel()
 */

/**
 * 创建一个可取消的请求控制器
 * @returns {{ signal: AbortSignal, cancel: () => void, reset: () => AbortSignal }}
 */
export function useCancelableRequest() {
  let controller = new AbortController()

  function cancel() {
    controller.abort()
  }

  /** 取消后重置，用于下一次请求 */
  function reset() {
    controller = new AbortController()
    return controller.signal
  }

  return {
    get signal() {
      return controller.signal
    },
    cancel,
    reset,
  }
}

/**
 * 防抖请求：输入停止后 delay 毫秒才发请求，新输入自动取消旧请求
 *
 * 使用方式（在 Vue 组件中）：
 *   import { createDebouncedRequest } from '@/utils/cancel-request'
 *   const searchUsers = createDebouncedRequest((keyword) => userApi.search(keyword), 300)
 *   // 在 input 事件中调用
 *   searchUsers(keyword).then(data => list.value = data).catch(() => {})
 *
 * @param {Function} apiFn - 接口函数
 * @param {number} [delay=300] - 防抖延迟（毫秒）
 * @returns {Function}
 */
export function createDebouncedRequest(apiFn, delay = 300) {
  let timer = null
  const { cancel, reset } = useCancelableRequest()

  return function (...args) {
    cancel() // 取消上一次请求
    const signal = reset()

    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        try {
          const result = await apiFn(...args, { signal })
          resolve(result)
        } catch (err) {
          if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
            reject(err)
          }
          // 被取消的请求静默处理
        }
      }, delay)
    })
  }
}
