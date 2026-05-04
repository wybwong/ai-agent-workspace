# Mock 数据方案

## 推荐方案：vite-plugin-mock

轻量、零侵入、与 Vite 集成最好，适合本项目技术栈。

## 安装

```bash
npm install vite-plugin-mock mockjs -D
```

## vite.config.js 配置

```js
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',           // mock 文件目录
      enable: process.env.VITE_ENABLE_MOCK === 'true',
    }),
  ],
})
```

## 目录结构

```
mock/
├── index.js        # mock 入口（统一导出）
└── modules/
    ├── user.js
    └── demo.js
```

## 编写 Mock 文件示例

```js
// mock/modules/demo.js
import Mock from 'mockjs'

export default [
  {
    url: '/api/demo',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query
      return {
        code: 0,
        data: {
          list: Mock.mock({ [`list|${pageSize}`]: [{
            id: '@increment',
            name: '@cname',
            status: '@pick([0, 1])',
            createdAt: '@datetime',
          }] }).list,
          total: 100,
        },
      }
    },
  },
  {
    url: '/api/demo/:id',
    method: 'get',
    response: ({ params }) => ({
      code: 0,
      data: { id: params.id, name: Mock.mock('@cname'), status: 1 },
    }),
  },
  {
    url: '/api/demo',
    method: 'post',
    response: () => ({ code: 0, message: '创建成功' }),
  },
  {
    url: '/api/demo/:id',
    method: 'put',
    response: () => ({ code: 0, message: '更新成功' }),
  },
  {
    url: '/api/demo/:id',
    method: 'delete',
    response: () => ({ code: 0, message: '删除成功' }),
  },
]
```

## 使用约定

1. Mock 文件只在 `VITE_ENABLE_MOCK=true` 时生效（`.env.development` 中设置）
2. Mock 数据结构必须与后端接口文档保持一致
3. 接口联调完成后，将对应 mock 文件删除或注释，避免混淆
