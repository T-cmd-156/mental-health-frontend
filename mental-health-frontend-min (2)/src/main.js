import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { ensureAnonymousToken } from './request.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
// 不阻塞首屏；匿名 JWT 与「学生/家长登录」无关（门户仅认 User_token + User_role）
void ensureAnonymousToken()

// 延迟初始化排班模板
setTimeout(() => {
  try {
    import('./mock/schedule').then(m => m.initWeekTemplate())
  } catch (e) {
    console.error('initWeekTemplate error:', e)
  }
}, 100)
