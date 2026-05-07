<template>
  <el-dialog
    :title="data ? '编辑菜单' : '新增菜单'"
    v-model="visible"
    width="560px"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="上级菜单">
        <el-select v-model="form.parentId" placeholder="请选择上级菜单（不选为顶级）" clearable style="width:100%">
          <el-option label="顶级目录" :value="0" />
          <el-option v-for="m in menuOptions" :key="m.id" :label="m.name" :value="m.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :value="0">目录</el-radio>
          <el-radio :value="1">菜单</el-radio>
          <el-radio :value="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="图标" v-if="form.type !== 2">
        <el-input v-model="form.icon" placeholder="Element Plus icon name" />
      </el-form-item>
      <el-form-item label="路由路径" v-if="form.type !== 2" prop="path">
        <el-input v-model="form.path" placeholder="/system/user" />
      </el-form-item>
      <el-form-item label="组件路径" v-if="form.type === 1">
        <el-input v-model="form.component" placeholder="system/user/index" />
      </el-form-item>
      <el-form-item label="权限标识" v-if="form.type !== 0">
        <el-input v-model="form.permission" placeholder="system:user:list" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" :min="0" :max="999" />
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
import type { MenuItem } from '@/types'
import { createMenuApi, updateMenuApi } from '@/api/modules/menu'

const props = defineProps<{
  modelValue: boolean
  data: MenuItem | null
  menuOptions: MenuItem[]
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
  parentId: 0,
  name: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  type: 1 as 0 | 1 | 2,
  status: 1 as 0 | 1,
  permission: ''
})

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }]
}

watch(() => props.data, (val) => {
  if (val) {
    Object.assign(form, {
      parentId: val.parentId,
      name: val.name,
      path: val.path,
      component: val.component,
      icon: val.icon,
      sort: val.sort,
      type: val.type,
      status: val.status,
      permission: val.permission
    })
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.parentId = 0
  form.name = ''
  form.path = ''
  form.component = ''
  form.icon = ''
  form.sort = 0
  form.type = 1
  form.status = 1
  form.permission = ''
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      if (props.data) {
        await updateMenuApi(props.data.id, form)
        ElMessage.success('更新成功')
      } else {
        await createMenuApi(form)
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
