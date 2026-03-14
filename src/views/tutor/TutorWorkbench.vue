<template>
  <div class="tutor-workbench">
    <div class="page-head">
      <div class="head-main">
        <h2>辅导员工作台</h2>
        <p class="page-desc">查看待办事项、风险预警与快捷操作。</p>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card" v-for="stat in statsData" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="section-row">
      <div class="section-card">
        <div class="section-header">
          <h3>待办事项</h3>
          <el-button type="primary" link>查看全部</el-button>
        </div>
        <div class="todo-list">
          <div class="todo-item" v-for="todo in todoList" :key="todo.id">
            <span class="todo-type" :class="todo.type">{{ todo.typeText }}</span>
            <span class="todo-content">{{ todo.content }}</span>
            <span class="todo-time">{{ todo.time }}</span>
          </div>
          <el-empty v-if="todoList.length === 0" description="暂无待办事项" />
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>风险学生预警</h3>
          <el-button type="primary" link @click="$router.push('/admin/tutor-students')">查看全部</el-button>
        </div>
        <div class="risk-list">
          <div class="risk-item" v-for="student in riskStudents" :key="student.id">
            <el-avatar :size="36">{{ student.name.slice(-2) }}</el-avatar>
            <div class="risk-info">
              <span class="risk-name">{{ student.name }}</span>
              <span class="risk-class">{{ student.className }}</span>
            </div>
            <el-tag :type="getRiskTagType(student.level)" size="small">{{ student.levelText }}</el-tag>
            <el-button type="primary" link size="small" @click="viewStudentDetail(student)">查看</el-button>
          </div>
          <el-empty v-if="riskStudents.length === 0" description="暂无风险学生" />
        </div>
      </div>
    </div>

    <div class="section-row">
      <div class="section-card full">
        <div class="section-header">
          <h3>快捷操作</h3>
        </div>
        <div class="quick-actions">
          <div class="action-item" v-for="action in quickActions" :key="action.label" @click="action.handler">
            <div class="action-icon" :style="{ background: action.color }">
              <el-icon><component :is="action.icon" /></el-icon>
            </div>
            <span class="action-label">{{ action.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Warning,
  Bell,
  Document,
  Calendar,
  Edit,
  Plus,
  DataAnalysis,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '../../api/request'

const router = useRouter()

const statsData = ref([
  { label: '负责学生', value: 0, color: 'linear-gradient(135deg, #1e4f9c, #2563eb)', icon: User },
  { label: '风险预警', value: 0, color: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: Warning },
  { label: '待处理事项', value: 0, color: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: Bell },
  { label: '本月上报', value: 0, color: 'linear-gradient(135deg, #10b981, #059669)', icon: Document },
])

const todoList = ref([])
const riskStudents = ref([])

const quickActions = [
  {
    label: '危机上报',
    icon: Warning,
    color: 'linear-gradient(135deg, #ef4444, #dc2626)',
    handler: () => router.push('/admin/tutor-crisis-report'),
  },
  {
    label: '学生管理',
    icon: User,
    color: 'linear-gradient(135deg, #1e4f9c, #2563eb)',
    handler: () => router.push('/admin/tutor-students'),
  },
  {
    label: '测评查看',
    icon: DataAnalysis,
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    handler: () => router.push('/admin/tutor-assessment'),
  },
  {
    label: '活动管理',
    icon: Calendar,
    color: 'linear-gradient(135deg, #10b981, #059669)',
    handler: () => router.push('/activity/manage'),
  },
  {
    label: '月报填写',
    icon: Edit,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    handler: () => router.push('/admin/tutor-report'),
  },
  {
    label: '添加学生',
    icon: Plus,
    color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    handler: () => ElMessage.info('功能开发中'),
  },
]

const getRiskTagType = (level) => {
  const map = { red: 'danger', orange: 'warning', yellow: '', green: 'success' }
  return map[level] || 'info'
}

const viewStudentDetail = (student) => {
  router.push(`/admin/tutor-students/${student.id}`)
}

const loadData = async () => {
  try {
    const res = await request.get('/api/stats/overview')
    if (res.code === 200 && res.data) {
      statsData.value[0].value = res.data.totalStudents || 0
      statsData.value[1].value = res.data.riskCount || 0
      statsData.value[2].value = res.data.todoCount || 0
      statsData.value[3].value = res.data.reportCount || 0
    }
  } catch (e) {
    statsData.value[0].value = 128
    statsData.value[1].value = 5
    statsData.value[2].value = 3
    statsData.value[3].value = 2
  }

  try {
    const res = await request.get('/api/center/approval/list', { params: { type: 'tutor' } })
    if (res.code === 200 && res.data) {
      todoList.value = res.data
    }
  } catch (e) {
    todoList.value = [
      { id: 1, type: 'crisis', typeText: '危机', content: '张某某心理危机需要跟进', time: '2小时前' },
      { id: 2, type: 'assessment', typeText: '测评', content: '新生心理普查待提醒', time: '今天' },
      { id: 3, type: 'activity', typeText: '活动', content: '心理健康主题班会待开展', time: '本周' },
    ]
  }

  try {
    const res = await request.get('/api/center/archive/students', { params: { riskOnly: true } })
    if (res.code === 200 && res.data) {
      riskStudents.value = res.data
    }
  } catch (e) {
    riskStudents.value = [
      { id: 1, name: '张明华', className: '计科2201', level: 'red', levelText: '极高危' },
      { id: 2, name: '李晓红', className: '计科2202', level: 'orange', levelText: '高危' },
      { id: 3, name: '王建国', className: '计科2201', level: 'yellow', levelText: '中危' },
    ]
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.tutor-workbench {
  max-width: 1200px;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-icon .el-icon {
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.section-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.section-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.section-card.full {
  grid-column: 1 / -1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.todo-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.todo-type.crisis {
  background: #fef2f2;
  color: #dc2626;
}

.todo-type.assessment {
  background: #f0fdf4;
  color: #16a34a;
}

.todo-type.activity {
  background: #eff6ff;
  color: #2563eb;
}

.todo-content {
  flex: 1;
  font-size: 14px;
  color: #334155;
}

.todo-time {
  font-size: 12px;
  color: #94a3b8;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.risk-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.risk-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.risk-class {
  font-size: 12px;
  color: #64748b;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-item:hover {
  background: #f1f5f9;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.action-icon .el-icon {
  font-size: 24px;
}

.action-label {
  font-size: 13px;
  color: #475569;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .section-row {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
