# 典型页面写法规范 — Page Patterns

> 把常见的"列表页""表单弹窗""详情页"等模式固化下来，避免每次从头设计。

---

## 模式 1：标准列表页

**适用场景**：用户管理、订单管理等大多数 CRUD 列表

**基础结构**（`views/[module]/index.vue`）：

```vue
<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>新建
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData" row-key="id" stripe>
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        @change="fetchList"
      />
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <FormDialog v-model="dialogVisible" :row="currentRow" @success="fetchList" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getList, deleteItem } from '@/api/modules/[module]'
import FormDialog from './components/FormDialog.vue'
import type { ListItem } from '@/types'

// 搜索表单
const searchForm = reactive({ keyword: '' })

// 表格数据
const loading = ref(false)
const tableData = ref<ListItem[]>([])
const total = ref(0)
const pagination = reactive({ page: 1, pageSize: 10 })

// 弹窗
const dialogVisible = ref(false)
const currentRow = ref<ListItem | null>(null)

async function fetchList() {
  loading.value = true
  try {
    const res = await getList({ ...searchForm, ...pagination })
    tableData.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchList()
}

function handleReset() {
  searchForm.keyword = ''
  handleSearch()
}

function handleCreate() {
  currentRow.value = null
  dialogVisible.value = true
}

function handleEdit(row: ListItem) {
  currentRow.value = { ...row }
  dialogVisible.value = true
}

async function handleDelete(row: ListItem) {
  await ElMessageBox.confirm(`确定删除「${row.name}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await deleteItem(row.id)
  ElMessage.success('删除成功')
  fetchList()
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.page-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
```

---

## 模式 2：表单弹窗（新建/编辑共用）

**约定**：
- `props.row` 为 `null` 时是新建，有值时是编辑
- 成功后 `emit('success')` 通知父页面刷新列表
- 使用 `el-form` 的 `validate()` 方法做前端校验

```vue
<!-- views/[module]/components/FormDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑' : '新建'"
    width="520px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <!-- 更多字段... -->
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { createItem, updateItem } from '@/api/modules/[module]'
import type { ListItem } from '@/types'

const props = defineProps<{ modelValue: boolean; row: ListItem | null }>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; success: [] }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const isEdit = computed(() => !!props.row?.id)

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({ name: '' })
const rules: FormRules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
}

// 编辑时同步表单数据
watch(
  () => props.row,
  (row) => {
    if (row) Object.assign(form, row)
    else Object.assign(form, { name: '' })
  },
  { immediate: true }
)

async function handleSubmit() {
  await formRef.value?.validate()
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateItem(props.row!.id, form)
    } else {
      await createItem(form)
    }
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    visible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  formRef.value?.resetFields()
}
</script>
```

---

## 模式 3：`useTable` 组合式函数（减少重复代码）

如果多个列表页逻辑高度相似，提取为 composable：

```typescript
// composables/useTable.ts
import { ref, reactive } from 'vue'

export function useTable<T, P extends object>(
  fetchFn: (params: P & { page: number; pageSize: number }) => Promise<{ list: T[]; total: number }>,
  defaultParams?: Partial<P>
) {
  const loading = ref(false)
  const tableData = ref<T[]>([])
  const total = ref(0)
  const pagination = reactive({ page: 1, pageSize: 10 })
  const searchParams = reactive<Partial<P>>(defaultParams ?? {})

  async function fetchList() {
    loading.value = true
    try {
      const res = await fetchFn({ ...(searchParams as P), ...pagination })
      tableData.value = res.list
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  function search() {
    pagination.page = 1
    fetchList()
  }

  return { loading, tableData, total, pagination, searchParams, fetchList, search }
}
```

**页面中使用**：

```typescript
const { loading, tableData, total, pagination, searchParams, fetchList, search } = useTable(
  getUserList,
  { keyword: '' }
)
```

---

## 规则总结

| 场景 | 规范 |
|------|------|
| 列表页 | `index.vue` + `components/FormDialog.vue`，分页用 `el-pagination` |
| 弹窗共用 | `props.row === null` → 新建，有值 → 编辑，统一一个 Dialog 组件 |
| 表单验证 | 用 `el-form` + `rules` + `formRef.validate()`，禁止手动写 if 校验 |
| 删除确认 | 必须用 `ElMessageBox.confirm`，不能直接删除 |
| 成功提示 | 统一用 `ElMessage.success`，失败由 axios 拦截器统一处理 |
| 加载状态 | 表格必须有 `v-loading`，按钮提交时有 `:loading` |
