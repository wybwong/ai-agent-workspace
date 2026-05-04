# 命名规范

> 参考：v3-admin-vite / vue-element-plus-admin

## 文件与目录命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 目录 | kebab-case | `user-manage/` |
| Vue 组件文件 | PascalCase | `UserList.vue` `BaseTable.vue` |
| JS/TS 工具文件 | camelCase | `formatDate.js` |
| 样式文件 | kebab-case | `variables.scss` |
| 常量文件 | kebab-case | `status-enum.js` |

## 代码内命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 组件注册名 | PascalCase | `BaseTable` `UserForm` |
| composable 函数 | useXxx | `useTable` `usePermission` |
| Pinia store | useXxxStore | `useUserStore` `useAppStore` |
| 普通函数 | camelCase 动词开头 | `getUserList` `handleDelete` |
| 事件处理函数 | handle + 动作 | `handleSubmit` `handleDelete` |
| 布尔变量 | is/has/show + 名词 | `isLoading` `hasPermission` `showDialog` |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_PAGE_SIZE` `STATUS_ENABLED` |
| CSS 类名 | kebab-case | `.user-card` `.search-form` |
| CSS 变量 | --前缀 kebab | `--el-color-primary` |

## 路由命名

- `name`：PascalCase，与组件名保持一致，如 `UserList`
- `path`：kebab-case，如 `/user-manage/list`
- `meta.title`：中文，如 `用户管理`

## API 函数命名

按 CRUD 操作统一：

```js
getXxxList(params)    // 列表
getXxxDetail(id)      // 详情
createXxx(data)       // 新增
updateXxx(id, data)   // 编辑
deleteXxx(id)         // 删除
batchDeleteXxx(ids)   // 批量删除
```

## 禁止事项

- ❌ 拼音命名（`yonghu` `liebiao`）
- ❌ 无意义缩写（`a` `temp2` `data1`）
- ❌ 组件文件使用小写（`userlist.vue`）
