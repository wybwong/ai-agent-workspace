# SKILL.md — 登录 & 权限通用方案

## 技能名称
auth-pattern

## 用途
适用于几乎所有管理后台类项目的登录鉴权体系，开箱即用，按需裁剪。

## 子文件
- [route-guard.js](./route-guard.js) — 路由守卫（token 校验 + 白名单）
- [permission-directive.js](./permission-directive.js) — 按钮级权限指令 `v-permission`
- [token-refresh.js](./token-refresh.js) — Token 无感刷新方案

## 包含能力
1. 路由守卫：未登录跳转 /login，已登录不允许访问 /login
2. 动态路由：根据用户角色动态加载可访问页面
3. 按钮权限：`v-permission="['admin', 'editor']"` 控制元素显示
4. Token 刷新：access token 过期时自动用 refresh token 换新

## 版本与来源
- 版本：1.0.0
- 创建日期：2026-05-04
- 参考：v3-admin-vite 路由鉴权实现
