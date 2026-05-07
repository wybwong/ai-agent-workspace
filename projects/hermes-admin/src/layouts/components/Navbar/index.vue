<template>
  <div class="navbar">
    <div class="navbar-left">
      <el-icon class="toggle-btn" :size="20" @click="appStore.toggleSidebar()">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <Breadcrumb />
    </div>
    <div class="navbar-right">
      <el-tooltip :content="appStore.theme === 'dark' ? '切换亮色' : '切换暗色'">
        <el-icon class="action-icon" :size="18" @click="appStore.toggleTheme()">
          <Sunny v-if="appStore.theme === 'dark'" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown @command="handleCommand" class="user-dropdown">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.userInfo?.avatar || DEFAULT_AVATAR" />
          <span class="username">{{ userStore.userInfo?.nickname || 'User' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { DEFAULT_AVATAR } from '@/constants'
import Breadcrumb from '../Breadcrumb/index.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const router = useRouter()

async function handleCommand(command: string) {
  if (command === 'logout') {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
    await userStore.logout()
    permissionStore.resetRoutes()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .toggle-btn {
      cursor: pointer;
      color: var(--text-color);
      &:hover { color: #409eff; }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .action-icon {
      cursor: pointer;
      color: var(--text-color);
      &:hover { color: #409eff; }
    }

    .user-dropdown {
      cursor: pointer;
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        .username {
          font-size: 14px;
          color: var(--text-color);
        }
      }
    }
  }
}
</style>
