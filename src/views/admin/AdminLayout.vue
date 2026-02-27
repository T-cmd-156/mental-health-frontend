<template>
  <div class="admin">
    <!-- 顶部 -->
    <header class="top">
      <div class="top-left">
        <img class="logo" src="../../assets/images/logo.png" alt="校徽" />
        <div class="brand">
          <span class="system-title">心理健康管理后台</span>
          <span class="org" v-if="showOrg">党委学生工作部 学生工作处</span>
        </div>
      </div>
      <nav class="top-nav">
        <router-link to="/message" class="nav-item message-link">
          <el-icon><Bell /></el-icon>
          <span>消息</span>
          <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
        </router-link>
        <span class="nav-item">基础信息</span>
        <span class="nav-item">教育管理</span>
        <span class="nav-item">日常管理</span>
        <span class="nav-item">心理健康管理</span>
        <span class="nav-item">资助管理</span>
      </nav>
    </header>

    <div class="main">

      <!-- 左侧菜单 -->
<aside class="menu">

  <!-- 所有人可见 -->
  <div class="item" @click="go('time')">
    心理咨询时间规则
  </div>
  <div class="item" v-if="role === 'counselor'" @click="router.push('/case')">
    个案管理
  </div>
  <div class="item" v-if="role === 'counselor'" @click="router.push('/crisis')">
    危机管理
  </div>

    <!-- 请假管理：咨询师、心理中心、管理员可见 -->
    <div class="item" v-if="['counselor','center','admin'].includes(role)" @click="router.push('/leave/list')">
      请假管理
    </div>

    <!-- 测评查看：咨询师、心理中心、管理员可见 -->
    <div class="item" v-if="['counselor','center','admin'].includes(role)" @click="router.push('/assessment/list')">
      测评查看
    </div>

    <!-- 团体活动管理：咨询师、心理中心、管理员可见 -->
    <div class="item" v-if="['counselor','center','admin'].includes(role)" @click="router.push('/activity/manage')">
      团体活动管理
    </div>

  <!-- 只有管理员 -->
  <div class="item" 
       v-if="role === 'admin'"
       @click="go('counselor')">
    咨询师档案
  </div>

  <!-- 智能排班：心理中心 -->
  <div class="item" 
       v-if="role === 'center'"
       @click="go('schedule')"> <!--这里后面要改-->
    智能排班
  </div>

<!-- 咨询师 -->
<div class="item"
     v-if="role === 'counselor'"
     @click="go('counselor-work')">
  我的咨询
</div>

</aside>


      <!-- 右侧工作区 -->
      <section class="content">
        <div class="content-header">
          <h2>欢迎进入 {{ roleName }} 工作台</h2>
        </div>
        <div class="content-body">
          <router-view />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUnreadCount } from '../../api/message'
import {
  Bell,
  Odometer,
  Clock,
  User,
  Calendar,
  List,
  Notebook,
  UserFilled,
  CircleCheck,
  Warning,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const unreadCount = ref(0)
onMounted(async () => {
  try {
    const res = await getUnreadCount()
    unreadCount.value = res.data || 0
  } catch (_) {}
})

const userId = ref(localStorage.getItem('user_id'))
const role = ref(localStorage.getItem('admin_role') || localStorage.getItem('user_role'))
const admin_role = localStorage.getItem('admin_role')
const admin_token = localStorage.getItem('admin_token')

const roleMap = {
  admin: '管理员',
  counselor: '咨询师',
  center: '心理中心',
  college: '二级学院',
  leader: '校领导',
  tutor: '辅导员',
}
const roleName = computed(() => roleMap[admin_role] || '用户')

const showOrg = ref(true)

const currentPath = computed(() => {
  const p = route.path
  if (p.startsWith('/admin/')) return p.replace('/admin/', '') || 'workbench'
  return 'workbench'
})

const menuEntries = computed(() => [
  { path: 'workbench', label: '工作台', icon: Odometer, show: true },
  { path: 'time', label: '心理咨询时间规则', icon: Clock, show: true },
  { path: 'counselor', label: '咨询师档案', icon: User, show: role.value === 'admin' },
  { path: 'schedule', label: '智能排班', icon: Calendar, show: role.value === 'center' },
  { path: 'counselor-work', label: '我的咨询', icon: List, show: role.value === 'counselor' },
  { path: 'appointments', label: '预约管理', icon: Calendar, show: role.value === 'counselor' || role.value === 'center' },
  { path: 'consult-records', label: '咨询记录', icon: Notebook, show: role.value === 'counselor' },
  { path: 'students', label: '学生管理', icon: UserFilled, show: role.value === 'admin' || role.value === 'center' },
  { path: 'leave', label: '请假审批', icon: CircleCheck, show: role.value === 'admin' || role.value === 'center' },
  { path: 'crisis', label: '危机审批', icon: Warning, show: true },
])

function go(page) {
  router.push('/admin/' + page)
}
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: #f1f5f9;
}

.top {
  height: 56px;
  background: linear-gradient(135deg, #1e3a5f 0%, #1e4f9c 50%, #2563eb 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(30, 79, 156, 0.25);
}

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 36px;
  width: auto;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.system-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.org {
  font-size: 11px;
  opacity: 0.88;
  margin-top: 1px;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.message-link {
  color: inherit;
  text-decoration: none;
}

.unread-badge {
  background: #ef4444;
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 2px;
}

.main {
  display: flex;
  min-height: calc(100vh - 56px);
}

.menu {
  width: 220px;
  background: #fff;
  padding: 12px 8px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
  border-right: 1px solid #e2e8f0;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 4px;
  border-radius: 10px;
  cursor: pointer;
  color: #475569;
  font-size: 14px;
  transition: background 0.2s, color 0.2s;
}

.item:hover {
  background: #f1f5f9;
  color: #1e4f9c;
}

.item.active {
  background: linear-gradient(90deg, rgba(30, 79, 156, 0.12) 0%, transparent 100%);
  color: #1e4f9c;
  font-weight: 600;
  border-left: 3px solid #1e4f9c;
  padding-left: 11px;
}

.item-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-header {
  padding: 20px 24px 12px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.content-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow: auto;
}
</style>
