import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const visitedViews = ref<RouteLocationNormalized[]>([])

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function addVisitedView(view: RouteLocationNormalized) {
    if (visitedViews.value.some(v => v.path === view.path)) return
    if (view.meta?.noTagsView) return
    visitedViews.value.push({ ...view })
  }

  function removeVisitedView(path: string) {
    const idx = visitedViews.value.findIndex(v => v.path === path)
    if (idx !== -1) visitedViews.value.splice(idx, 1)
  }

  function removeOtherViews(path: string) {
    visitedViews.value = visitedViews.value.filter(v => v.path === path || v.path === '/dashboard')
  }

  function removeAllViews() {
    visitedViews.value = visitedViews.value.filter(v => v.path === '/dashboard')
  }

  return {
    sidebarCollapsed,
    theme,
    visitedViews,
    toggleSidebar,
    toggleTheme,
    addVisitedView,
    removeVisitedView,
    removeOtherViews,
    removeAllViews
  }
})
