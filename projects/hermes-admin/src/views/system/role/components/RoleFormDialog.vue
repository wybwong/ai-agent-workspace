<template>
  <el-dialog
    :title="data ? '编辑角色' : '新增角色'"
    v-model="visible"
    width="480px"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :value="1">启用</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { RoleInfo } from '@/types'
import { createRoleApi, updateRoleApi } from '@/api/modules/role'

const props = defineProps<{
  modelValue: boolean
  data: RoleInfo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  name: '',
  code: '',
  description: '',
  status: 1 as 0 | 1
})

const rules = {
  name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

watch(() => props.data, (val) => {
  if (val) {
    form.name = val.name
    form.code = val.code
    form.description = val.description
    form.status = val.status
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.name = ''
  form.code = ''
  form.description = ''
  form.status = 1
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      if (props.data) {
        await updateRoleApi(props.data.id, form)
        ElMessage.success('更新成功')
      } else {
        await createRoleApi(form)
        ElMessage.success('创建成功')
      }
      visible.value = false
      emit('success')
    } finally {
      loading.value = false
    }
  })
}
</script>
