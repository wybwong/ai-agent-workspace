<template>
  <div class="recipe-list">
    <!-- 顶部操作栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <el-input
          v-model="searchText"
          placeholder="搜索配方名称..."
          clearable
          style="width: 260px"
          @input="handleSearch"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>新建配方
        </el-button>
      </div>
    </el-card>

    <!-- 列表 -->
    <el-card class="table-card">
      <el-table
        :data="filteredList"
        :loading="isLoading"
        row-key="id"
        stripe
      >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="主题色" width="80">
          <template #default="{ row }">
            <div class="color-dot-wrap">
              <span
                class="color-dot"
                :style="{ background: getThemeByName(row.themeColor)?.value }"
              />
              <span>{{ row.themeColor }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="配方名称" min-width="180" />
        <el-table-column prop="age" label="适用月龄" width="110" />
        <el-table-column prop="sellPoint" label="卖点" min-width="160" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建弹窗：粘贴文本 → 解析 → 保存 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建配方"
      width="600px"
      @close="handleDialogClose"
    >
      <el-steps :active="createStep" finish-status="success" simple style="margin-bottom: 24px">
        <el-step title="粘贴文本" />
        <el-step title="解析预览" />
        <el-step title="保存" />
      </el-steps>

      <!-- Step 0: 粘贴文本 -->
      <div v-if="createStep === 0">
        <el-input
          v-model="rawText"
          type="textarea"
          :rows="10"
          placeholder="请粘贴配方原始文本..."
          resize="none"
        />
        <div class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" :disabled="!rawText.trim()" @click="handleParse">解析</el-button>
        </div>
      </div>

      <!-- Step 1: 解析预览 -->
      <div v-else-if="createStep === 1">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="配方名称">{{ parsedRecipe?.title }}</el-descriptions-item>
          <el-descriptions-item label="适用月龄">{{ parsedRecipe?.age }}</el-descriptions-item>
          <el-descriptions-item label="卖点" :span="2">{{ parsedRecipe?.sellPoint }}</el-descriptions-item>
          <el-descriptions-item label="功效" :span="2">{{ parsedRecipe?.functionDesc }}</el-descriptions-item>
          <el-descriptions-item label="主题色">{{ parsedRecipe?.themeColor }}</el-descriptions-item>
          <el-descriptions-item label="食材数量">{{ parsedRecipe?.ingredients?.length }} 种</el-descriptions-item>
          <el-descriptions-item label="步骤数量">{{ parsedRecipe?.steps?.length }} 步</el-descriptions-item>
        </el-descriptions>
        <div class="dialog-footer">
          <el-button @click="createStep = 0">返回</el-button>
          <el-button type="primary" :loading="isSaving" @click="handleSave">保存配方</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { dbService } from '@/services/database'
import { parseRecipeText } from '@/utils/parser'
import { getThemeByName } from '@/constants/themes'
import type { Recipe } from '@/types'

const router = useRouter()

const recipeList = ref<Recipe[]>([])
const searchText = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const showCreateDialog = ref(false)
const createStep = ref(0)
const rawText = ref('')
const parsedRecipe = ref<Recipe | null>(null)

const filteredList = computed(() => {
  if (!searchText.value.trim()) return recipeList.value
  const kw = searchText.value.toLowerCase()
  return recipeList.value.filter(r => r.title.toLowerCase().includes(kw))
})

async function loadList() {
  isLoading.value = true
  try {
    recipeList.value = await dbService.getAllRecipes()
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  // computed 自动响应，无需手动处理
}

function handleEdit(id: number | undefined) {
  if (!id) return
  router.push(`/recipes/${id}/edit`)
}

async function handleDelete(row: Recipe) {
  await ElMessageBox.confirm(`确定删除「${row.title}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await dbService.deleteRecipe(row.id!)
  ElMessage.success('删除成功')
  await loadList()
}

function handleParse() {
  if (!rawText.value.trim()) return
  parsedRecipe.value = parseRecipeText(rawText.value)
  createStep.value = 1
}

async function handleSave() {
  if (!parsedRecipe.value) return
  isSaving.value = true
  try {
    await dbService.createRecipe({ ...parsedRecipe.value, rawText: rawText.value })
    ElMessage.success('保存成功')
    showCreateDialog.value = false
    await loadList()
  } finally {
    isSaving.value = false
  }
}

function handleDialogClose() {
  createStep.value = 0
  rawText.value = ''
  parsedRecipe.value = null
}

onMounted(() => {
  loadList()
})
</script>

<style scoped lang="scss">
.recipe-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar-card {
  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-card {
  :deep(.el-card__body) {
    padding: 0;
  }
}

.color-dot-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
</style>
