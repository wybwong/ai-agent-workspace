/**
 * global-state.js — 应用全局 UI 状态 Store
 *
 * 管理：侧边栏折叠、主题、全局加载遮罩、路由面包屑
 *
 * 注册后在 BasicLayout.vue 等组件中引入使用：
 *   import { useAppStore } from '@/stores/app'
 *   const appStore = useAppStore()
 *   appStore.toggleSidebar()
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore(
  'app',
  () => {
    // ─── 侧边栏 ──────────────────────────────────────────────────────────────
    const sidebarCollapsed = ref(false)

    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // ─── 主题 ─────────────────────────────────────────────────────────────────
    /** @type {import('vue').Ref<'light' | 'dark'>} */
    const theme = ref('light')

    function setTheme(val) {
      theme.value = val
      document.documentElement.setAttribute('data-theme', val)
    }

    // ─── 全局加载遮罩 ─────────────────────────────────────────────────────────
    const globalLoading = ref(false)
    let loadingCount = 0

    function showLoading() {
      loadingCount++
      globalLoading.value = true
    }

    function hideLoading() {
      loadingCount = Math.max(0, loadingCount - 1)
      if (loadingCount === 0) globalLoading.value = false
    }

    // ─── 面包屑 ───────────────────────────────────────────────────────────────
    /** @type {import('vue').Ref<Array<{title: string, path?: string}>>} */
    const breadcrumbs = ref([])

    function setBreadcrumbs(items) {
      breadcrumbs.value = items
    }

    const pageTitle = computed(() => breadcrumbs.value.at(-1)?.title || '')

    return {
      sidebarCollapsed,
      toggleSidebar,
      theme,
      setTheme,
      globalLoading,
      showLoading,
      hideLoading,
      breadcrumbs,
      setBreadcrumbs,
      pageTitle,
    }
  },
  {
    // 持久化主题和侧边栏折叠状态（需配合 persist-plugin.js 或 pinia-plugin-persistedstate）
    persist: ['theme', 'sidebarCollapsed'],
  }
)
