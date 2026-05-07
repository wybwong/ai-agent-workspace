<template>
  <div class="base-table">
    <el-table
      v-loading="loading"
      :data="data"
      border
      stripe
      style="width: 100%"
      v-bind="$attrs"
    >
      <template v-for="col in columns" :key="col.prop || col.type">
        <el-table-column v-bind="col">
          <template v-if="col.slot" #default="scope">
            <slot :name="col.slot" v-bind="scope" />
          </template>
        </el-table-column>
      </template>
      <el-table-column v-if="$slots.action" label="操作" :width="actionWidth" fixed="right">
        <template #default="scope">
          <slot name="action" v-bind="scope" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="emit('page-change', $event)"
        @size-change="emit('size-change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TableColumn {
  prop?: string
  label?: string
  type?: string
  width?: string | number
  minWidth?: string | number
  fixed?: string | boolean
  align?: string
  formatter?: (row: unknown, col: unknown, val: unknown) => string
  slot?: string
}

const props = withDefaults(defineProps<{
  columns: TableColumn[]
  data: unknown[]
  loading?: boolean
  total?: number
  pagination?: { page: number; pageSize: number }
  actionWidth?: number
}>(), {
  loading: false,
  total: 0,
  actionWidth: 160
})

const emit = defineEmits<{
  'page-change': [page: number]
  'size-change': [size: number]
}>()

const currentPage = computed({
  get: () => props.pagination?.page || 1,
  set: () => {}
})

const pageSize = computed({
  get: () => props.pagination?.pageSize || 10,
  set: () => {}
})
</script>

<style lang="scss" scoped>
.base-table {
  .pagination-wrap {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0 0;
  }
}
</style>
