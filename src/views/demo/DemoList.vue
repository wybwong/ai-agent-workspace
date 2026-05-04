<template>
  <div class="p-4">
    <!-- 搜索栏 -->
    <el-card class="mb-4">
      <el-form inline :model="searchForm">
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <div class="mb-3">
      <el-button type="primary" @click="openDialog(null)">新增</el-button>
    </div>

    <!-- 表格 -->
    <BaseTable
      :data="list"
      :loading="loading"
      :pagination="pagination"
      @page-change="p => { pagination.page = p; load(searchForm) }"
      @size-change="s => { pagination.pageSize = s; pagination.page = 1; load(searchForm) }"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'info'">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog(row.id)">编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </BaseTable>

    <!-- 新增/编辑弹窗 -->
    <BaseDialog
      v-model="dialogVisible"
      :id="editId"
      :loading="submitting"
      @confirm="handleSubmit"
      @closed="formReset"
    >
      <BaseForm ref="formRef" :model="formData" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </BaseForm>
    </BaseDialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { demoApi } from '@/api/modules/demo'
import { useTable } from '@/composables/useTable'
import BaseTable from '@/components/BaseTable.vue'
import BaseForm from '@/components/BaseForm.vue'
import BaseDialog from '@/components/BaseDialog.vue'

// 列表逻辑
const { list, loading, pagination, load } = useTable(demoApi.list)

const searchForm = reactive({ name: '', status: null })

function onSearch() {
  pagination.page = 1
  load(searchForm)
}

function onReset() {
  searchForm.name = ''
  searchForm.status = null
  onSearch()
}

// 弹窗逻辑
const dialogVisible = ref(false)
const editId = ref(null)
const formRef = ref(null)
const submitting = ref(false)

const formData = reactive({ name: '', status: 1 })

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

async function openDialog(id) {
  editId.value = id
  if (id) {
    const detail = await demoApi.detail(id)
    Object.assign(formData, detail)
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  await formRef.value?.validate()
  submitting.value = true
  try {
    if (editId.value) {
      await demoApi.update(editId.value, formData)
    } else {
      await demoApi.create(formData)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    load(searchForm)
  } finally {
    submitting.value = false
  }
}

function formReset() {
  formRef.value?.resetFields()
  Object.assign(formData, { name: '', status: 1 })
  editId.value = null
}

async function handleDelete(id) {
  await demoApi.remove(id)
  ElMessage.success('删除成功')
  load(searchForm)
}

onMounted(() => load(searchForm))
</script>
