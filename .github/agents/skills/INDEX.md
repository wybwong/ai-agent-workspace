# 技能索引 — Skills INDEX

> 每次新增技能后，必须在此文件追加一条记录。

## 快速查找

| 技能名 | 用途 | 调用时机 |
|--------|------|----------|
| [vue3-vite-starter](./vue3-vite-starter/SKILL.md) | Vue 3 + Vite + Element UI Plus 项目模板 | 每次新建前端项目 |
| [dev-standards](./dev-standards/SKILL.md) | 前端开发规范（目录/命名/代码/Git） | 项目启动时对照检查，开发中随时查阅 |
| [project-starter](./project-starter/SKILL.md) | 新项目启动 SOP（检查清单/环境配置/Mock） | 接到新需求时第一步执行 |
| [auth-pattern](./auth-pattern/SKILL.md) | 登录鉴权通用方案（路由守卫/按钮权限/Token刷新） | 需要登录鉴权功能时 |
| [ci-cd](./ci-cd/SKILL.md) | GitHub Actions 自动构建部署 | 项目需要 CI/CD 时 |
| [testing](./testing/SKILL.md) | 前端测试规范 + Vitest 配置 | 需要写测试时 |
| [api-patterns](./api-patterns/SKILL.md) | Axios 高级模式（useRequest/请求取消/防抖） | 需要复杂 HTTP 状态管理时 |
| [state-management](./state-management/SKILL.md) | Pinia 模块化 + 持久化 + 全局 UI 状态 | 多 store 协作、需要持久化时 |
| [admin-system](./admin-system/SKILL.md) | 后台管理系统完整开发规范（目录/快速启动/页面范式/实战经验） | 开发后台管理系统时（替代 dev-standards 用于管理系统场景） |

## 使用规则

1. 接到任务 → 先在此索引中查找匹配技能
2. 有匹配技能 → 按技能文件的流程执行
3. 无匹配技能 → 自行实现后沉淀为新技能并更新此索引
4. 更新索引时保持表格格式一致

## 技能状态说明

- 稳定可用 ✅：已在实际项目中验证
- 待验证 🔧：逻辑完整但未经实战
- 草稿 📝：结构完成，细节待补充

| 技能名 | 状态 |
|--------|------|
| vue3-vite-starter | ✅ 稳定可用（v1.3.0，集成 token 刷新）|
| dev-standards | ✅ 稳定可用 |
| project-starter | ✅ 稳定可用 |
| auth-pattern | ✅ 稳定可用（路径修复，已集成进模板）|
| ci-cd | ✅ 稳定可用 |
| testing | ✅ 稳定可用 |
| api-patterns | 🔧 待验证（逻辑完整，待实战验证）|
| state-management | 🔧 待验证（逻辑完整，待实战验证）|
| admin-system | ✅ 稳定可用（v1.0.0，基于 baby-food-poster 实战经验）|
