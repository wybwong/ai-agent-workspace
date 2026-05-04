<template>
  <div class="prompt-templates">
    <el-card class="toolbar-card">
      <div class="toolbar">
        <span class="toolbar-title">提示词模板</span>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>新建模板
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card">
      <el-table :data="list" :loading="isLoading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="模板名称" min-width="180" />
        <el-table-column label="变量" min-width="200">
          <template #default="{ row }">
            <el-tag
              v-for="v in row.variables"
              :key="v"
              size="small"
              style="margin: 2px"
            >{{ v }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="showDialog"
      :title="editId ? '编辑模板' : '新建模板'"
      width="700px"
    >
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="模板名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="系统提示词">
          <el-input v-model="form.systemPrompt" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="用户提示词">
          <el-input
            v-model="form.userPromptTemplate"
            type="textarea"
            :rows="6"
            placeholder="使用 {{变量名}} 表示变量，如：{{食材}}"
          />
        </el-form-item>
        <el-form-item label="变量列表">
          <div class="vars-editor">
            <el-tag
              v-for="(v, idx) in form.variables"
              :key="idx"
              closable
              @close="removeVar(idx)"
            >{{ v }}</el-tag>
            <el-input
              v-if="showVarInput"
              ref="varInputRef"
              v-model="newVar"
              size="small"
              style="width: 120px"
              @keyup.enter="addVar"
              @blur="addVar"
            />
            <el-button v-else size="small" @click="showVarInput = true">+ 变量</el-button>
          </div>
          <div class="var-hint">提示：可在用户提示词中用 <code v-pre>{{变量名}}</code> 引用</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="isSaving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { dbService } from '@/services/database'
import type { PromptTemplate } from '@/types'

const list = ref<PromptTemplate[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const showDialog = ref(false)
const editId = ref<number | null>(null)
const showVarInput = ref(false)
const newVar = ref('')
const varInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: '',
  systemPrompt: '',
  userPromptTemplate: '',
  variables: [] as string[],
})

async function loadList() {
  isLoading.value = true
  try {
    list.value = await dbService.getAllPromptTemplates()
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  form.name = ''
  form.systemPrompt = ''
  form.userPromptTemplate = ''
  form.variables = []
  showVarInput.value = false
  newVar.value = ''
}

function handleCreate() {
  editId.value = null
  resetForm()
  showDialog.value = true
}

function handleEdit(row: PromptTemplate) {
  editId.value = row.id!
  form.name = row.name
  form.systemPrompt = row.systemPrompt
  form.userPromptTemplate = row.userPromptTemplate
  form.variables = [...row.variables]
  showDialog.value = true
}

async function handleDelete(row: PromptTemplate) {
  await ElMessageBox.confirm(`确定删除「${row.name}」吗？`, '删除确认', { type: 'warning' })
  await dbService.deletePromptTemplate(row.id!)
  ElMessage.success('删除成功')
  await loadList()
}

async function handleSave() {
  if (!form.name.trim()) {
    ElMessage.warning('请输入模板名称')
    return
  }
  isSaving.value = true
  try {
    const data: PromptTemplate = { ...form }
    if (editId.value) {
      await dbService.updatePromptTemplate(editId.value, data)
    } else {
      await dbService.createPromptTemplate(data)
    }
    ElMessage.success('保存成功')
    showDialog.value = false
    await loadList()
  } finally {
    isSaving.value = false
  }
}

function addVar() {
  const v = newVar.value.trim()
  if (v && !form.variables.includes(v)) {
    form.variables.push(v)
  }
  newVar.value = ''
  showVarInput.value = false
}

function removeVar(idx: number) {
  form.variables.splice(idx, 1)
}

onMounted(() => loadList())
</script>

<style scoped lang="scss">
.prompt-templates {
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

.toolbar-title {
  font-size: 15px;
  font-weight: 600;
}

.table-card {
  :deep(.el-card__body) { padding: 0; }
}

.vars-editor {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.var-hint {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}
</style>
