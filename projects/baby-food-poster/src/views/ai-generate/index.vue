<template>
  <div class="ai-generate">
    <el-row :gutter="20">
      <!-- 左侧：配置区 -->
      <el-col :span="12">
        <el-card class="config-card">
          <template #header><span>AI 生成配方</span></template>

          <el-form label-width="90px" size="small">
            <!-- 选模板 -->
            <el-form-item label="提示词模板">
              <el-select
                v-model="selectedTemplateId"
                placeholder="选择模板"
                style="width: 100%"
                @change="handleTemplateChange"
              >
                <el-option
                  v-for="t in templateList"
                  :key="t.id"
                  :label="t.name"
                  :value="t.id"
                />
              </el-select>
            </el-form-item>

            <!-- 动态变量 -->
            <template v-if="currentTemplate">
              <el-form-item
                v-for="varName in currentTemplate.variables"
                :key="varName"
                :label="varName"
              >
                <el-input v-model="variableValues[varName]" :placeholder="`请输入 ${varName}`" />
              </el-form-item>
            </template>

            <!-- AI API 相关 -->
            <el-divider>AI 接口配置</el-divider>
            <el-form-item label="API Key">
              <el-input v-model="apiKey" type="password" placeholder="sk-..." show-password />
            </el-form-item>
            <el-form-item label="API URL">
              <el-input v-model="apiUrl" placeholder="https://api.openai.com/v1/chat/completions" />
            </el-form-item>
            <el-form-item label="模型">
              <el-input v-model="modelName" placeholder="gpt-4o-mini" />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="isGenerating"
                :disabled="!currentTemplate || !apiKey"
                @click="handleGenerate"
                style="width: 100%"
              >
                {{ isGenerating ? '生成中...' : '开始生成' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：结果预览 -->
      <el-col :span="12">
        <el-card class="result-card">
          <template #header>
            <div class="result-header">
              <span>生成结果</span>
              <el-button
                v-if="parsedResult"
                size="small"
                type="success"
                @click="handleSave"
                :loading="isSaving"
              >
                保存为配方
              </el-button>
            </div>
          </template>

          <!-- 原始返回文本 -->
          <div v-if="rawResult" class="raw-result">
            <el-input
              v-model="rawResult"
              type="textarea"
              :rows="8"
              resize="none"
              readonly
            />
            <el-button size="small" style="margin-top: 8px" @click="handleParseResult">
              解析文本 →
            </el-button>
          </div>

          <!-- 海报预览 -->
          <div v-if="parsedResult" class="poster-preview-wrap">
            <PosterPreview :recipe="parsedResult" />
          </div>

          <el-empty v-if="!rawResult && !parsedResult" description="点击「开始生成」生成配方" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { dbService } from '@/services/database'
import { parseRecipeText } from '@/utils/parser'
import PosterPreview from '@/components/poster/PosterPreview.vue'
import type { PromptTemplate, Recipe } from '@/types'

const templateList = ref<PromptTemplate[]>([])
const selectedTemplateId = ref<number | null>(null)
const variableValues = reactive<Record<string, string>>({})
const rawResult = ref('')
const parsedResult = ref<Recipe | null>(null)
const isGenerating = ref(false)
const isSaving = ref(false)

const apiKey = ref('')
const apiUrl = ref('https://api.openai.com/v1/chat/completions')
const modelName = ref('gpt-4o-mini')

const currentTemplate = computed<PromptTemplate | null>(() => {
  if (!selectedTemplateId.value) return null
  return templateList.value.find(t => t.id === selectedTemplateId.value) ?? null
})

function handleTemplateChange() {
  const tpl = currentTemplate.value
  if (!tpl) return
  tpl.variables.forEach(v => {
    if (!variableValues[v]) variableValues[v] = ''
  })
}

function buildPrompt(): string {
  if (!currentTemplate.value) return ''
  let tpl = currentTemplate.value.userPromptTemplate
  for (const [k, v] of Object.entries(variableValues)) {
    tpl = tpl.replaceAll(`{{${k}}}`, v)
  }
  return tpl
}

async function handleGenerate() {
  if (!currentTemplate.value || !apiKey.value) return
  isGenerating.value = true
  rawResult.value = ''
  parsedResult.value = null
  try {
    const res = await fetch(apiUrl.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.value}`,
      },
      body: JSON.stringify({
        model: modelName.value,
        messages: [
          { role: 'system', content: currentTemplate.value.systemPrompt },
          { role: 'user', content: buildPrompt() },
        ],
        temperature: 0.7,
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    rawResult.value = data.choices?.[0]?.message?.content ?? ''
    if (rawResult.value) handleParseResult()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '未知错误'
    ElMessage.error(`生成失败：${msg}`)
  } finally {
    isGenerating.value = false
  }
}

function handleParseResult() {
  if (!rawResult.value.trim()) return
  parsedResult.value = parseRecipeText(rawResult.value)
}

async function handleSave() {
  if (!parsedResult.value) return
  isSaving.value = true
  try {
    await dbService.createRecipe({ ...parsedResult.value, rawText: rawResult.value })
    ElMessage.success('配方已保存')
  } finally {
    isSaving.value = false
  }
}

async function loadSettings() {
  const key = await dbService.getSetting('aiApiKey')
  const url = await dbService.getSetting('aiApiUrl')
  const model = await dbService.getSetting('aiModel')
  if (key) apiKey.value = key
  if (url) apiUrl.value = url
  if (model) modelName.value = model
}

onMounted(async () => {
  templateList.value = await dbService.getAllPromptTemplates()
  await loadSettings()
})
</script>

<style scoped lang="scss">
.ai-generate {
  padding: 20px;
}

.config-card,
.result-card {
  height: 100%;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.raw-result {
  margin-bottom: 16px;
}

.poster-preview-wrap {
  display: flex;
  justify-content: center;
}
</style>
