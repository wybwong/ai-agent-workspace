<template>
  <div class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="sidebar-logo">
      <el-icon :size="24" color="#409eff"><Lightning /></el-icon>
      <span v-if="!appStore.sidebarCollapsed" class="logo-text">Hermes Admin</span>
    </div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        background-color="var(--sidebar-bg)"
        text-color="var(--sidebar-text)"
        active-text-color="var(--sidebar-active)"
        router
        class="sidebar-menu"
      >
        <SidebarItem
          v-for="route in dashboardRoute"
          :key="route.path"
          :item="route"
        />
        <SidebarItem
          v-for="route in permissionStore.menus"
          :key="route.path"
          :item="route"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { usePermissionStore } from '@/stores/modules/permission'
import SidebarItem from './SidebarItem.vue'
import type { RouteRecordRaw } from 'vue-router'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const route = useRoute()

const activeMenu = computed(() => route.path)

const dashboardRoute: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '工作台', icon: 'Odometer', affix: true }
  }
]
</script>

<style lang="scss" scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--sidebar-bg);
  transition: width 0.3s;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 64px;

    .logo-text {
      display: none;
    }
  }

  .sidebar-logo {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-bottom: 1px solid var(--border-color);
    padding: 0 16px;
    overflow: hidden;

    .logo-text {
      font-size: 16px;
      font-weight: 600;
      color: #409eff;
      white-space: nowrap;
    }
  }

  .sidebar-menu {
    border-right: none;
    width: 100%;
  }
}
</style>
