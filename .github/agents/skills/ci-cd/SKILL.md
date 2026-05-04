# SKILL.md — CI/CD GitHub Actions 模板

## 技能名称
ci-cd

## 用途
GitHub Actions 自动化工作流模板，支持：
- PR 自动构建验证
- 推送 main 分支后自动部署到 GitHub Pages

## 子文件
- [deploy.yml](./deploy.yml) — 自动部署工作流
- [ci.yml](./ci.yml) — PR 持续集成验证工作流

## 使用方式
将所需 yml 文件复制到目标项目的 `.github/workflows/` 目录下即可。

## 版本与来源
- 版本：1.0.0
- 创建日期：2026-05-04
