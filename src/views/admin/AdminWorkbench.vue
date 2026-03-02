<template>
  <div class="admin-workbench">
    <p class="desc">待办协同、消息提醒、日程查阅。根据角色展示不同入口。</p>
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
  </div>
</template>

<script setup>
import { Calendar, CircleCheck, Warning, Bell, ArrowRight } from '@element-plus/icons-vue'

const entries = [
  {
    title: '预约管理',
    desc: '查看与处理咨询预约',
    to: '/admin/appointments',
    color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    icon: Calendar,
  },
  {
    title: '危机审批',
    desc: '危机个案上报与协同审批',
    to: '/admin/crisis',
    color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    icon: Warning,
  },
  {
    title: '请假审批',
    desc: '咨询师请假申请审批',
    to: '/admin/leave',
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: CircleCheck,
  },
  {
    title: '消息中心',
    desc: '系统消息与待办提醒',
    to: '/message',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    icon: Bell,
  },
]
</script>

<style scoped>
.admin-workbench {
  max-width: 720px;
}

.desc {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #64748b;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

@media (max-width: 560px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
