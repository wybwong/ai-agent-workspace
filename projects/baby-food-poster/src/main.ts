import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import router from './router'
import App from './App.vue'
import './assets/styles/index.scss'
import { dbService } from './services/database'

async function bootstrap() {
  await dbService.init()

  const app = createApp(App)

  for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, component)
  }

  app.use(ElementPlus, { locale: zhCn })
  app.use(router)
  app.mount('#app')
}

bootstrap()
