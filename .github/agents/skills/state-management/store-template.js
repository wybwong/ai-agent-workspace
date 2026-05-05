/**
 * store-template.js — 标准 Pinia Store 模板（Setup 写法）
 *
 * 复制此文件到 src/stores/<module-name>.js，按需修改。
 * 命名约定：
 *   - 文件名：小写短横线，如 user-order.js
 *   - Store ID：驼峰，如 'userOrder'
 *   - 导出函数名：use + PascalCase + Store，如 useUserOrderStore
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// import request from '@/api'  // 按需引入

export const useExampleStore = defineStore('example', () => {
  // ─── state ──────────────────────────────────────────────────────────────────
  const list = ref([])
  const loading = ref(false)
  const currentItem = ref(null)

  // ─── getters ────────────────────────────────────────────────────────────────
  const total = computed(() => list.value.length)
  const hasItems = computed(() => list.value.length > 0)

  // ─── actions ────────────────────────────────────────────────────────────────
  async function fetchList(params) {
    loading.value = true
    try {
      // const data = await request.get('/api/example', { params })
      // list.value = data
    } finally {
      loading.value = false
    }
  }

  function setCurrentItem(item) {
    currentItem.value = item
  }

  function reset() {
    list.value = []
    loading.value = false
    currentItem.value = null
  }

  // ─── 全量返回（方便 devtools 调试，不隐藏内部状态）─────────────────────────
  return {
    list,
    loading,
    currentItem,
    total,
    hasItems,
    fetchList,
    setCurrentItem,
    reset,
  }
})
