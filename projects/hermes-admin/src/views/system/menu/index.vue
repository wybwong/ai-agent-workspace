<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>菜单管理</span>
          <el-button type="primary" icon="Plus" @click="openDialog()">新增菜单</el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="menuTree"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        style="width:100%"
      >
        <el-table-column prop="name" label="菜单名称" min-width="180" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" min-width="160" />
        <el-table-column prop="permission" label="权限标识" min-width="160" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="(['info', '', 'warning'] as const)[row.type]">
              {{ ['目录', '菜单', '按钮'][row.type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <MenuFormDialog
      v-model="dialogVisible"
      :data="currentRow"
      :menu-options="flatMenus"
      @success="fetchMenus()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenuListApi, deleteMenuApi, buildMenuTree } from '@/api/modules/menu'
import MenuFormDialog from './components/MenuFormDialog.vue'
import type { MenuItem } from '@/types'

const loading = ref(false)
const menus = ref<MenuItem[]>([])
const dialogVisible = ref(false)
const currentRow = ref<MenuItem | null>(null)

const menuTree = computed(() => buildMenuTree(menus.value))
const flatMenus = computed(() => menus.value.filter(m => m.type === 0))

async function fetchMenus() {
  loading.value = true
  try {
    menus.value = await getMenuListApi()
  } finally {
    loading.value = false
  }
}

function openDialog(row?: MenuItem) {
  currentRow.value = row || null
  dialogVisible.value = true
}

async function handleDelete(row: MenuItem) {
  await ElMessageBox.confirm(`确定要删除菜单 "${row.name}" 吗？`, '提示', { type: 'warning' })
  await deleteMenuApi(row.id)
  ElMessage.success('删除成功')
  fetchMenus()
}

onMounted(fetchMenus)
</script>
