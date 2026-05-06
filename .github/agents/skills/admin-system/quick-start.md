# 新项目 30 分钟启动 SOP

> 接到后台管理系统需求时，按此流程执行。完成后即可开始写业务代码。

---

## Phase 1：脚手架与依赖（~5 分钟）

### 1.1 创建项目

```bash
# 在项目所在目录执行
npm create vue@latest <项目名>
# 选项：TypeScript ✅ / Vue Router ✅ / Pinia ✅ / ESLint ✅ / Prettier ✅（其余可选 No）
```

### 1.2 安装必要依赖

```bash
cd <项目名>
npm install element-plus @element-plus/icons-vue axios pinia-plugin-persistedstate sass-embedded
```

### 1.3 清理脚手架默认文件

```bash
# 删除示例文件，保留空壳
rm -rf src/components/* src/views/* src/stores/* src/assets/base.css src/assets/logo.svg
```

---

## Phase 2：目录骨架（~5 分钟）

按 `directory-structure.md` 创建以下目录和入口文件：

```bash
mkdir -p src/{api/modules,assets/{images,styles},components,composables,constants,directives,layouts/components/{Sidebar,Navbar},router/modules,stores/modules,types,utils,views/{login,dashboard}}
```

创建必要的空入口文件：

```bash
touch src/api/index.ts
touch src/constants/index.ts
touch src/types/index.ts
touch src/utils/{request,auth,format}.ts
touch src/stores/index.ts
touch src/stores/modules/{user,app,permission}.ts
touch src/router/modules/{dashboard}.ts
```

---

## Phase 3：核心配置（~10 分钟）

### 3.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### 3.2 环境变量文件

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://api.your-domain.com
```

### 3.3 axios 封装 `src/utils/request.ts`

```typescript
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 请求拦截：自动附加 token
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// 响应拦截：统一错误处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      useUserStore().logout()
      router.push('/login')
    } else {
      ElMessage.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request
```

### 3.4 Pinia user store `src/stores/modules/user.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi } from '@/api/modules/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref<{ name: string; roles: string[] } | null>(null)

    async function login(params: { username: string; password: string }) {
      const data = await loginApi(params)
      token.value = data.token
      userInfo.value = data.userInfo
    }

    function logout() {
      token.value = ''
      userInfo.value = null
    }

    return { token, userInfo, login, logout }
  },
  { persist: true } // pinia-plugin-persistedstate
)
```

### 3.5 路由守卫 `src/router/index.ts`

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/index.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页' },
        },
        // 其他路由通过 router/modules/ 导入
      ],
    },
  ],
})

// 全局守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.token) {
    return '/login'
  }
})

export default router
```

### 3.6 main.ts 入口

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import router from './router'
import App from './App.vue'
import '@/assets/styles/index.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 注册所有 Element Plus 图标
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}

app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.mount('#app')
```

---

## Phase 4：布局框架（~10 分钟）

### 4.1 `src/layouts/index.vue`（主布局）

```vue
<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="layout-aside">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <Navbar />
      </el-header>
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/modules/app'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar/index.vue'

const appStore = useAppStore()
const { isCollapsed } = storeToRefs(appStore)
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}
.layout-aside {
  transition: width 0.3s;
  overflow: hidden;
}
.layout-header {
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
}
.layout-main {
  background: var(--el-bg-color-page);
  overflow: auto;
}
</style>
```

---

## 验证清单

完成上述步骤后，运行以下检查：

```bash
# 类型检查 + 构建
npm run build

# 开发服务器（验证页面可访问）
npm run dev
```

- [ ] `npm run build` 无 TypeScript 错误
- [ ] 访问 `http://localhost:3000` 能看到登录页
- [ ] 登录后能跳转到首页（Dashboard）
- [ ] 侧边栏折叠/展开正常
- [ ] 刷新页面 token 不丢失（pinia persist 生效）
