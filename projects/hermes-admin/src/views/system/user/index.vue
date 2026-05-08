<template>
  <div class="page-container">
    <div class="search-bar">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width:120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
          <span>用户列表</span>
          <el-button type="primary" icon="Plus" @click="openDialog()">新增用户</el-button>
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
        <template #roles="{ row }">
          <el-tag v-for="role in row.roles" :key="role" style="margin-right:4px" type="info">{{ role }}</el-tag>
        </template>
        <template #action="{ row }">
          <el-button link type="primary" icon="Edit" @click="openDialog(row)">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </BaseTable>
    </el-card>
    <UserFormDialog
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
import { getUserListApi, deleteUserApi } from '@/api/modules/user'
import BaseTable from '@/components/BaseTable/index.vue'
import UserFormDialog from './components/UserFormDialog.vue'
import type { UserInfo } from '@/types'
import type { UserListParams } from '@/types/api'

const searchForm = reactive<Partial<UserListParams>>({ username: '', status: undefined })
const dialogVisible = ref(false)
const currentRow = ref<UserInfo | null>(null)

const table = useTable<UserInfo, UserListParams>(getUserListApi)

table.fetchData()

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '手机号', width: 140 },
  { prop: 'roles', label: '角色', slot: 'roles', minWidth: 120 },
  { prop: 'status', label: '状态', slot: 'status', width: 80 },
  { prop: 'createTime', label: '创建时间', minWidth: 160 }
]

function openDialog(row?: UserInfo) {
  currentRow.value = row || null
  dialogVisible.value = true
}

async function handleDelete(row: UserInfo) {
  await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', { type: 'warning' })
  await deleteUserApi(row.id)
  ElMessage.success('删除成功')
  table.fetchData()
}

function resetSearch() {
  searchForm.username = ''
  searchForm.status = undefined
  table.onReset()
}
</script>
