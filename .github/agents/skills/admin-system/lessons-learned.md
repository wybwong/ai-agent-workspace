# 实战经验总结 — Lessons Learned from baby-food-poster

> 记录从第一个实战项目（baby-food-poster）中得到的真实教训，用于指导后续项目。

---

## 项目背景

**baby-food-poster**：婴儿辅食海报生成工具  
- 技术栈：Vue 3 + TypeScript + Vite + Element Plus + sql.js（浏览器端 SQLite）
- 部署：GitHub Pages（静态站点）
- 开发周期：约 2 个工作日

---

## 经验 1：GitHub Pages 部署必须提前确认配置

**问题**：deploy.yml 配置正确，但 CI/CD 持续报 404 错误。  
**根因**：GitHub Pages 功能需在仓库 Settings → Pages 中手动开启（选择 Source: GitHub Actions），否则 `actions/deploy-pages` 会失败。

**教训**：
- 新项目接入 GitHub Pages 时，**第一步**就要确认仓库 Pages 设置是否已开启
- deploy.yml 中的 `base` 路径必须与仓库 Pages URL 子路径一致：`/repo-name/` 格式
- 路由必须用 `createWebHashHistory`（GitHub Pages 不支持 history 模式 SPA 路由）

**操作步骤**（每次新项目必做）：
1. Settings → Pages → Source → GitHub Actions
2. `vite.config.ts` 的 build 命令加 `--base=/仓库名/子路径/`
3. `router/index.ts` 用 `createWebHashHistory()`

---

## 经验 2：生产部署的构建命令与开发不同

**问题**：本地 `npm run build` 正常，但 GitHub Actions 部署后页面空白。  
**根因**：GitHub Pages 是子路径部署，`base` 不正确导致 JS/CSS 资源 404。

**教训**：
- 部署工作流的 build 步骤必须指定 `--base`，而不是写死在 `vite.config.ts` 中
- 这样本地开发用默认 `/`，生产用 `--base=/子路径/`，不冲突

```yaml
# .github/workflows/deploy.yml 正确写法
- name: Build
  run: npm run build -- --base=/ai-agent-workspace/projects/baby-food-poster/
```

---

## 经验 3：CI 与 Deploy 分开，不要合并成一个 workflow

**问题**：最初只有 deploy.yml，没有独立的 CI 检查。  
**结果**：每次提交都触发完整的部署流程，即使只是改了文档。

**教训**：
- **CI（构建+类型检查）** 和 **Deploy（发布）** 应该是两个独立的 workflow
- CI：在所有 PR 上运行，fast fail，给开发者即时反馈
- Deploy：只在 push 到 `main` 且相关文件变更时触发，加 `paths` 过滤
- CI 不做部署，Deploy 不做测试逻辑（职责单一）

---

## 经验 4：vite.config.ts 的 TypeScript 兼容性

**问题**：使用了 Node.js `fs` 和 `path` 模块，需要安装 `@types/node`，否则 TypeScript 报错。  
**解决**：`npm install -D @types/node`

**教训**：Vite 配置文件如果引用 Node.js 核心模块，必须安装对应的类型声明。

---

## 经验 5：大 chunk 警告不要忽略

**构建输出**：
```
(!) Some chunks are larger than 500 kB after minification.
dist/assets/index-C8SwxQOB.js  1,221.00 kB │ gzip: 393.56 kB
```

**根因**：Element Plus 整包引入，导致首屏 JS 超过 1MB。  

**后续项目改进方案**：
```typescript
// vite.config.ts — 手动分包
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'element-plus': ['element-plus'],
        'vendor': ['vue', 'vue-router', 'pinia'],
      }
    }
  }
}
```

---

## 经验 6：sql.js（浏览器端 SQLite）的特殊性

**问题**：sql.js 需要 WASM 文件（659KB），构建时要手动复制到 dist。  
**解决**：在 vite.config.ts 中写自定义插件处理 WASM 文件复制。

**教训**：任何需要 WASM 的库都需要处理静态文件复制，不要以为 Vite 会自动处理。

---

## 经验 7：没有 Pinia 的代价

**问题**：baby-food-poster 没有使用 Pinia，组件间数据传递通过 prop drilling。  
**结果**：当需要在多个页面共享配方数据时，逻辑变得复杂。

**教训**：即使是小项目，也应该按技术栈标准安装 Pinia。不使用的 store 不会增加打包体积，但缺少它时重构成本高。

---

## 经验 8：类型定义要先写

**问题**：项目初期没有在 `types/` 中预先定义接口类型，导致后期多处使用 `any` 或重复内联类型。  
**教训**：新建业务模块时，**第一步**写类型定义（`types/index.ts`），之后 API 层和页面层都引用这些类型，不重复定义。

---

## 经验 9：部署 workflow 必须有 path 过滤

**问题**：修改 `.github/agents/` 文档时，也会触发整个前端构建和部署。  
**解决**：在 `deploy.yml` 中加 `paths` 过滤：

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'projects/baby-food-poster/**'
      - '.github/workflows/deploy.yml'
```

---

## 后续项目的改进清单

| 改进点 | 优先级 | 说明 |
|--------|--------|------|
| 开启 GitHub Pages 确认 | 🔴 高 | 每次新项目第一步 |
| Pinia 状态管理 | 🔴 高 | 无论项目大小都要用 |
| 类型定义先行 | 🔴 高 | 避免后期满屏 `any` |
| CI/Deploy 分离 | 🟡 中 | 保证开发效率 |
| 手动分包（manualChunks） | 🟡 中 | 超过 500KB chunk 时处理 |
| ESLint + Prettier | 🟡 中 | 新项目初始化时配置 |
| 组件按功能模块分目录 | 🟡 中 | 避免全局组件目录膨胀 |
| `.env` 环境变量管理 | 🟡 中 | 不要在代码里硬编码 URL |
