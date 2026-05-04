# 目录结构规范

> 参考：v3-admin-vite / vue-element-plus-admin

## 标准目录结构

```
src/
├── api/                    # 接口层
│   └── modules/            # 按业务模块拆分，一个模块一个文件
├── assets/                 # 静态资源
│   ├── icons/
│   ├── images/
│   └── styles/
│       ├── index.scss      # 样式入口（统一导入）
│       ├── variables.scss  # CSS 变量 / 主题色
│       └── mixins.scss     # 公共 mixin
├── components/             # 全局公共组件（跨页面复用）
│   └── BaseTable/
│       ├── index.vue       # 组件本身
│       └── types.ts        # 组件相关类型（可选）
├── composables/            # 通用组合式函数（useXxx）
├── constants/              # 枚举值 / 常量
│   ├── index.js
│   └── status.js           # 如业务状态枚举
├── directives/             # 自定义指令
├── layouts/                # 布局组件
│   ├── default/            # 默认布局（含侧边栏/顶栏）
│   └── blank/              # 空白布局（登录页等）
├── router/
│   ├── index.js            # 路由实例 + 守卫
│   └── modules/            # 按模块拆分路由
├── stores/                 # Pinia 状态
│   └── modules/
│       ├── user.js
│       └── app.js          # 全局 UI 状态（菜单折叠等）
├── utils/                  # 工具函数（纯函数，无副作用）
│   ├── request.js          # axios 封装
│   ├── auth.js             # token 读写
│   └── format.js           # 日期/金额格式化
└── views/                  # 页面
    └── [module-name]/
        ├── index.vue       # 列表页（入口）
        ├── detail.vue      # 详情/编辑页（可选）
        └── components/     # 仅本模块用的组件
```

## 强制规则

1. **`components/` 只放跨模块复用的组件**，单模块组件放在 `views/[module]/components/` 下
2. **`utils/` 只放纯函数**，有副作用（如请求、store 调用）的逻辑放 `composables/`
3. **`api/modules/` 一个业务一个文件**，禁止所有接口堆在一个文件里
4. **路由按模块拆分**，`router/modules/` 下每个文件对应一个一级菜单
5. **样式变量统一在 `variables.scss` 中定义**，禁止在组件内硬编码颜色值
