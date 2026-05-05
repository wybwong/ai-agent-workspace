# SKILL.md — Axios HTTP 请求模式

## 技能名称
api-patterns

## 用途
在 Vue 3 + Vite 项目中封装高质量的 HTTP 请求层，包含：错误处理、请求取消、并发控制、接口模块化。
适用于超出 vue3-vite-starter 基础模板需求的中大型项目。

## 适用场景
- 需要请求防抖/取消（搜索输入联想、重复提交防护）
- 需要并发请求合并（Promise.all 封装）
- 需要上传进度反馈
- 需要接口级别的 loading 状态管理

## 子文件
- [request.js](./request.js) — 完整 axios 实例（含 token 刷新已内置在 vue3-vite-starter 模板，此为独立版本）
- [useRequest.js](./useRequest.js) — Composable：loading/error/data 状态封装
- [cancel-request.js](./cancel-request.js) — 基于 AbortController 的请求取消模式

## 调用时机
1. 直接使用 `vue3-vite-starter` 模板时已内置基础版本，无需额外引用
2. 需要以下增强功能时引用此技能的对应文件：
   - 复杂 loading 状态：用 `useRequest.js`
   - 请求取消（搜索防抖）：用 `cancel-request.js`

## 版本与来源
- 版本：1.0.0
- 创建日期：2026-05-05
- 来源：Hermes-Core 根据 Vue 3 最佳实践整理
