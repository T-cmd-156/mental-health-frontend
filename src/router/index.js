import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/portal/Home.vue')
  },

  // 个案管理
{
  path: '/case',
  name: 'CaseList',
  component: () => import('../views/case/CaseList.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/case/:id',
  name: 'CaseDetail',
  component: () => import('../views/case/CaseDetail.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/case/:id/operate',
  name: 'CaseOperate',
  component: () => import('../views/case/CaseOperate.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/case/stats',
  name: 'CaseStats',
  component: () => import('../views/case/CaseStats.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},

// 危机管理
{
  path: '/crisis',
  name: 'CrisisList',
  component: () => import('../views/crisis/CrisisList.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/detail',
  name: 'CrisisDetail',
  component: () => import('../views/crisis/CrisisList.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/:id',
  name: 'CrisisAssess',
  component: () => import('../views/crisis/CrisisAssess.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/intervene',
  name: 'CrisisIntervene',
  component: () => import('../views/crisis/CrisisIntervene.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/:id/intervene',
  name: 'CrisisInterveneById',
  component: () => import('../views/crisis/CrisisIntervene.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/level',
  name: 'CrisisLevel',
  component: () => import('../views/crisis/CrisisLevel.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/:id/level',
  name: 'CrisisLevelById',
  component: () => import('../views/crisis/CrisisLevel.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},
{
  path: '/crisis/:id/close',
  name: 'CrisisClose',
  component: () => import('../views/crisis/CrisisClose.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin','tutor','college','leader'] }
},

  {
    path: '/counselor/schedule',
    component: () => import('../views/counselor/ScheduleCenter.vue'),
    meta: { needAuth: true, roles: ['counselor'] }
  },

// 请假管理
{
  path: '/leave/apply',
  name: 'LeaveApply',
  component: () => import('../views/leave/LeaveApply.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/leave/list',
  name: 'LeaveList',
  component: () => import('../views/leave/LeaveList.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},

// 测评查看
{
  path: '/assessment/list',
  name: 'AssessmentList',
  component: () => import('../views/assessment/AssessmentList.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},

// 团体活动管理
{
  path: '/activity/create',
  name: 'ActivityCreate',
  component: () => import('../views/activity/ActivityCreate.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/activity/manage',
  name: 'ActivityManage',
  component: () => import('../views/activity/ActivityManage.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/activity/sign',
  name: 'ActivitySign',
  component: () => import('../views/activity/ActivitySign.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},
{
  path: '/activity/summary',
  name: 'ActivitySummary',
  component: () => import('../views/activity/ActivitySummary.vue'),
  meta: { needAuth: true, roles: ['counselor','center','admin'] }
},

{
  path: '/login/admin',
  component: () => import('../views/login/AdminLogin.vue')
},
{
  path: '/login/user',
  component: () => import('../views/login/UserLogin.vue')
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
  path: '/message',
  name: 'MessageCenter',
  component: () => import('../views/message/MessageCenter.vue')
},
{
  path: '/student/dashboard',
  name: 'StudentDashboard',
  component: () => import('../views/student/StudentDashboard.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/assessment',
  name: 'AssessmentList',
  component: () => import('../views/student/assessment/AssessmentList.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/assessment/:id',
  name: 'Assessment',
  component: () => import('../views/student/assessment/Assessment.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/assessment/:id/result',
  name: 'AssessmentResult',
  component: () => import('../views/student/assessment/AssessmentResult.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/activity',
  name: 'ActivityList',
  component: () => import('../views/student/activity/ActivityList.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/activity/:id',
  name: 'ActivityDetail',
  component: () => import('../views/student/activity/ActivityDetail.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/activity/my',
  name: 'MyActivities',
  component: () => import('../views/student/activity/MyActivities.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/crisis',
  name: 'CrisisReport',
  component: () => import('../views/student/crisis/CrisisReport.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/profile',
  name: 'Profile',
  component: () => import('../views/student/profile/Profile.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/psych-profile',
  name: 'StudentPsychProfile',
  component: () => import('../views/student/profile/StudentPsychProfile.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/psych-profile/:id',
  name: 'StudentPsychProfileDetail',
  component: () => import('../views/student/profile/StudentPsychProfile.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/self-help',
  name: 'SelfHelp',
  component: () => import('../views/student/selfHelp/SelfHelp.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/self-help/micro-course',
  name: 'MicroCourse',
  component: () => import('../views/student/selfHelp/MicroCourse.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/self-help/music-therapy',
  name: 'MusicTherapy',
  component: () => import('../views/student/selfHelp/MusicTherapy.vue'),
  meta: { needAuth: true }
},
{
  path: '/student/self-help/health-course',
  name: 'HealthCourse',
  component: () => import('../views/student/selfHelp/HealthCourse.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/dashboard',
  name: 'ParentDashboard',
  component: () => import('../views/parent/ParentDashboard.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/children',
  name: 'ChildManagement',
  component: () => import('../views/parent/children/ChildManagement.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/assessment',
  name: 'AssessmentView',
  component: () => import('../views/parent/assessment/AssessmentView.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/appointment',
  name: 'AppointmentView',
  component: () => import('../views/parent/appointment/AppointmentView.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/activity',
  name: 'ActivityView',
  component: () => import('../views/parent/activity/ActivityView.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/profile',
  name: 'ProfileView',
  component: () => import('../views/parent/profile/ProfileView.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/contact',
  name: 'ContactCounselor',
  component: () => import('../views/parent/contact/ContactCounselor.vue'),
  meta: { needAuth: true }
},
{
  path: '/parent/message',
  name: 'ParentMessage',
  component: () => import('../views/parent/message/ParentMessage.vue'),
  meta: { needAuth: true }
},
{
  path: '/my-appointment',
  name: 'MyAppointment',
  component: () => import('../views/appointment/MyAppointments.vue'),
  meta: { needAuth: true }
},

// 咨询记录模块
{
  path: '/record/new',
  name: 'RecordNew',
  component: () => import('../views/record/RecordForm.vue'),
  meta: { needAuth: true, roles: ['counselor'] }
},
{
  path: '/record/:id',
  name: 'RecordView',
  component: () => import('../views/record/RecordForm.vue'),
  meta: { needAuth: true, roles: ['counselor'] }
},
{
  path: '/record/:id/edit',
  name: 'RecordEdit',
  component: () => import('../views/record/RecordForm.vue'),
  meta: { needAuth: true, roles: ['counselor'] }
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

// 记录列表页
{
  path: '/records',
  name: 'RecordList',
  component: () => import('../views/record/RecordList.vue'),
  meta: { needAuth: true, roles: ['counselor'] }
},


{
  path: '/admin',
  component: () => import('../views/admin/AdminLayout.vue'),
  meta: { needAuth: true },
  redirect: '/admin/workbench',
  children: [
    {
      path: 'workbench',
      component: () => import('../views/admin/AdminWorkbench.vue'),
      meta: { needAuth: true }
    },
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
      component: () => import('../views/counselor/CounselorDashboard.vue'),
      meta: { needAuth: true, roles: ['counselor'] }
    },
    {
      path: 'appointments',
      component: () => import('../views/counselor/CounselorAppointments.vue'),
      meta: { needAuth: true, roles: ['counselor', 'center'] }
    },
    {
      path: 'consult-records',
      component: () => import('../views/counselor/ConsultRecords.vue'),
      meta: { needAuth: true, roles: ['counselor'] }
    },
    {
      path: 'students',
      component: () => import('../views/admin/AdminStudents.vue'),
      meta: { needAuth: true, roles: ['admin', 'center'] }
    },
    {
      path: 'leave',
      component: () => import('../views/admin/AdminLeave.vue'),
      meta: { needAuth: true, roles: ['admin', 'center'] }
    },
    {
      path: 'crisis',
      component: () => import('../views/admin/AdminCrisis.vue'),
      meta: { needAuth: true }
    },

    // 辅导员端路由
    {
      path: 'tutor-workbench',
      component: () => import('../views/tutor/TutorWorkbench.vue'),
      meta: { needAuth: true, roles: ['tutor'] }
    },
    {
      path: 'tutor-students',
      component: () => import('../views/tutor/TutorStudents.vue'),
      meta: { needAuth: true, roles: ['tutor'] }
    },
    {
      path: 'tutor-students/:id',
      component: () => import('../views/tutor/TutorStudents.vue'),
      meta: { needAuth: true, roles: ['tutor'] }
    },
    {
      path: 'tutor-crisis-report',
      component: () => import('../views/tutor/TutorCrisisReport.vue'),
      meta: { needAuth: true, roles: ['tutor'] }
    },
    {
      path: 'tutor-assessment',
      component: () => import('../views/tutor/TutorAssessment.vue'),
      meta: { needAuth: true, roles: ['tutor'] }
    },
    {
      path: 'tutor-report',
      component: () => import('../views/tutor/TutorReport.vue'),
      meta: { needAuth: true, roles: ['tutor'] }
    },

    // 院系领导端路由
    {
      path: 'college-workbench',
      component: () => import('../views/college/CollegeWorkbench.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },
    {
      path: 'college-statistics',
      component: () => import('../views/college/CollegeStatistics.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },
    {
      path: 'college-report',
      component: () => import('../views/college/CollegeReport.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },
    {
      path: 'college-crisis',
      component: () => import('../views/college/CollegeCrisis.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },
    {
      path: 'college-students',
      component: () => import('../views/college/CollegeStudents.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },
    {
      path: 'college-manage',
      component: () => import('../views/college/CollegeManage.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },
    {
      path: 'college-tutors',
      component: () => import('../views/college/CollegeManage.vue'),
      meta: { needAuth: true, roles: ['college'] }
    },

    // 校领导端路由
    {
      path: 'leader-workbench',
      component: () => import('../views/leader/LeaderWorkbench.vue'),
      meta: { needAuth: true, roles: ['leader'] }
    },
    {
      path: 'leader-statistics',
      component: () => import('../views/leader/LeaderStatistics.vue'),
      meta: { needAuth: true, roles: ['leader'] }
    },
    {
      path: 'leader-report',
      component: () => import('../views/leader/LeaderReport.vue'),
      meta: { needAuth: true, roles: ['leader'] }
    },
    {
      path: 'leader-crisis',
      component: () => import('../views/leader/LeaderCrisis.vue'),
      meta: { needAuth: true, roles: ['leader'] }
    },
    {
      path: 'leader-colleges',
      component: () => import('../views/leader/LeaderColleges.vue'),
      meta: { needAuth: true, roles: ['leader'] }
    }
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

  // 根据角色重定向到对应工作台
  if (to.path === '/admin' || to.path === '/admin/workbench') {
    if (role === 'tutor') {
      return next('/admin/tutor-workbench')
    }
    if (role === 'college') {
      return next('/admin/college-workbench')
    }
    if (role === 'leader') {
      return next('/admin/leader-workbench')
    }
  }

  
  // 第二层：是否有该页面权限
  const routeRoles = to.meta?.roles
  if (routeRoles && !routeRoles.includes(role)) {
    return next('/login/admin')
  }
  return next()
}

  
  // 2. 学生/家长端（凡是需要登录的非 admin 页面）
  if (to.path.startsWith('/appointment') || to.path.startsWith('/my-appointment') || to.path.startsWith('/student') || to.path.startsWith('/parent')) {
    const token = localStorage.getItem('User_token')
    const role = localStorage.getItem('User_role')

    if (needAuth && (!token || !role)) {
      return next({
        path: '/login/user',
        query: { redirect: to.fullPath }
      })
    }
    return next()
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
