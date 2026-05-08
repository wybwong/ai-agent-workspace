<template>
  <div class="tags-view">
    <el-scrollbar>
      <div class="tags-inner">
        <span
          v-for="tag in appStore.visitedViews"
          :key="tag.path"
          class="tag-item"
          :class="{ active: isActive(tag.path) }"
          @click="goToTag(tag.path)"
          @contextmenu.prevent="openContextMenu($event, tag.path)"
        >
          {{ tag.meta?.title || tag.name }}
          <el-icon
            v-if="tag.path !== '/dashboard'"
            class="close-icon"
            :size="12"
            @click.stop="closeTag(tag.path)"
          >
            <Close />
          </el-icon>
        </span>
      </div>
    </el-scrollbar>
    <ul
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <li @click="closeCurrentTag">关闭当前</li>
      <li @click="closeOtherTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()

const contextMenu = reactive({ visible: false, x: 0, y: 0, path: '' })

watch(() => route.path, () => {
  appStore.addVisitedView(route)
}, { immediate: true })

function isActive(path: string) { return route.path === path }
function goToTag(path: string) { router.push(path) }

function closeTag(path: string) {
  const idx = appStore.visitedViews.findIndex(v => v.path === path)
  appStore.removeVisitedView(path)
  if (isActive(path)) {
    const next = appStore.visitedViews[idx - 1] || appStore.visitedViews[0]
    if (next) router.push(next.path)
  }
}

function openContextMenu(e: MouseEvent, path: string) {
  contextMenu.visible = true
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.path = path
}

function closeCurrentTag() {
  closeTag(contextMenu.path)
  contextMenu.visible = false
}

function closeOtherTags() {
  appStore.removeOtherViews(contextMenu.path)
  router.push(contextMenu.path)
  contextMenu.visible = false
}

function closeAllTags() {
  appStore.removeAllViews()
  router.push('/dashboard')
  contextMenu.visible = false
}

function handleClickOutside() { contextMenu.visible = false }
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style lang="scss" scoped>
.tags-view {
  height: 36px;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--border-color);
  position: relative;

  .tags-inner {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    white-space: nowrap;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    color: var(--text-color);
    background: var(--bg-color);
    transition: all 0.2s;

    &.active {
      background: #409eff;
      color: #fff;
      border-color: #409eff;
    }

    &:hover:not(.active) {
      border-color: #409eff;
      color: #409eff;
    }

    .close-icon {
      &:hover { color: #f56c6c; }
    }
  }

  .context-menu {
    position: fixed;
    background: var(--navbar-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px 0;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    list-style: none;
    margin: 0;

    li {
      padding: 6px 16px;
      font-size: 13px;
      cursor: pointer;
      color: var(--text-color);
      &:hover { background: var(--bg-hover); color: #409eff; }
    }
  }
}
</style>
