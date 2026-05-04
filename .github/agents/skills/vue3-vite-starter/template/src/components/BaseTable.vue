<template>
  <div>
    <el-table v-loading="loading" :data="data" v-bind="$attrs" border stripe>
      <slot />
    </el-table>

    <el-pagination
      v-if="pagination.total > 0"
      class="mt-4 justify-end"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @current-change="$emit('page-change', $event)"
      @size-change="$emit('size-change', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: {
    type: Object,
    default: () => ({ page: 1, pageSize: 20, total: 0 }),
  },
})

defineEmits(['page-change', 'size-change'])
</script>
