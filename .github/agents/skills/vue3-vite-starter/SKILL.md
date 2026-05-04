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
├── src/
│   ├── api/
│   │   ├── index.js          # axios 实例 + 请求/响应拦截器
│   │   └── modules/
│   │       └── demo.js       # 示例接口模块
│   ├── composables/
│   │   ├── useTable.js       # 列表页通用逻辑（分页+搜索+loading）
│   │   └── useForm.js        # 表单通用逻辑（校验+提交+重置）
│   ├── components/
│   │   ├── BaseTable.vue     # 封装 el-table + el-pagination
│   │   ├── BaseForm.vue      # 封装 el-form
│   │   └── BaseDialog.vue    # 新增/编辑通用弹窗
│   ├── router/
│   │   └── index.js          # vue-router 基础配置
│   ├── stores/
│   │   └── user.js           # pinia 用户状态
│   └── views/
│       └── demo/
│           └── DemoList.vue  # 完整 CRUD 示例页面
├── vite.config.js
└── package.json
```

## 调用方式
1. 复制 template 目录到新项目位置
2. 修改 `package.json` 中的项目名称
3. 在 `src/api/modules/` 下新建对应业务接口文件
4. 复制 `DemoList.vue` 改造为目标业务页面

## 版本与来源
- 版本：1.0.0
- 创建日期：2026-05-04
- 来源：Hermes-Core 根据用户技术栈自定义生成
- 依赖版本：Vue 3.x / Vite 5.x / Element UI Plus 2.x / Pinia 2.x
