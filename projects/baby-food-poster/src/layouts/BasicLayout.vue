<template>
  <el-container class="app-layout">
    <el-aside width="220px" class="sidebar">
      <div class="sidebar-logo">禾禾AI·辅食</div>
      <el-menu :default-active="activeMenu" router class="sidebar-menu">
        <el-menu-item index="/recipes">
          <el-icon><Document /></el-icon><span>配方管理</span>
        </el-menu-item>
        <el-menu-item index="/ai-generate">
          <el-icon><MagicStick /></el-icon><span>AI 生成</span>
        </el-menu-item>
        <el-menu-item index="/raw-recipes">
          <el-icon><Collection /></el-icon><span>原始配方</span>
        </el-menu-item>
        <el-menu-item index="/prompt-templates">
          <el-icon><EditPen /></el-icon><span>提示词模板</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon><span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document, MagicStick, Collection, EditPen, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path.startsWith('/recipes') ? '/recipes' : route.path)
</script>

<style scoped lang="scss">
.app-layout {
  height: 100vh;
}

.sidebar {
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(212, 129, 106, 0.06);
  overflow: hidden;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
  color: #d4816a;
  letter-spacing: 1px;
  border-bottom: 1px solid #f0ebe7;
  flex-shrink: 0;
}

.sidebar-menu {
  border-right: none;
  flex: 1;

  :deep(.el-menu-item.is-active) {
    color: #d4816a !important;
    background: #fdf4f2 !important;
    border-right: 3px solid #d4816a;
  }

  :deep(.el-menu-item:hover) {
    background: #fdf8f6 !important;
  }
}

.main-content {
  background: #f6f1ee;
  overflow-y: auto;
  padding: 24px;
}
</style>
