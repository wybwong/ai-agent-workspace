<template>
  <div>
    <div class="welcome-banner">
      <h2>你好，{{ userStore.userInfo?.nickname || 'User' }} 👋</h2>
      <p>欢迎回到 Hermes Admin 管理系统</p>
    </div>
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.label">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24" color="white"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="info-row">
      <el-col :span="12">
        <el-card header="系统信息">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="框架">Vue 3 + Element Plus</el-descriptions-item>
            <el-descriptions-item label="当前用户">{{ userStore.userInfo?.username }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ userStore.roles.join(', ') }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="快速入口">
          <div class="quick-links">
            <el-button v-for="link in quickLinks" :key="link.path"
              :icon="link.icon" @click="router.push(link.path)">
              {{ link.label }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const router = useRouter()

const stats = [
  { label: '用户总数', value: '5', icon: 'User', color: '#409eff' },
  { label: '角色数量', value: '3', icon: 'UserFilled', color: '#67c23a' },
  { label: '菜单项目', value: '5', icon: 'Menu', color: '#e6a23c' },
  { label: '在线用户', value: '1', icon: 'Connection', color: '#f56c6c' }
]

const quickLinks = [
  { label: '用户管理', path: '/system/user', icon: 'User' },
  { label: '角色管理', path: '/system/role', icon: 'UserFilled' },
  { label: '菜单管理', path: '/system/menu', icon: 'Menu' }
]
</script>

<style lang="scss" scoped>
.welcome-banner {
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  color: white;
  h2 { font-size: 20px; margin-bottom: 4px; }
  p { opacity: 0.9; font-size: 14px; }
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
  }
}

.info-row {
  .quick-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
