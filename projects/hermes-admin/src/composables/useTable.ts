import { ref, reactive } from 'vue'
import type { PaginationParams, PageResult } from '@/types'

export function useTable<T, P extends object>(
  fetchFn: (params: P & PaginationParams) => Promise<PageResult<T>>,
  defaultParams?: Partial<P>
) {
  const loading = ref(false)
  const data = ref<T[]>([]) as { value: T[] }
  const total = ref(0)
  const pagination = reactive<PaginationParams>({
    page: 1,
    pageSize: 10
  })
  const searchParams = ref<Partial<P>>({ ...defaultParams })

  async function fetchData() {
    loading.value = true
    try {
      const params = {
        ...searchParams.value,
        ...pagination
      } as P & PaginationParams
      const result = await fetchFn(params)
      data.value = result.list
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  function onSearch(params?: Partial<P>) {
    if (params) searchParams.value = { ...searchParams.value, ...params }
    pagination.page = 1
    fetchData()
  }

  function onReset() {
    searchParams.value = { ...defaultParams }
    pagination.page = 1
    fetchData()
  }

  function onPageChange(page: number) {
    pagination.page = page
    fetchData()
  }

  function onSizeChange(size: number) {
    pagination.pageSize = size
    pagination.page = 1
    fetchData()
  }

  return {
    loading,
    data,
    total,
    pagination,
    searchParams,
    fetchData,
    onSearch,
    onReset,
    onPageChange,
    onSizeChange
  }
}
