# baby-food-poster — 项目追踪

## 基本信息
- 客户：个人项目
- 开始日期：2026-05-04
- 部署方式：待定
- 技术栈：Vue 3 + Vite + TypeScript + Element UI Plus

## 需求概述
婴幼儿辅食海报生成工具，支持食谱管理、海报设计与导出。

## MVP 功能清单
- [x] 项目骨架搭建（Vue 3 + TS + Vite + Element UI Plus）
- [x] 路由配置（多视图：食谱/海报/AI生成/设置）
- [ ] 食谱管理 CRUD（增删改查）
- [ ] 海报模板设计与渲染
- [ ] AI 内容生成集成
- [ ] 海报导出（PNG/PDF）
- [ ] 本地数据持久化（sql.js）

## 技术决策
- 前端：Vue 3 + Vite + TypeScript + Element UI Plus
- 数据层：sql.js（本地 SQLite，无需后端）
- 图片导出：dom-to-image-more
- 接口：无后端，纯前端本地方案

## 当前状态
- 🚧 进行中（骨架完成，功能待开发）

## 重要节点
- 2026-05-04：项目创建，基础骨架搭建完成

## 遗留问题 / 待确认
- 海报模板设计方案（画布 vs DOM 方案）
- AI 生成接入哪个 API（OpenAI / 本地模型）
- 是否需要云同步功能
