<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

watch(
  () => appStore.theme,
  (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true }
)
</script>
