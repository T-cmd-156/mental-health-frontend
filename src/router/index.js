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
    path: '/wiki',
    name: 'WikiList',
    component: () => import('../views/wiki/WikiList.vue')
  },
  {
    path: '/wiki/:id',
    name: 'WikiDetail',
    component: () => import('../views/wiki/WikiDetail.vue')
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('../views/articles/ArticleList.vue')
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('../views/articles/ArticleDetail.vue')
  },
  {
    path: '/peer-support',
    name: 'PeerSupport',
    component: () => import('../views/peer/PeerSupport.vue')
  },
  {
    path: '/peer-support/:id',
    name: 'PeerSupportDetail',
    component: () => import('../views/peer/PeerSupportDetail.vue')
  },
  {
    path: '/notices',
    name: 'NoticeList',
    component: () => import('../views/notices/NoticeList.vue')
  },
  {
    path: '/notices/:id',
    name: 'NoticeDetail',
    component: () => import('../views/notices/NoticeDetail.vue')
  },
{
  path: '/appointment/list',
  name: 'MyAppointment',
  component: () => import('../views/appointment/MyAppointments.vue')
},

{
  path: '/appointment/:id',
  name: 'AppointmentDetail',
  component: () => import('../views/appointment/Appointment.vue')
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
