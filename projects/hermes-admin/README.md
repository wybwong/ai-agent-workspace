# Hermes Admin

基于 Vue 3 + Element Plus + TypeScript 的现代后台管理系统。

## 技术栈

- **框架**: Vue 3 + TypeScript + Vite
- **UI**: Element Plus + @element-plus/icons-vue
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由**: Vue Router 4 (Hash 模式)
- **样式**: SCSS
- **HTTP**: Axios (Mock 模式)

## 快速开始

```bash
npm install
npm run dev
```

## 账号

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | 123456 | 超级管理员 |
| editor | 123456 | 编辑员 |

## 功能

- 登录/退出 (Mock 鉴权)
- 动态路由 (按角色过滤)
- 用户管理 CRUD
- 角色管理 CRUD
- 菜单管理 CRUD (树形)
- 标签页视图 (右键菜单)
- 明/暗主题切换
- 响应式侧边栏
