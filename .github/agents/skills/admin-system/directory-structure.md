# 目录结构规范 — 后台管理系统

> 参考：v3-admin-vite · vue-element-plus-admin · baby-food-poster 实战

## 完整目录树

```
项目根目录/
├── public/                     # 静态资源（不经 Vite 处理）
│   └── favicon.ico
├── src/
│   ├── api/                    # ① 接口层
│   │   ├── index.ts            #   统一导出
│   │   └── modules/            #   按业务模块拆分（一业务一文件）
│   │       ├── auth.ts         #   登录/登出/刷新 token
│   │       ├── user.ts         #   用户管理
│   │       └── menu.ts         #   菜单/权限
│   ├── assets/                 # ② 静态资源
│   │   ├── images/
│   │   └── styles/
│   │       ├── index.scss      #   样式入口（在 main.ts 中导入）
│   │       ├── variables.scss  #   CSS 变量 / 主题色（禁止组件内硬编码颜色）
│   │       ├── mixins.scss     #   公共 mixin
│   │       └── reset.scss      #   浏览器默认样式重置
│   ├── components/             # ③ 全局公共组件（跨多个页面复用）
│   │   └── BaseTable/
│   │       ├── index.vue
│   │       └── types.ts
│   ├── composables/            # ④ 组合式函数（useXxx，有副作用）
│   │   ├── useTable.ts         #   通用列表分页逻辑
│   │   ├── useForm.ts          #   通用表单提交逻辑
│   │   └── usePermission.ts    #   权限判断
│   ├── constants/              # ⑤ 常量与枚举
│   │   ├── index.ts            #   统一导出
│   │   └── status.ts           #   业务状态枚举（如 UserStatus）
│   ├── directives/             # ⑥ 自定义指令
│   │   └── permission.ts       #   v-permission 按钮权限指令
│   ├── layouts/                # ⑦ 布局（页面骨架）
│   │   ├── index.vue           #   布局入口（router-view 挂载点）
│   │   └── components/
│   │       ├── Sidebar/        #   侧边栏（菜单树）
│   │       │   └── index.vue
│   │       ├── Navbar/         #   顶部导航栏
│   │       │   └── index.vue
│   │       └── TagsView/       #   多标签页（可选）
│   │           └── index.vue
│   ├── router/                 # ⑧ 路由
│   │   ├── index.ts            #   路由实例 + 全局守卫
│   │   └── modules/            #   按一级菜单拆分
│   │       ├── dashboard.ts
│   │       └── system.ts
│   ├── stores/                 # ⑨ Pinia 状态
│   │   ├── index.ts            #   统一导出
│   │   └── modules/
│   │       ├── user.ts         #   用户信息 / token
│   │       ├── app.ts          #   全局 UI 状态（侧边栏折叠/主题）
│   │       └── permission.ts   #   动态路由 / 菜单权限
│   ├── types/                  # ⑩ TypeScript 类型定义
│   │   ├── index.ts            #   统一导出
│   │   ├── api.ts              #   API 响应结构类型
│   │   └── global.d.ts         #   全局类型声明（扩展 Window 等）
│   ├── utils/                  # ⑪ 工具函数（纯函数，无副作用）
│   │   ├── request.ts          #   axios 封装（拦截器/错误处理）
│   │   ├── auth.ts             #   token 读写（localStorage）
│   │   └── format.ts           #   日期/金额格式化
│   ├── views/                  # ⑫ 页面（最终呈现给用户的内容）
│   │   ├── login/
│   │   │   └── index.vue
│   │   ├── dashboard/
│   │   │   └── index.vue
│   │   └── system/             #   一个一级菜单对应一个文件夹
│   │       ├── user/
│   │       │   ├── index.vue       # 列表页（入口，必须存在）
│   │       │   ├── detail.vue      # 详情/编辑页（可选）
│   │       │   └── components/     # 仅本模块用的组件
│   │       │       └── UserForm.vue
│   │       └── role/
│   │           └── index.vue
│   ├── App.vue
│   └── main.ts
├── .env                        # 公共环境变量（无敏感信息）
├── .env.development            # 开发环境（本地）
├── .env.production             # 生产环境
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 每个目录的职责与规则

### ① `api/modules/` — 接口层
- **一个业务模块一个文件**，禁止所有接口堆在同一个文件
- 函数命名：`get/list/create/update/delete + 资源名`（如 `getUserList`、`createUser`）
- 统一使用 `utils/request.ts` 封装的 axios 实例，不直接使用 `axios`

```typescript
// api/modules/user.ts
import request from '@/utils/request'
import type { UserListParams, UserInfo } from '@/types'

export const getUserList = (params: UserListParams) =>
  request.get<UserInfo[]>('/user/list', { params })

export const createUser = (data: Omit<UserInfo, 'id'>) =>
  request.post('/user', data)
```

### ③ `components/` — 全局公共组件
- **只放跨多个页面复用的组件**
- 单模块专用组件放在 `views/[module]/components/` 下，不上浮到全局
- 每个组件用独立文件夹（`ComponentName/index.vue`），便于后续扩展

### ④ `composables/` — 组合式函数
- **有副作用**（如调用 store、发起请求）的逻辑放这里，不放 `utils/`
- `useTable` 封装分页列表的通用逻辑，避免每个列表页重复写

### ⑦ `layouts/components/` — 布局子组件
- 布局组件在 `layouts/` 下拆分为独立子组件（Sidebar/Navbar/TagsView）
- 布局组件不应包含业务逻辑

### ⑧ `router/modules/` — 路由分模块
- **每个一级菜单对应一个路由文件**（如 `system.ts` 管理系统用户/角色路由）
- `router/index.ts` 只做路由实例创建和守卫注册，不定义具体路由

### ⑨ `stores/modules/` — Pinia 分模块
- `user.ts`：存 token、用户信息，负责 login/logout action
- `app.ts`：存 UI 状态（侧边栏是否折叠、语言、主题色）
- `permission.ts`：存动态菜单/权限码，由路由守卫在登录后触发生成

### ⑫ `views/[module]/` — 页面结构
- 每个功能模块一个文件夹，**`index.vue` 是必须存在的入口**
- 跟当前模块强绑定的组件放在模块内 `components/` 子目录，不要放到全局 `components/`
- 一般不超过 3 层嵌套：`views/一级菜单/二级菜单/index.vue`

---

## 强制规则 (Quick Reference)

| 规则 | 错误做法 | 正确做法 |
|------|---------|---------|
| 组件放置 | 所有组件放 `components/` | 模块专用 → `views/xx/components/`，跨模块复用 → `components/` |
| 工具函数 | 有副作用逻辑放 `utils/` | 有副作用 → `composables/`，纯函数 → `utils/` |
| 颜色值 | 组件内 `color: #409eff` | 统一在 `variables.scss` 定义，组件用变量引用 |
| 接口调用 | 页面直接用 `axios.get(...)` | 封装到 `api/modules/` 后页面调用函数 |
| 路由 | 所有路由写在 `index.ts` | 按一级菜单拆分到 `router/modules/` |
| TypeScript | 用 `any` 逃避类型 | 在 `types/` 定义具体接口类型 |
