# SKILL.md — Pinia 状态管理模式

## 技能名称
state-management

## 用途
为 Vue 3 + Pinia 项目提供可复用的状态管理模式，包含：模块化组织、本地持久化、跨 store 通信。

## 适用场景
- 项目状态较复杂，多个 store 需要协作
- 需要刷新后保留状态（如用户偏好、购物车）
- 需要统一管理全局加载/错误状态

## 子文件
- [store-template.js](./store-template.js) — 标准 Store 模板（Setup 写法）
- [persist-plugin.js](./persist-plugin.js) — 轻量 localStorage 持久化插件
- [global-state.js](./global-state.js) — 全局 UI 状态 Store（loading/sidebar/notification）

## 推荐目录结构

```
src/stores/
├── index.js          # 统一导出（可选）
├── user.js           # 用户/鉴权状态（已在模板中）
├── app.js            # 应用全局 UI 状态（sidebar/theme/locale）
└── modules/          # 业务模块 store（按需添加）
    ├── order.js
    └── product.js
```

## 命名约定
- Store 文件名：小写短横线（`user-order.js`）
- Store ID：驼峰（`useOrderStore`）
- 返回值：全量 return（不隐藏内部状态，方便 devtools 调试）

## 持久化选项
1. **轻量方案**（推荐）：使用本目录的 `persist-plugin.js`
2. **完整方案**：安装 `pinia-plugin-persistedstate`（npm i pinia-plugin-persistedstate）

## 版本与来源
- 版本：1.0.0
- 创建日期：2026-05-05
- 来源：Hermes-Core 根据 Pinia 官方文档 + v3-admin-vite 实战经验整理
