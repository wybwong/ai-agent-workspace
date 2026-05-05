import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { setupRouteGuard } from './router/guard'
import { permissionDirective } from './directives/permission'
import '@/assets/styles/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('permission', permissionDirective)

setupRouteGuard(router)

app.mount('#app')
