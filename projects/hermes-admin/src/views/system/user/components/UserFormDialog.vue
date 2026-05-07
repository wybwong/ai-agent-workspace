<template>
  <el-dialog
    :title="data ? '编辑用户' : '新增用户'"
    v-model="visible"
    width="520px"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" :disabled="!!data" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
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
import type { UserInfo } from '@/types'
import { createUserApi, updateUserApi } from '@/api/modules/user'

const props = defineProps<{
  modelValue: boolean
  data: UserInfo | null
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
  username: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1 as 0 | 1
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效邮箱', trigger: 'blur' }]
}

watch(() => props.data, (val) => {
  if (val) {
    form.username = val.username
    form.nickname = val.nickname
    form.email = val.email
    form.phone = val.phone
    form.status = val.status
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.username = ''
  form.nickname = ''
  form.email = ''
  form.phone = ''
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
        await updateUserApi(props.data.id, form)
        ElMessage.success('更新成功')
      } else {
        await createUserApi({ ...form, avatar: '', roles: [], permissions: [] })
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
