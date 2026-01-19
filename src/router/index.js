import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/portal/Home.vue'
import AdminLogin from '../views/login/AdminLogin.vue'
import UserLogin from '../views/login/UserLogin.vue'

const routes = [
  {
    path: '/',
    component: Home
  },

  {
  path: '/login/admin',
  component: AdminLogin
},
{
  path: '/login/user',
  component: UserLogin
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
