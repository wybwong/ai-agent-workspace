# MEMORY.md — 长期记忆与历史决策

## 使用说明

- 只记录可复用、对未来决策有价值的信息
- 每条记录尽量包含背景、决策、原因、影响
- 临时任务与短期待办不写入本文件

## 长期决策记录

### 2026-05-04：建立智能体基础记忆体系

- 背景：仓库已定义 AGENTS 规范，需要落地配套记忆文件
- 决策：创建 IDENTITY / SOUL / USER / MEMORY 四个核心文件
- 原因：确保身份、原则、用户偏好和长期决策分层管理
- 影响：后续会话可稳定继承上下文，减少重复沟通成本

### 技术栈与部署

- 前端技术栈：Vue 3 + Vite + Element UI Plus
- 静态站点部署：GitHub Pages（默认方案）
- PR 要求：自动生成的 PR 必须包含测试覆盖率报告

## 常用工程约定

- 文件缩进：2 空格
- API 设计：RESTful + JSON 结构

## 经验总结与风险提醒

- GitHub Actions 独立环境部署时须确保 Node 版本与项目要求一致
- 所有 SQL 查询必须使用参数化查询，禁止字符串拼接，防止注入风险


### 2026-05-04：确立前端开发规范体系

- 背景：用户希望参考成熟开源项目，固化开发标准，避免每次从头设计
- 决策：以 v3-admin-vite / vue-element-plus-admin 为参考，提炼为 skills/dev-standards/
- 原因：开源项目经过大量实战验证，规范成熟、社区认可度高
- 影响：所有后续 Vue 3 项目必须严格遵循此规范，不允许个人风格覆盖
- 规范位置：.github/agents/skills/dev-standards/（目录结构/命名/代码风格/Git）


### 2026-05-04：完善智能体工作空间技能库

- 背景：评估现有体系后发现缺少项目启动SOP、权限方案、CI/CD、测试规范等关键技能
- 决策：按优先级创建 project-starter / auth-pattern / ci-cd / testing 四个技能
- 新增机制：skills/INDEX.md 技能索引、projects/ 项目追踪、daily-sessions/ 临时记录
- 影响：智能体体系基本完整，后续接到项目可全流程闭环执行

## 可复用模式

- 记忆更新触发条件：任务产生关键决策、用户偏好、可复用经验
- 任务收尾动作：完成后检查是否需要更新 USER 或 MEMORY

### 2026-05-04：vue3-vite-starter 模板完善与验证

- 背景：模板初版能构建但缺少 Layout/登录页/404，实际使用会立刻遇到空白页面
- 决策：补全 BasicLayout.vue（可折叠侧边栏+顶栏）、login/index.vue、error/404.vue，重构 router 为嵌套路由结构
- 额外安装：`sass-embedded`、`@element-plus/icons-vue`
- 验证结果：`npm run build` 通过（1735 modules，7.58s），公网预览访问正常
- 影响：模板升级为 v1.1.0，状态从"待验证"升为"✅ 稳定可用"，可直接复制投入实际项目

### 2026-05-04：多编辑器智能体入口文件覆盖

- 背景：智能体规则只在 .github/agents/ 内，新对话需手动引用，不够自动
- 决策：在根目录创建各编辑器标准入口文件
- 覆盖范围：AGENTS.md（Copilot/Trae/Windsurf）、CLAUDE.md（Claude Code）、.cursorrules（Cursor）、.codebuddy/AGENTS.md（Codebuddy）
- 影响：所有主流 AI 编辑器打开此仓库时自动加载 Hermes-Core 身份和工作规则

## 复查清单

- 是否有可迁移到模板或工具的重复流程
- 是否有过时规则需要修订
- 是否遗漏了关键背景导致后续理解断层

### 2026-05-04：集成 Vitest 测试 + GitHub Actions CI

- 背景：testing 和 ci-cd 两个技能停留在"待验证"状态，模板缺少测试能力
- 决策：
  1. vue3-vite-starter 模板集成 Vitest（vitest.config.js + 示例测试 + package.json scripts）
  2. 工作区根目录添加 `.github/workflows/ci.yml`，自动验证模板构建与测试
- 影响：
  - 模板升级为 v1.2.0，内置完整测试闭环
  - ci-cd 技能状态升为 ✅，testing 技能状态升为 ✅
  - auth-pattern 仍为 🔧（代码完整，但尚未在实际项目中验证）
- 待办：下次接到实际项目时，用 auth-pattern 技能落地并标记为 ✅
