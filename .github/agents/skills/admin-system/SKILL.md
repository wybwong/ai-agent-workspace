# SKILL.md — 后台管理系统快速开发规范

## 技能名称
admin-system

## 用途
从零到可用后台管理系统的完整开发规范与启动模板。  
参考 [v3-admin-vite](https://github.com/un-pany/v3-admin-vite) 和 [vue-element-plus-admin](https://github.com/kailong321200875/vue-element-plus-admin) 提炼。

接到后台管理系统需求时，**按本技能流程逐步执行**，可在 30 分钟内完成基础框架搭建。

## 子文件

| 文件 | 内容 |
|------|------|
| [directory-structure.md](./directory-structure.md) | 目录结构规范与每个目录的职责说明 |
| [quick-start.md](./quick-start.md) | 新项目 30 分钟启动 SOP |
| [page-patterns.md](./page-patterns.md) | 典型页面写法（列表/表单/详情/弹窗） |
| [lessons-learned.md](./lessons-learned.md) | 从 baby-food-poster 总结的实战经验 |

## 技术栈

- **框架**：Vue 3 + TypeScript + Vite
- **UI**：Element Plus + @element-plus/icons-vue
- **状态**：Pinia（+ pinia-plugin-persistedstate）
- **路由**：Vue Router 4（HashHistory 用于静态部署）
- **HTTP**：Axios（含拦截器封装）
- **样式**：SCSS（变量驱动主题）
- **代码规范**：ESLint + Prettier（可选但推荐）

## 版本与来源

- 版本：1.0.0
- 创建日期：2026-05-06
- 参考来源：
  - [v3-admin-vite](https://github.com/un-pany/v3-admin-vite)（结构参考）
  - [vue-element-plus-admin](https://github.com/kailong321200875/vue-element-plus-admin)（权限/布局参考）
  - baby-food-poster 实战经验
