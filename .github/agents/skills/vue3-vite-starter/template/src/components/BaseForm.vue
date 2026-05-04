<template>
  <el-form
    ref="formRef"
    :model="model"
    :rules="rules"
    :label-width="labelWidth"
    v-bind="$attrs"
  >
    <slot />
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  model: { type: Object, required: true },
  rules: { type: Object, default: () => ({}) },
  labelWidth: { type: String, default: '100px' },
})

const formRef = ref(null)

// 暴露 validate / resetFields 给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
})
</script>
