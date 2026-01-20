import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/portal/Home.vue'
import AdminLogin from '../views/login/AdminLogin.vue'
import UserLogin from '../views/login/UserLogin.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'


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
},

{
  path: '/admin',
  component: AdminLayout,
  children: [

      {
        path: 'time',
        component: () => import('../views/admin/TimeRule.vue')
      },

      {
        path: 'counselor',
        component: () => import('../views/admin/Counselor.vue')
      },

      {
        path: 'appoint',
        component: () => import('../views/admin/Appointment.vue')
      },

      {
      path: 'schedule',
      component: () => import('../views/admin/schedule/ScheduleCenter.vue')
    }

      /*...*/
    ]
}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {

  const role = localStorage.getItem('role')

  // 没登录 → 回登录页
  if (to.path.startsWith('/admin') && !role) {
    return next('/login/admin')
  }

  next()
})


export default router
