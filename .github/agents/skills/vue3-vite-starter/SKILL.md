# SKILL.md — Vue 3 + Vite + Element UI Plus 项目启动模板

## 技能名称
vue3-vite-starter

## 用途
快速初始化基于 Vue 3 + Vite + Element UI Plus 的前端项目，包含完整的工程约定、通用组件和复用逻辑，适用于管理后台类系统。

## 适用场景
- 接到新的管理后台/业务系统需求
- 需要快速搭建包含 CRUD 页面的前端项目
- 需要统一接口封装、表格分页、表单校验等通用能力

## 目录结构
```
template/
├── index.html
├── vite.config.js
├── package.json
├── .env / .env.development / .env.production
└── src/
    ├── main.js                   # 应用入口（注册插件/守卫/指令）
    ├── App.vue
    ├── api/
    │   ├── index.js              # axios 实例 + 请求/响应拦截器
    │   └── modules/
    │       ├── user.js           # 用户接口（getUserInfo/login/logout）
    │       └── demo.js           # 示例接口模块
    ├── composables/
    │   ├── useTable.js           # 列表页通用逻辑（分页+搜索+loading）
    │   └── useForm.js            # 表单通用逻辑（校验+提交+重置）
    ├── components/
    │   ├── BaseTable.vue         # 封装 el-table + el-pagination
    │   ├── BaseForm.vue          # 封装 el-form
    │   └── BaseDialog.vue        # 新增/编辑通用弹窗
    ├── layouts/
    │   └── BasicLayout.vue       # 可折叠侧边栏 + 顶栏 + 主内容区
    ├── router/
    │   ├── index.js              # 路由配置（含嵌套Layout路由/404通配）
    │   └── guard.js              # 路由守卫（token校验/用户信息加载）
    ├── stores/
    │   └── user.js               # pinia 用户状态（含 fetchUserInfo/resetToken）
    ├── directives/
    │   └── permission.js         # v-permission 按钮权限指令
    ├── utils/
    │   ├── auth.js               # token 读写工具
    │   └── format.js             # 格式化工具
    ├── constants/
    │   └── index.js              # 全局常量
    ├── assets/styles/
    │   ├── variables.scss        # CSS 变量（主题色/尺寸）
    │   └── index.scss            # 全局样式
    └── views/
        ├── login/
        │   └── index.vue         # 登录页（表单校验+API对接+redirect跳转）
        ├── error/
        │   └── 404.vue           # 404 错误页
        └── demo/
            └── DemoList.vue      # 完整 CRUD 示例页面
├── vitest.config.js              # Vitest 测试配置（jsdom + coverage）
└── src/
    └── __tests__/
        └── format.test.js        # utils 示例测试（可复制改造）
```

## 调用方式
1. 复制 `template/` 目录到新项目位置
2. 修改 `package.json` 中的项目名称
3. 修改 `.env` 中的 `VITE_API_BASE_URL` 指向真实后端
4. 在 `src/api/modules/` 下新建业务接口文件
5. 在 `src/router/index.js` 的 children 中追加业务路由
6. 复制 `DemoList.vue` 改造为目标业务页面

## 版本与来源
- 版本：1.2.0
- 创建日期：2026-05-04
- 最后更新：2026-05-04（集成 Vitest 测试支持：vitest.config.js + 示例测试 + test/coverage scripts）
- 来源：Hermes-Core 根据用户技术栈自定义生成
- 依赖版本：Vue 3.x / Vite 5.x / Element UI Plus 2.x / Pinia 2.x / @element-plus/icons-vue / Vitest 1.x
