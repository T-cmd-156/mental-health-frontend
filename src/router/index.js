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
  path: '/login/counselor',
  component: () => import('../views/login/CounselorLogin.vue')
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
  path: '/my-appointment',
  name: 'MyAppointment',
  component: () => import('../views/appointment/MyAppointments.vue'),
  meta: { needAuth: true }
},

{
  path: '/appointment/select',
  component: () => import('../views/appointment/SelectSlot.vue'),
   meta: { needAuth: true } 
},

{
  path: '/appointment/:id',
  component: () => import('../views/appointment/Appointment.vue'),
  meta: { needAuth: true }
},

{
  path: '/appointment/:id/detail',
  component: () => import('../views/appointment/AppointmentDetail.vue'),
  meta: { needAuth: true }
},

{
  path: '/admin',
  component: AdminLayout,
  meta: { needAuth: true },
  children: [

      {
        path: 'time',
        component: () => import('../views/admin/TimeRule.vue'),
          meta: { 
          needAuth: true,
          roles: ['admin', 'center', 'counselor', 'tutor']
  }
      },

      {
        path: 'counselor',
        component: () => import('../views/admin/Counselor.vue'),
        meta: { needAuth: true,roles:['admin']  }
      },

      {
        path: 'schedule',
        component: () => import('../views/admin/schedule/ScheduleCenter.vue'),
        meta: { needAuth: true,roles: ['center'] }
    },

      {
      path: 'counselor-work',
      component: () => import('../views/counselor/Dashboard.vue'),
      meta: { needAuth: true, roles: ['counselor'] }
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
  const needAuth = to.meta?.needAuth === true

  // 1. 管理端
if (to.path.startsWith('/admin')) {
  const token = localStorage.getItem('admin_token')
  const role = localStorage.getItem('admin_role')

  const allowRoles = ['admin', 'counselor', 'center', 'tutor', 'college', 'leader']


  // 第一层：判断是否后台用户
  if (needAuth && (!token || !allowRoles.includes(role))) {
    return next('/login/admin')
  }

  
  // 第二层：是否有该页面权限
  const routeRoles = to.meta?.roles
  if (routeRoles && !routeRoles.includes(role)) {
    return next('/login/admin') // 或 /login/admin
  }
  return next()
}

  
  // 2. 学生/家长端（凡是需要登录的非 admin 页面）
  if (to.path.startsWith('/appointment') || to.path.startsWith('/my-appointment')) {

  localStorage.getItem('student_id')

  const token = localStorage.getItem('User_token');
  const role = localStorage.getItem('User_role');

  if (needAuth && (!token || !role)) {
    return next({
      path: '/login/user',
      query: { redirect: to.fullPath }
    });
  }
}

  // 3. 咨询师端
  if (to.path.startsWith('/counselor')) {
    const token = localStorage.getItem('user_token')
    const role = localStorage.getItem('user_role')

    if (to.meta?.needAuth && (!token || role !== 'counselor')) {
      return next('/login/admin')
    }
    return next()
  }

  next();
})


export default router
