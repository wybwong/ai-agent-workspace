<template>
  <div class="app-wrapper" :class="{ 'is-collapsed': isCollapsed }">

    <!-- ===== Sidebar ===== -->
    <aside class="sidebar">
      <div class="sidebar-logo" @click="router.push('/')">
        <el-icon class="logo-icon"><Food /></el-icon>
        <span class="logo-text">禾禾AI·辅食</span>
      </div>

      <el-scrollbar class="sidebar-scroll">
        <el-menu
          :default-active="activeMenu"
          router
          :collapse="isCollapsed"
          :collapse-transition="true"
          background-color="#001529"
          text-color="rgba(255,255,255,0.65)"
          active-text-color="#ffffff"
          class="sidebar-menu"
        >
          <el-menu-item index="/recipes">
            <el-icon><Document /></el-icon>
            <template #title>配方管理</template>
          </el-menu-item>
          <el-menu-item index="/ai-generate">
            <el-icon><MagicStick /></el-icon>
            <template #title>AI 生成</template>
          </el-menu-item>
          <el-menu-item index="/raw-recipes">
            <el-icon><Collection /></el-icon>
            <template #title>原始配方</template>
          </el-menu-item>
          <el-menu-item index="/prompt-templates">
            <el-icon><EditPen /></el-icon>
            <template #title>提示词模板</template>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <template #title>系统设置</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </aside>

    <!-- ===== Main Area ===== -->
    <div class="main-area">

      <!-- Header -->
      <header class="app-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="parentRoute">
              <router-link :to="parentRoute.path">{{ parentRoute.title }}</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-tooltip content="刷新页面" placement="bottom">
            <el-icon class="header-action-btn" @click="handleRefresh"><Refresh /></el-icon>
          </el-tooltip>

          <el-divider direction="vertical" />

          <el-dropdown trigger="click" @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :size="28" class="user-avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <span class="username">Admin</span>
              <el-icon class="arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings" :icon="Setting">系统设置</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Document, MagicStick, Collection, EditPen, Setting,
  Fold, Expand, Refresh, UserFilled, ArrowDown, Food,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const isCollapsed = ref(false)

const routeMeta: Record<string, string> = {
  '/recipes': '配方管理',
  '/ai-generate': 'AI 生成',
  '/raw-recipes': '原始配方',
  '/prompt-templates': '提示词模板',
  '/settings': '系统设置',
}

const activeMenu = computed(() => {
  if (route.path.startsWith('/recipes')) return '/recipes'
  return route.path
})

const currentPageTitle = computed(() => {
  if (route.path.startsWith('/recipes/') && route.path.endsWith('/edit')) {
    return '编辑配方'
  }
  return routeMeta[route.path] ?? route.path
})

const parentRoute = computed(() => {
  if (route.path.startsWith('/recipes/') && route.path.endsWith('/edit')) {
    return { path: '/recipes', title: '配方管理' }
  }
  return null
})

function handleRefresh() {
  router.go(0)
}

function handleUserCommand(command: string) {
  if (command === 'settings') {
    router.push('/settings')
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ===== Sidebar ===== */
.sidebar {
  width: $sidebar-width;
  flex-shrink: 0;
  background: $bg-sidebar;
  display: flex;
  flex-direction: column;
  transition: width 0.28s ease;
  overflow: hidden;

  .app-wrapper.is-collapsed & {
    width: $sidebar-width-collapsed;
  }
}

.sidebar-logo {
  height: $header-height;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: padding 0.28s ease;

  .app-wrapper.is-collapsed & {
    padding: 0;
    justify-content: center;
  }
}

.logo-icon {
  font-size: 22px;
  color: $brand-primary;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.2s ease;

  .app-wrapper.is-collapsed & {
    opacity: 0;
    width: 0;
  }
}

.sidebar-scroll {
  flex: 1;
}

.sidebar-menu {
  border-right: none;
  width: 100% !important;

  :deep(.el-menu-item) {
    &:hover {
      background: rgba(255, 255, 255, 0.06) !important;
      color: #fff !important;
    }

    &.is-active {
      background: $brand-primary !important;
      color: #fff !important;
    }
  }
}

/* ===== Main Area ===== */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ===== Header ===== */
.app-header {
  height: $header-height;
  flex-shrink: 0;
  background: $bg-header;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: $text-secondary;
  flex-shrink: 0;

  &:hover {
    color: $brand-primary;
  }
}

.breadcrumb {
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: $text-primary;
    font-weight: 500;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-action-btn {
  font-size: 18px;
  cursor: pointer;
  color: $text-secondary;

  &:hover {
    color: $brand-primary;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }
}

.user-avatar {
  background: $brand-primary;
}

.username {
  font-size: 14px;
  color: $text-primary;
}

.arrow-down {
  font-size: 12px;
  color: $text-secondary;
}

/* ===== Page Content ===== */
.page-content {
  flex: 1;
  overflow-y: auto;
  background: $bg-page;
}
</style>

