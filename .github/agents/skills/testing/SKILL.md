# SKILL.md — 前端测试规范

## 技能名称
testing

## 用途
Vue 3 + Vite 项目的测试工具配置与编写规范，使用 Vitest + Vue Test Utils。

## 子文件
- [vitest.config.js](./vitest.config.js) — 测试配置文件
- [test-standards.md](./test-standards.md) — 测试编写规范与示例

## 测试栈
- **Vitest** — 测试运行器（与 Vite 深度集成，速度快）
- **@vue/test-utils** — Vue 组件测试工具
- **@testing-library/vue** — 更贴近用户行为的组件测试
- **msw** — 接口 Mock（测试环境推荐）

## 安装
```bash
npm install vitest @vue/test-utils @testing-library/vue jsdom -D
```

## 版本与来源
- 版本：1.0.0
- 创建日期：2026-05-04
