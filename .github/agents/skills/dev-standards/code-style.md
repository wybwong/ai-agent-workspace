# 代码风格规范

> 参考：v3-admin-vite / vue-element-plus-admin

## Vue 组件规范

### 1. 统一使用 `<script setup>` 语法

```vue
<!-- ✅ 正确 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<!-- ❌ 禁止 options API（新代码） -->
<script>
export default { data() { return { count: 0 } } }
</script>
```

### 2. 模板结构顺序

```vue
<template>...</template>

<script setup>...</script>

<style scoped>...</style>
```

### 3. Props 必须定义类型和默认值

```js
// ✅
const props = defineProps({
  id: { type: Number, default: null },
  visible: { type: Boolean, default: false },
})

// ❌
const props = defineProps(['id', 'visible'])
```

### 4. Emit 必须声明

```js
const emit = defineEmits(['update:modelValue', 'success', 'cancel'])
```

### 5. 组件内逻辑顺序（统一约定）

```js
// 1. imports
// 2. props / emits / defineExpose
// 3. store / router / route
// 4. refs / reactive data
// 5. computed
// 6. watch
// 7. lifecycle hooks（onMounted 等）
// 8. methods（先 handle 系，后工具函数）
```

---

## JavaScript 规范

### 基本规则

- 缩进：**2 空格**（禁止 Tab）
- 引号：**单引号**（模板字符串除外）
- 末尾不加分号（与 v3-admin-vite 保持一致）
- 箭头函数优先

### 禁止事项

```js
// ❌ 禁止 var
var name = 'test'

// ❌ 禁止 == 比较（用 ===）
if (a == null) {}

// ❌ 禁止 console.log 留存在提交代码中
console.log('debug')

// ❌ 禁止魔法数字，应提取为常量
if (status === 2) {}  // 2 是什么？

// ✅
const STATUS_DISABLED = 2
if (status === STATUS_DISABLED) {}
```

### 异步处理

```js
// ✅ async/await + try/finally 控制 loading
async function loadList() {
  loading.value = true
  try {
    const res = await getList(params)
    list.value = res.data
  } finally {
    loading.value = false
  }
}

// ❌ 禁止裸 .then().catch() 嵌套
```

---

## CSS / 样式规范

- 组件内样式**必须加 `scoped`**
- 颜色值**必须使用 CSS 变量**，禁止硬编码
- 优先使用 Element UI Plus 内置间距变量

```scss
// ✅
.card {
  padding: var(--el-card-padding);
  color: var(--el-text-color-primary);
}

// ❌
.card {
  padding: 16px;
  color: #303133;
}
```

---

## 接口调用规范

- 所有请求**必须通过 `src/utils/request.js` 封装**，禁止直接 `fetch` 或裸 `axios`
- 接口函数放在 `src/api/modules/` 下，**禁止在组件内直接写请求逻辑**
- 错误处理统一在拦截器中，组件内只处理业务逻辑

---

## 注释规范

- **逻辑注释**：只写"为什么"，不写"做什么"（代码本身就是"做什么"）
- **函数注释**：仅对复杂/非自明的函数添加，简单函数不需要
- **禁止**：大段废弃代码注释提交（删掉，git 有记录）

```js
// ✅ 解释原因
// Element Plus 的 el-table 在数据更新后需要手动触发重新布局
nextTick(() => tableRef.value?.doLayout())

// ❌ 废话注释
// 获取列表数据
const getList = async () => { ... }
```
