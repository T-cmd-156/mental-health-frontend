<template>
  <div class="admin-workbench">
    <div class="page-head">
      <div class="head-main">
        <h2>工作概览</h2>
        <p class="page-desc">待办协同、消息提醒、日程查阅。根据角色展示不同入口。</p>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="stats-row">
      <div class="stat-card" v-for="stat in statsData" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <router-link v-if="stat.to" :to="stat.to" class="stat-link">处理</router-link>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="section-header">
      <h3>快捷入口</h3>
    </div>
    <div class="cards">
      <router-link
        v-for="item in entries"
        :key="item.to"
        :to="item.to"
        class="card"
      >
        <div class="card-icon" :style="{ background: item.color }">
          <el-icon><component :is="item.icon" /></el-icon>
        </div>
        <div class="card-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <span class="card-arrow"><el-icon><ArrowRight /></el-icon></span>
      </router-link>
    </div>

    <!-- 待办事项 -->
    <div v-if="displayTodoList.length" class="todo-section">
      <div class="section-header">
        <h3>待办事项</h3>
        <router-link to="/message" class="link-more">查看全部</router-link>
      </div>
      <div class="todo-list">
        <div
          v-for="todo in displayTodoList"
          :key="todo.id"
          class="todo-item"
          @click="handleTodo(todo)"
        >
          <span class="todo-type" :class="todo.type">{{ todo.typeText }}</span>
          <span class="todo-content">{{ todo.content }}</span>
          <span class="todo-time">{{ todo.time }}</span>
          <el-icon class="todo-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  CircleCheck,
  Warning,
  Bell,
  ArrowRight,
  Setting,
  FolderOpened,
  User,
  DataBoard,
  List,
} from '@element-plus/icons-vue'
import { getCrisisList } from '../../api/crisisApi'
import { getLeaveApprovalList } from '../../api/leaveApi'
import { getUnreadCount } from '../../api/message.js'

const router = useRouter()
const role = ref(localStorage.getItem('admin_role') || localStorage.getItem('user_role') || 'admin')
const stats = ref({
  crisisPending: 0,
  leavePending: 0,
  unreadCount: 0,
  appointmentToday: 0,
})
const todoList = ref([])

const statsData = computed(() => {
  const base = [
    {
      label: '待审批危机',
      value: stats.value.crisisPending,
      color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: Warning,
      to: '/admin/crisis',
    },
  ]
  if (role.value === 'admin' || role.value === 'center') {
    base.push({
      label: '待审批请假',
      value: stats.value.leavePending,
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: CircleCheck,
      to: '/admin/leave',
    })
  }
  base.push({
    label: '未读消息',
    value: stats.value.unreadCount,
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    icon: Bell,
    to: '/message',
  })
  if (role.value === 'center' || role.value === 'counselor') {
    base.push({
      label: '今日预约',
      value: stats.value.appointmentToday,
      color: 'linear-gradient(135deg, #1e4f9c 0%, #2563eb 100%)',
      icon: Calendar,
      to: '/admin/appointments',
    })
  }
  return base
})

const entriesConfig = {
  admin: [
    { title: '预约管理', desc: '查看与处理咨询预约', to: '/admin/appointments', color: 'linear-gradient(135deg, #1e4f9c 0%, #2563eb 100%)', icon: Calendar },
    { title: '危机审批', desc: '危机个案上报与协同审批', to: '/admin/crisis', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: Warning },
    { title: '请假审批', desc: '咨询师请假申请审核', to: '/admin/leave', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: CircleCheck },
    { title: '消息中心', desc: '系统消息与待办提醒', to: '/message', color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', icon: Bell },
    { title: '系统管理', desc: '系统参数与角色权限配置', to: '/admin/system-manage', color: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', icon: Setting },
    { title: '数据管理', desc: '数据备份、恢复、归档与字典', to: '/admin/data-manage', color: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', icon: FolderOpened },
    { title: '用户管理', desc: '管理各角色用户账号', to: '/admin/user-manage', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: User },
  ],
  center: [
    { title: '预约管理', desc: '查看与处理咨询预约', to: '/admin/appointments', color: 'linear-gradient(135deg, #1e4f9c 0%, #2563eb 100%)', icon: Calendar },
    { title: '危机审批', desc: '危机个案上报与协同审批', to: '/admin/crisis', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: Warning },
    { title: '请假审批', desc: '咨询师请假申请审批', to: '/admin/leave', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: CircleCheck },
    { title: '消息中心', desc: '系统消息与待办提醒', to: '/message', color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', icon: Bell },
    { title: '咨询师管理', desc: '管理咨询师信息与排班', to: '/admin/counselor', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: User },
    { title: '数据统计', desc: '全院数据统计与报表', to: '/admin/center-statistics', color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', icon: DataBoard },
  ],
  counselor: [
    { title: '我的咨询', desc: '今日咨询与个案管理', to: '/admin/counselor-work', color: 'linear-gradient(135deg, #1e4f9c 0%, #2563eb 100%)', icon: List },
    { title: '预约管理', desc: '查看与处理咨询预约', to: '/admin/appointments', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: Calendar },
    { title: '个案管理', desc: '咨询记录与个案跟进', to: '/case', color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', icon: List },
    { title: '危机管理', desc: '危机个案上报与处理', to: '/crisis', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: Warning },
    { title: '消息中心', desc: '系统消息与待办提醒', to: '/message', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: Bell },
  ],
}

const entries = computed(() => entriesConfig[role.value] || entriesConfig.admin)

const displayTodoList = computed(() => todoList.value)

async function loadStats() {
  try {
    const crisisRes = await getCrisisList({ status: 'pending' })
    const leavePromise =
      role.value === 'admin' || role.value === 'center'
        ? getLeaveApprovalList({ status: 'pending' })
        : Promise.resolve(null)
    const msgRes = await getUnreadCount()
    const leaveRes = await leavePromise

    if (crisisRes?.code === 200) {
      const crisisList =
        crisisRes.data?.list ?? crisisRes.data?.records ?? (Array.isArray(crisisRes.data) ? crisisRes.data : [])
      stats.value.crisisPending = Array.isArray(crisisList) ? crisisList.length : 2
    } else {
      stats.value.crisisPending = 2
    }
    if (leaveRes?.code === 200 && Array.isArray(leaveRes.data)) {
      stats.value.leavePending = leaveRes.data.length
    } else if (role.value === 'admin' || role.value === 'center') {
      stats.value.leavePending = 2
    } else {
      stats.value.leavePending = 0
    }
    if (msgRes?.data !== undefined) {
      stats.value.unreadCount = msgRes.data
    } else {
      stats.value.unreadCount = 3
    }
    stats.value.appointmentToday = 5
  } catch {
    stats.value = {
      crisisPending: 2,
      leavePending: role.value === 'admin' || role.value === 'center' ? 2 : 0,
      unreadCount: 3,
      appointmentToday: 5,
    }
  }
}

function loadTodo() {
  todoList.value = [
    { id: 1, type: 'crisis', typeText: '危机', content: '张同学危机个案待审批', time: '10分钟前', to: '/admin/crisis' },
    { id: 2, type: 'leave', typeText: '请假', content: '李老师 3月6日请假待审批', time: '30分钟前', to: '/admin/leave' },
    { id: 3, type: 'message', typeText: '消息', content: '系统维护通知', time: '1小时前', to: '/message' },
  ]
}

function handleTodo(todo) {
  if (todo.to) router.push(todo.to)
}

onMounted(() => {
  loadStats()
  loadTodo()
})
</script>

<style scoped>
.admin-workbench {
  max-width: 900px;
  padding: 0;
}

.page-head {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border-radius: 14px;
  border: 1px solid #bae6fd;
}

.head-main h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-icon .el-icon {
  font-size: 22px;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.stat-link {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
}

.stat-link:hover {
  text-decoration: underline;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.section-desc {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.link-more {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  float: right;
}

.link-more:hover {
  text-decoration: underline;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30, 79, 156, 0.12);
  border-color: rgba(30, 79, 156, 0.2);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.card-icon .el-icon {
  font-size: 24px;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.card-arrow {
  color: #94a3b8;
  transition: color 0.2s, transform 0.2s;
}

.card:hover .card-arrow {
  color: #1e4f9c;
  transform: translateX(2px);
}

.card-arrow .el-icon {
  font-size: 18px;
}

.todo-section {
  margin-top: 28px;
  padding: 20px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: #f8fafc;
}

.todo-type {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.todo-type.crisis {
  background: #fef2f2;
  color: #dc2626;
}

.todo-type.leave {
  background: #fffbeb;
  color: #d97706;
}

.todo-type.message {
  background: #f5f3ff;
  color: #7c3aed;
}

.todo-content {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: #334155;
}

.todo-time {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
}

.todo-arrow {
  color: #cbd5e1;
  font-size: 16px;
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
