# 新项目启动检查清单

接到需求后，按顺序逐项完成，完成一项打一个 ✅。

---

## 阶段一：需求确认（开发前，15 分钟内）

- [ ] 用一句话描述：这个项目解决什么问题、给谁用
- [ ] 确认 MVP 范围：哪些功能必须有，哪些是"以后可以加"
- [ ] 确认交付时间节点
- [ ] 确认后端接口状态（已有文档 / 需要一起设计 / 纯前端项目）
- [ ] 确认部署方式（GitHub Pages / 服务器 / 客户自部署）

---

## 阶段二：初始化项目

- [ ] 复制 `vue3-vite-starter/template/` 到新项目目录
- [ ] 修改 `package.json` 的 `name` 字段
- [ ] 运行 `npm install` 确认依赖安装成功
- [ ] 创建 `.env.development` 和 `.env.production`（参考 env-config.md）
- [ ] 初始化 Git 仓库：`git init && git add . && git commit -m "chore: init project"`
- [ ] 创建远程仓库并关联
- [ ] 确认 `.gitignore` 包含：`node_modules/` `.env*.local` `dist/`

---

## 阶段三：项目基础配置

- [ ] 在 `router/modules/` 下创建项目路由文件（按模块）
- [ ] 在 `api/modules/` 下创建接口文件（按模块）
- [ ] 配置后端接口代理（`vite.config.js` 的 `server.proxy`）
- [ ] 如后端未就绪，启用 Mock（参考 mock-setup.md）
- [ ] 参照 dev-standards 检查目录结构是否符合规范

---

## 阶段四：开发中检查点（每天结束前）

- [ ] 当天代码可运行、可演示（不留半成品）
- [ ] 提交信息符合 git-conventions.md 规范
- [ ] 没有遗留 `console.log` 和注释掉的代码块

---

## 阶段五：交付前检查

- [ ] 生产环境接口地址已切换
- [ ] `npm run build` 构建成功、无报错
- [ ] 主要功能在生产包中验证可用
- [ ] 敏感信息（密钥/凭证）未出现在代码中
- [ ] README.md 写明项目说明、启动方式
