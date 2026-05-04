<template>
  <el-dialog
    v-model="visible"
    :title="id ? '编辑' : '新增'"
    :width="width"
    :close-on-click-modal="false"
    @closed="$emit('closed')"
  >
    <slot :is-edit="!!id" />

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="$emit('confirm')">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  id: { type: [String, Number], default: null }, // 有 id = 编辑，无 id = 新增
  width: { type: String, default: '520px' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'closed'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
