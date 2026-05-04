<template>
  <div class="settings">
    <el-card style="max-width: 600px">
      <template #header><span>系统设置</span></template>

      <el-form :model="form" label-width="120px" size="small">
        <el-divider>海报设置</el-divider>
        <el-form-item label="水印文字">
          <el-input v-model="form.watermarkText" placeholder="如：禾禾妈妈" />
          <div class="field-hint">显示在海报顶部、对角水印及印章中</div>
        </el-form-item>

        <el-divider>AI 接口</el-divider>
        <el-form-item label="API Key">
          <el-input v-model="form.aiApiKey" type="password" show-password placeholder="sk-..." />
        </el-form-item>
        <el-form-item label="API URL">
          <el-input v-model="form.aiApiUrl" placeholder="https://api.openai.com/v1/chat/completions" />
        </el-form-item>
        <el-form-item label="模型">
          <el-input v-model="form.aiModel" placeholder="gpt-4o-mini" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="isSaving" @click="handleSave">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { dbService } from '@/services/database'

const isSaving = ref(false)

const form = reactive({
  watermarkText: '禾禾妈妈',
  aiApiKey: '',
  aiApiUrl: 'https://api.openai.com/v1/chat/completions',
  aiModel: 'gpt-4o-mini',
})

const SETTING_KEYS = ['watermarkText', 'aiApiKey', 'aiApiUrl', 'aiModel'] as const

async function loadSettings() {
  for (const key of SETTING_KEYS) {
    const val = await dbService.getSetting(key)
    if (val !== null) (form as Record<string, string>)[key] = val
  }
}

async function handleSave() {
  isSaving.value = true
  try {
    for (const key of SETTING_KEYS) {
      await dbService.setSetting(key, (form as Record<string, string>)[key])
    }
    ElMessage.success('设置已保存')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadSettings())
</script>

<style scoped lang="scss">
.settings {
  padding: 20px;
}

.field-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
