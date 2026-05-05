# SKILL.md — 登录 & 权限通用方案

## 技能名称
auth-pattern

## 用途
适用于几乎所有管理后台类项目的登录鉴权体系，开箱即用，按需裁剪。
**所有代码已集成进 vue3-vite-starter 模板（v1.3.0+），直接使用模板即可获得完整鉴权能力。**

## 子文件
- [route-guard.js](./route-guard.js) — 路由守卫（token 校验 + 白名单）
- [permission-directive.js](./permission-directive.js) — 按钮级权限指令 `v-permission`
- [token-refresh.js](./token-refresh.js) — Token 无感刷新方案（参考用）

## 包含能力
1. 路由守卫：未登录跳转 /login，已登录不允许访问 /login
2. 动态路由：根据用户角色动态加载可访问页面
3. 按钮权限：`v-permission="['admin', 'editor']"` 控制元素显示
4. Token 刷新：access token 过期时自动用 refresh token 换新（已内置于模板 api/index.js）

## 集成说明
- `permission-directive.js` 路径约定：默认 `@/stores/user`，若使用子模块目录请改为 `@/stores/modules/user`
- `token-refresh.js` 逻辑已整合进模板 `src/api/index.js` 的响应拦截器中，无需单独引用
- `route-guard.js` 已镜像至模板 `src/router/guard.js`，在 `main.js` 中通过 `setupRouteGuard(router)` 调用

## 版本与来源
- 版本：1.1.0
- 创建日期：2026-05-04
- 最后更新：2026-05-05（修复路径不一致、token-refresh 集成到模板 api/index.js，升级为 ✅ 稳定可用）
- 参考：v3-admin-vite 路由鉴权实现
