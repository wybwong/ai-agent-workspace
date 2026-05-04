# 多环境变量配置规范

## 文件规则

| 文件 | 用途 | 提交到 Git |
|------|------|-----------|
| `.env` | 所有环境共用的变量 | ✅ 是 |
| `.env.development` | 本地开发环境 | ✅ 是（不含敏感信息） |
| `.env.production` | 生产环境 | ✅ 是（不含敏感信息） |
| `.env.local` | 本地覆盖（优先级最高） | ❌ 否（加入 .gitignore） |

## 命名规则

所有变量**必须以 `VITE_` 开头**，否则 Vite 不会暴露到客户端代码。

```bash
# ✅ 正确
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=我的应用

# ❌ 不会生效（没有 VITE_ 前缀）
API_BASE_URL=https://api.example.com
```

## 标准模板

### `.env`
```bash
VITE_APP_TITLE=项目名称
VITE_APP_VERSION=1.0.0
```

### `.env.development`
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MOCK=true
```

### `.env.production`
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_MOCK=false
```

## 在代码中使用

```js
// ✅ 通过 import.meta.env 访问
const baseURL = import.meta.env.VITE_API_BASE_URL
const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true'
```

## 敏感信息处理

- **禁止**将 API 密钥、数据库密码等放入 `.env.development` 或 `.env.production`
- 敏感信息放入 `.env.local`（不提交）或在 CI/CD 平台的环境变量中配置
