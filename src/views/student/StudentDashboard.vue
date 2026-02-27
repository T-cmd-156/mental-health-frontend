<template>
  <div class="student-dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>学生工作台</h1>
        <p class="subtitle">欢迎回来，{{ userName || '同学' }}</p>
      </div>
    </header>
    <div class="cards">
      <section
        v-for="(item, index) in menuItems"
        :key="item.path || item.title"
        class="card"
        :class="{ placeholder: item.placeholder }"
        @click="!item.placeholder && go(item.path)"
      >
        <div class="card-accent" :style="{ background: item.color }"></div>
        <div class="card-icon" :style="{ background: item.color }">
          <component :is="item.icon" />
        </div>
        <div class="card-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <span v-if="!item.placeholder" class="card-arrow"><ArrowRight /></span>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  Plus,
  ChatDotRound,
  EditPen,
  Reading,
  Bell,
  Warning,
  ArrowRight,
} from '@element-plus/icons-vue'

const router = useRouter()
const userName = computed(
  () => localStorage.getItem('user_name') || localStorage.getItem('User_name') || ''
)

const menuItems = [
  {
    title: '我的预约',
    desc: '查看、填写或取消心理咨询预约',
    path: '/my-appointment',
    color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    icon: Calendar,
  },
  {
    title: '在线预约',
    desc: '选择时间与咨询师进行预约',
    path: '/appointment/select',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: Plus,
  },
  {
    title: '心理测评',
    desc: '完成心理测评任务，查看测评结果',
    path: '/student/assessment',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    icon: EditPen,
  },
  {
    title: '团体活动',
    desc: '查看和报名心理健康团体活动',
    path: '/student/activity',
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: Bell,
  },
  {
    title: '心理自助',
    desc: '心理百科、美文、微课、音乐调节与课程',
    path: '/student/self-help',
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    icon: Reading,
  },
  {
    title: '危机上报',
    desc: '危机事件上报与求助',
    path: '/student/crisis',
    color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    icon: Warning,
  },
  {
    title: '个人档案',
    desc: '查看个人心理档案和历史记录',
    path: '/student/profile',
    color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    icon: ChatDotRound,
  },
]

function go(path) {
  router.push(path)
}
</script>

<style scoped>
.student-dashboard {
  min-height: 100vh;
  padding: 28px 24px 48px;
  background: linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 35%, #f5f7fa 70%, #fafbfc 100%);
}

.dashboard-header {
  margin-bottom: 32px;
  padding: 24px 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(30, 79, 156, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.12);
}

.header-content h1 {
  margin: 0 0 6px 0;
  font-size: 26px;
  font-weight: 700;
  color: #1e3a5f;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}

.card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 18px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.card:not(.placeholder):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(30, 79, 156, 0.14);
}

.card.placeholder {
  cursor: default;
  opacity: 0.92;
}

.card-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.card-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.card-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card h3 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #64748b;
}

.card-arrow {
  flex-shrink: 0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  transition: color 0.2s, transform 0.2s;
}

.card:not(.placeholder):hover .card-arrow {
  color: #3b82f6;
  transform: translateX(2px);
}

.card-arrow :deep(svg) {
  width: 18px;
  height: 18px;
}

@media (max-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
