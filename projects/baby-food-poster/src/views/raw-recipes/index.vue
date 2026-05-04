<template>
  <div class="raw-recipes">
    <el-card class="toolbar-card">
      <div class="toolbar">
        <el-radio-group v-model="filterStatus" @change="loadList">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="draft">待分析</el-radio-button>
          <el-radio-button value="analyzed">已分析</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>添加原始配方
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card">
      <el-table :data="list" :loading="isLoading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="ingredients" label="食材（原文）" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'analyzed' ? 'success' : 'info'" size="small">
              {{ STATUS_LABELS[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleToggleStatus(row)">
              {{ row.status === 'draft' ? '标记已分析' : '重置为草稿' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog v-model="showAddDialog" title="添加原始配方" width="500px">
      <el-form :model="addForm" label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="食材原文">
          <el-input v-model="addForm.ingredients" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.notes" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="isSaving" @click="handleAdd">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { dbService } from '@/services/database'
import type { RawRecipe } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  draft: '待分析',
  analyzed: '已分析',
}

const list = ref<RawRecipe[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const filterStatus = ref('')
const showAddDialog = ref(false)

const addForm = reactive({
  name: '',
  ingredients: '',
  notes: '',
})

async function loadList() {
  isLoading.value = true
  try {
    const all = await dbService.getAllRawRecipes()
    list.value = filterStatus.value ? all.filter(r => r.status === filterStatus.value) : all
  } finally {
    isLoading.value = false
  }
}

async function handleToggleStatus(row: RawRecipe) {
  const nextStatus = row.status === 'draft' ? 'analyzed' : 'draft'
  await dbService.updateRawRecipe(row.id!, { ...row, status: nextStatus })
  ElMessage.success('状态已更新')
  await loadList()
}

async function handleDelete(row: RawRecipe) {
  await ElMessageBox.confirm(`确定删除「${row.name}」吗？`, '删除确认', { type: 'warning' })
  await dbService.deleteRawRecipe(row.id!)
  ElMessage.success('删除成功')
  await loadList()
}

async function handleAdd() {
  if (!addForm.name.trim()) {
    ElMessage.warning('请输入名称')
    return
  }
  isSaving.value = true
  try {
    await dbService.createRawRecipe({ ...addForm, status: 'draft' })
    ElMessage.success('添加成功')
    showAddDialog.value = false
    Object.assign(addForm, { name: '', ingredients: '', notes: '' })
    await loadList()
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadList())
</script>

<style scoped lang="scss">
.raw-recipes {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar-card {
  :deep(.el-card__body) { padding: 12px 20px; }
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-card {
  :deep(.el-card__body) { padding: 0; }
}
</style>
