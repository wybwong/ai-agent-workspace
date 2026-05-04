<template>
  <div v-if="isLoading" class="loading-mask">
    <el-icon class="is-loading" :size="32"><Loading /></el-icon>
  </div>

  <div v-else class="recipe-edit">
    <!-- 左侧编辑表单 -->
    <div class="edit-panel">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>编辑配方</span>
            <div class="header-actions">
              <el-button size="small" @click="router.back()">返回</el-button>
              <el-button size="small" type="primary" :loading="isSaving" @click="handleSave">保存</el-button>
            </div>
          </div>
        </template>

        <el-form :model="form" label-width="90px" size="small">
          <el-form-item label="配方名称">
            <el-input v-model="form.title" />
          </el-form-item>

          <el-form-item label="适用月龄">
            <el-input v-model="form.age" placeholder="如：6M+" />
          </el-form-item>

          <el-form-item label="卖点">
            <el-input v-model="form.sellPoint" />
          </el-form-item>

          <el-form-item label="功效描述">
            <el-input v-model="form.functionDesc" type="textarea" :rows="2" />
          </el-form-item>

          <el-form-item label="主题颜色">
            <el-select v-model="form.themeColor" placeholder="选择颜色">
              <el-option
                v-for="t in THEME_COLORS"
                :key="t.name"
                :label="t.name"
                :value="t.name"
              >
                <span class="color-option">
                  <span class="color-dot" :style="{ background: t.value }" />
                  {{ t.name }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="水印文字">
            <el-input v-model="form.watermarkText" />
          </el-form-item>

          <!-- 食材列表 -->
          <el-form-item label="食材">
            <div class="ingredients-editor">
              <div
                v-for="(ing, idx) in form.ingredients"
                :key="idx"
                class="ing-row"
              >
                <el-input v-model="ing.name" placeholder="食材名" style="flex: 1" size="small" />
                <el-input v-model="ing.amount" placeholder="用量" style="width: 90px" size="small" />
                <el-button
                  size="small"
                  type="danger"
                  plain
                  :icon="Delete"
                  circle
                  @click="removeIngredient(idx)"
                />
              </div>
              <el-button size="small" @click="addIngredient">+ 添加食材</el-button>
            </div>
          </el-form-item>

          <!-- 步骤列表 -->
          <el-form-item label="步骤">
            <div class="steps-editor">
              <div
                v-for="(step, idx) in form.steps"
                :key="idx"
                class="step-row"
              >
                <span class="step-num">{{ idx + 1 }}</span>
                <el-input
                  v-model="form.steps[idx]"
                  type="textarea"
                  :rows="2"
                  :placeholder="`步骤 ${idx + 1}`"
                  resize="none"
                  style="flex: 1"
                  size="small"
                />
                <el-button
                  size="small"
                  type="danger"
                  plain
                  :icon="Delete"
                  circle
                  @click="removeStep(idx)"
                />
              </div>
              <el-button size="small" @click="addStep">+ 添加步骤</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 右侧海报实时预览（sticky） -->
    <div class="preview-panel">
      <div class="preview-sticky">
        <div class="preview-title">海报预览</div>
        <PosterPreview :recipe="previewRecipe" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, Delete } from '@element-plus/icons-vue'
import { dbService } from '@/services/database'
import { THEME_COLORS, DEFAULT_THEME } from '@/constants/themes'
import PosterPreview from '@/components/poster/PosterPreview.vue'
import type { Recipe, Ingredient } from '@/types'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const isSaving = ref(false)

const form = reactive<Recipe>({
  title: '',
  age: '',
  sellPoint: '',
  functionDesc: '',
  themeColor: DEFAULT_THEME.name,
  ingredients: [],
  steps: [],
  rawText: '',
  watermarkText: '禾禾妈妈',
  backgroundUrl: '',
})

const previewRecipe = computed<Recipe>(() => ({ ...form }))

function addIngredient() {
  form.ingredients.push({ name: '', amount: '' })
}

function removeIngredient(idx: number) {
  form.ingredients.splice(idx, 1)
}

function addStep() {
  form.steps.push('')
}

function removeStep(idx: number) {
  form.steps.splice(idx, 1)
}

async function loadRecipe() {
  const id = Number(route.params.id)
  if (!id) {
    isLoading.value = false
    return
  }
  try {
    const recipe = await dbService.getRecipeById(id)
    if (recipe) {
      Object.assign(form, recipe)
    }
  } finally {
    isLoading.value = false
  }
}

async function handleSave() {
  isSaving.value = true
  try {
    const id = Number(route.params.id)
    if (id) {
      await dbService.updateRecipe(id, { ...form })
    } else {
      await dbService.createRecipe({ ...form })
    }
    ElMessage.success('保存成功')
  } finally {
    isSaving.value = false
  }
}

// 自动保存（防抖 1.5s）
let saveTimer: ReturnType<typeof setTimeout> | null = null
watch(form, () => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const id = Number(route.params.id)
    if (id) handleSave()
  }, 1500)
}, { deep: true })

onMounted(() => {
  loadRecipe()
})
</script>

<style scoped lang="scss">
.loading-mask {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.recipe-edit {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
  align-items: start;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.ingredients-editor,
.steps-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.ing-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.step-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.preview-panel {
  min-width: 0;
}

.preview-sticky {
  position: sticky;
  top: 20px;
}

.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
}
</style>
