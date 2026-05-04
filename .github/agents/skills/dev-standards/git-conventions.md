# Git 提交规范

> 遵循 Conventional Commits 规范，与主流开源项目保持一致

## 提交格式

```
<type>(<scope>): <subject>
```

- `type`：提交类型（必填）
- `scope`：影响范围，填模块名（可选）
- `subject`：简短描述，中文即可，不超过 50 字

## type 类型

| type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `style` | 代码格式调整（不影响逻辑） |
| `refactor` | 重构（不新增功能，不修 bug） |
| `perf` | 性能优化 |
| `docs` | 文档修改 |
| `chore` | 构建/配置/依赖调整 |
| `revert` | 回滚提交 |

## 示例

```
feat(user): 新增用户列表搜索功能
fix(order): 修复订单状态不刷新的问题
style: 统一缩进为 2 空格
refactor(api): 拆分接口文件到 modules 目录
chore: 升级 element-plus 到 2.7.0
docs: 补充开发规范说明
```

## 分支规范

| 分支 | 用途 |
|------|------|
| `main` / `master` | 生产环境，只接受 PR，不直接推送 |
| `dev` | 开发主分支，功能分支合并到这里 |
| `feat/xxx` | 新功能分支 |
| `fix/xxx` | Bug 修复分支 |

## 禁止事项

- ❌ 提交信息写 `update` `fix bug` `修改` 等无意义描述
- ❌ 一次提交包含多个不相关改动（应拆分）
- ❌ 将调试代码（`console.log`、注释掉的代码块）提交到主分支
- ❌ 直接 push 到 `main`
