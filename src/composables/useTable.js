import { ref, reactive } from 'vue'

/**
 * 列表页通用逻辑
 * @param {Function} fetchFn - 接口函数，接收 params 返回 { list, total }
 *
 * 用法：
 * const { list, loading, pagination, searchForm, load, onSearch, onReset } = useTable(demoApi.list)
 */
export function useTable(fetchFn) {
  const list = ref([])
  const loading = ref(false)
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0,
  })

  // 搜索参数（各页面在外部定义后传入 load）
  async function load(params = {}) {
    loading.value = true
    try {
      const res = await fetchFn({ page: pagination.page, pageSize: pagination.pageSize, ...params })
      list.value = res.list ?? res.data ?? res
      pagination.total = res.total ?? 0
    } finally {
      loading.value = false
    }
  }

  function onPageChange(page) {
    pagination.page = page
  }

  function onSizeChange(size) {
    pagination.pageSize = size
    pagination.page = 1
  }

  return { list, loading, pagination, load, onPageChange, onSizeChange }
}
