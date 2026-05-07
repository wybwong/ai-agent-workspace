<template>
  <template v-if="!item.meta?.hidden">
    <el-sub-menu v-if="hasChildren" :index="item.path ?? ''">
      <template #title>
        <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path ?? ''">
      <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
      <template #title>{{ item.meta?.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item: RouteRecordRaw
}>()

const hasChildren = computed(() =>
  props.item.children && props.item.children.filter(c => !c.meta?.hidden).length > 0
)
</script>
