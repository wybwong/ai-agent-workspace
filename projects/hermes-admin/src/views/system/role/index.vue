<template>
  <div class="page-container">
    <div class="search-bar">
      <el-form :model="searchForm" inline>
        <el-form-item label="角色名">
          <el-input v-model="searchForm.name" placeholder="请输入角色名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="table.onSearch(searchForm)">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>角色列表</span>
          <el-button type="primary" icon="Plus" @click="openDialog()">新增角色</el-button>
        </div>
      </template>
      <BaseTable
        :columns="columns"
        :data="table.data.value"
        :loading="table.loading.value"
        :total="table.total.value"
        :pagination="table.pagination"
        @page-change="table.onPageChange"
        @size-change="table.onSizeChange"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button link type="primary" icon="Edit" @click="openDialog(row)">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </BaseTable>
    </el-card>
    <RoleFormDialog
      v-model="dialogVisible"
      :data="currentRow"
      @success="table.fetchData()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/composables/useTable'
import { getRoleListApi, deleteRoleApi } from '@/api/modules/role'
import BaseTable from '@/components/BaseTable/index.vue'
import RoleFormDialog from './components/RoleFormDialog.vue'
import type { RoleInfo } from '@/types'
import type { RoleListParams } from '@/types/api'

const searchForm = reactive<Partial<RoleListParams>>({ name: '' })
const dialogVisible = ref(false)
const currentRow = ref<RoleInfo | null>(null)

const table = useTable<RoleInfo, RoleListParams>(getRoleListApi)
table.fetchData()

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '角色名', minWidth: 120 },
  { prop: 'code', label: '角色编码', minWidth: 120 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { prop: 'status', label: '状态', slot: 'status', width: 80 },
  { prop: 'createTime', label: '创建时间', minWidth: 160 }
]

function openDialog(row?: RoleInfo) {
  currentRow.value = row || null
  dialogVisible.value = true
}

async function handleDelete(row: RoleInfo) {
  await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', { type: 'warning' })
  await deleteRoleApi(row.id)
  ElMessage.success('删除成功')
  table.fetchData()
}

function resetSearch() {
  searchForm.name = ''
  table.onReset()
}
</script>
