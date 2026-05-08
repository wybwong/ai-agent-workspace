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

### 2026-05-04：自托管服务器自动部署

- 背景：用户希望每次 push main 后自动同步到自己的服务器
- 决策：使用 `burnett01/rsync-deployments@7.0.1` + SSH 密钥 实现 rsync 增量部署
- 必须配置的 GitHub Secrets（Settings → Secrets → Actions）：
  - `SERVER_HOST` — 服务器 IP 或域名
  - `SERVER_PORT` — SSH 端口（默认 22）
  - `SERVER_USER` — SSH 登录用户名
  - `SERVER_SSH_KEY` — SSH 私钥（完整内容，含 `-----BEGIN...`）
  - `DEPLOY_PATH` — 服务器上的目标目录（如 `/var/www/html/ai-agent-workspace/`）
- 工作流位置：`.github/workflows/deploy-server.yml`
- 影响：push main → CI 构建 `dist/` → rsync 同步到服务器 web 目录

### 2026-05-04：前端项目部署上线

- 背景：vue3-vite-starter 模板验证通过，需要将其部署为仓库的可访问静态站点
- 决策：将模板复制到仓库根目录，配置 GitHub Actions 自动部署到 GitHub Pages
- 关键修复：
  - `vite.config.js` 添加 `base: '/ai-agent-workspace/'`（GitHub Pages 子路径必须）
  - 路由改用 `createWebHashHistory`（GitHub Pages 不支持 history 模式 SPA 路由）
  - 添加 `.gitignore` 排除 `node_modules/` 和 `dist/`（避免提交大量构建产物）
- 部署地址：https://wybwong.github.io/ai-agent-workspace/
- 触发方式：push 到 main 分支自动触发 `.github/workflows/deploy.yml`
- 影响：仓库本身即是可线上访问的 Vue 3 管理后台示例

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

### 2026-05-05：智能体能力闭环 Sprint

- 背景：用户要求先完成智能体本身的开发，识别出所有缺失功能后统一补全
- 发现的问题：
  1. `auth-pattern/permission-directive.js` 导入路径 `@/stores/modules/user` 与模板约定 `@/stores/user` 不一致
  2. `token-refresh` 逻辑仅作为独立文件存在，未集成进模板 `api/index.js`
  3. `daily-sessions/` 目录在 AGENTS.md 中引用但实际不存在（已确认目录存在，有 README.md）
  4. `projects/baby-food-poster/` 无项目追踪 README.md
  5. 缺少 `api-patterns` 技能（高级 HTTP 模式）
  6. 缺少 `state-management` 技能（Pinia 模块化 + 持久化）
- 决策与修复：
  1. 修复 `auth-pattern/permission-directive.js` 导入路径，添加注释说明
  2. 将 token-refresh 逻辑内置到模板 `src/api/index.js`（响应拦截器中）
  3. 创建 `projects/baby-food-poster/README.md` 项目追踪文件
  4. 新增 `api-patterns` 技能（useRequest.js / cancel-request.js）
  5. 新增 `state-management` 技能（store-template.js / persist-plugin.js / global-state.js）
  6. INDEX.md 更新：auth-pattern 升为 ✅，新增两个技能
- 影响：
  - 模板升级为 v1.3.0（集成完整 token 刷新）
  - 技能库从 6 个扩充到 8 个
  - 智能体工作空间全部已知功能缺口已补全，进入闭环状态
- 下阶段重点：`api-patterns` 和 `state-management` 在实战项目中验证后升为 ✅

### 2026-05-06：baby-food-poster 完整部署流程跑通 + admin-system 技能创建

- 背景：用户要求跑通整个部署流程并从第一个项目中总结开发经验
- 现状确认：
  - 项目构建通过（1636 modules，TypeScript 零错误）
  - deploy.yml 配置正确，但 GitHub Pages 功能未在仓库 Settings 中开启，导致 deploy job 404 失败
  - **用户须手动操作**：Settings → Pages → Source → GitHub Actions（一次性配置）
- 决策与修复：
  1. 新增 `.github/workflows/ci-baby-food-poster.yml`：在 PR/push 时验证 baby-food-poster 构建（类型检查+构建）
  2. 更新 `deploy.yml`：添加 `paths` 过滤（只在项目文件或 workflow 变更时触发），节省 CI 资源
  3. 新增 `admin-system` 技能（后台管理系统全流程规范）：
     - `directory-structure.md`：完整目录树 + 每个目录的职责规则 + 快速参考表
     - `quick-start.md`：30 分钟新项目启动 SOP（脚手架/骨架/核心配置/布局框架）
     - `page-patterns.md`：列表页/表单弹窗/useTable 三大典型页面范式
     - `lessons-learned.md`：9 条 baby-food-poster 实战经验（GitHub Pages/CI/chunk/Pinia/类型等）
  4. INDEX.md 新增 admin-system 条目（✅ 稳定可用）
- 影响：
  - 技能库从 8 个扩充到 9 个
  - admin-system 是后续所有后台管理系统项目的强制参考入口
  - deploy 工作流更精准，不再因无关文件变更触发部署

### 2026-05-07：hermes-admin 完整后台管理系统落地

- 背景：admin-system 技能只有规范文档，缺少实际落地项目；用户要求按规范继续开发
- 决策：创建 `projects/hermes-admin/` 独立 Vue 3 + TypeScript + Vite 项目，55个文件全部落地
- 核心功能交付：
  1. **动态权限路由**：`permission.ts` store + `router.addRoute()` + 路由守卫 4 步流程
  2. **用户/角色/菜单管理**：完整 CRUD，内存 Mock 数据（无需后端）
  3. **TagsView 多标签页**：右键菜单（关闭当前/其他/所有），/dashboard 固定不可关闭
  4. **主题切换**：亮/暗，html.dark CSS var 覆盖，Element Plus dark CSS vars
  5. **侧边栏递归菜单**：SidebarItem.vue 递归，按权限过滤
  6. **BaseTable + useTable**：通用表格组件 + 组合式函数
  7. **v-permission 指令**：按钮级权限控制
- Mock 账号：admin/123456（全权限），editor/123456（仅 dashboard）
- CI：`.github/workflows/ci-hermes-admin.yml`（构建验证，base 路径 `/ai-agent-workspace/projects/hermes-admin/`）
- 构建验证：npm run build 零 TypeScript 错误，产物 ~1.6M
- 待完善：后端 API 对接（目前全 Mock），deploy workflow（参考 baby-food-poster 模式）

## 关键运维知识

### GitHub Pages 新项目启动必做
1. Settings → Pages → Source → GitHub Actions（手动开启，一次性）
2. vite build 加 `--base=/仓库名/子路径/`
3. router 用 `createWebHashHistory()`


## 2026-05 Hermes Admin 项目创建

- 在 `projects/hermes-admin/` 创建了完整 Vue 3 管理后台，55个文件
- 技术栈：Vue 3 + TypeScript + Vite + Element Plus + Pinia + Vue Router 4 (Hash)
- 纯 Mock 数据（无 msw），动态路由权限系统，TagsView，明暗主题
- `npm run build` 零错误验证通过，产物 1.6M
