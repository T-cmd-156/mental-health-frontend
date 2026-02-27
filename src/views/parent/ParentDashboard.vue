<template>
  <div class="parent-dashboard">
    <div class="dashboard-header">
      <h1>家长工作台</h1>
      <p class="welcome-text">欢迎您，{{ userName }}</p>
    </div>

    <!-- 子女切换器 -->
    <div class="child-selector">
      <label>选择子女：</label>
      <select v-model="selectedChild" @change="switchChild">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.studentId }})
        </option>
      </select>
      <button class="add-child-btn" @click="goToChildManagement">
        管理子女
      </button>
    </div>

    <div class="dashboard-content">
      <!-- 子女概览卡片 -->
      <div class="info-card">
        <h3>子女概览</h3>
        <div class="info-item">
          <span class="label">姓名：</span>
          <span class="value">{{ currentChild.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">学号：</span>
          <span class="value">{{ currentChild.studentId }}</span>
        </div>
        <div class="info-item">
          <span class="label">班级：</span>
          <span class="value">{{ currentChild.class }}</span>
        </div>
        <div class="info-item">
          <span class="label">学院：</span>
          <span class="value">{{ currentChild.college }}</span>
        </div>
      </div>

      <!-- 最近通知 -->
      <div class="info-card">
        <h3>最近通知</h3>
        <div class="notification-list">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item">
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.content }}</p>
            </div>
            <span class="notification-date">{{ notification.date }}</span>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="info-card">
        <h3>快捷操作</h3>
        <div class="quick-actions">
          <button class="action-btn" @click="goToChildManagement">
            <span class="icon">👨‍👩‍👧‍👦</span>
            <span class="text">子女管理</span>
          </button>
          <button class="action-btn" @click="goToAssessment">
            <span class="icon">📋</span>
            <span class="text">测评情况</span>
          </button>
          <button class="action-btn" @click="goToAppointment">
            <span class="icon">📅</span>
            <span class="text">预约咨询</span>
          </button>
          <button class="action-btn" @click="goToActivity">
            <span class="icon">🎯</span>
            <span class="text">活动记录</span>
          </button>
          <button class="action-btn" @click="goToProfile">
            <span class="icon">📚</span>
            <span class="text">成长档案</span>
          </button>
          <button class="action-btn" @click="goToContact">
            <span class="icon">📞</span>
            <span class="text">联系辅导员</span>
          </button>
          <button class="action-btn" @click="goToMessage">
            <span class="icon">💬</span>
            <span class="text">留言箱</span>
          </button>
          <button class="action-btn" @click="goToNotices">
            <span class="icon">📢</span>
            <span class="text">通知公告</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')
const selectedChild = ref('1')

// 模拟子女数据
const children = ref([
  {
    id: '1',
    name: '张三',
    studentId: '2024001',
    class: '计算机科学与技术1班',
    college: '计算机学院'
  },
  {
    id: '2',
    name: '李四',
    studentId: '2024002',
    class: '软件工程2班',
    college: '计算机学院'
  }
])

// 模拟通知数据
const notifications = ref([
  {
    id: '1',
    title: '心理健康讲座通知',
    content: '学校将于3月10日举办心理健康讲座，请家长和学生积极参加',
    date: '2026-02-25'
  },
  {
    id: '2',
    title: '测评提醒',
    content: '您的孩子还有一项心理测评未完成，请提醒孩子及时完成',
    date: '2026-02-20'
  }
])

const currentChild = computed(() => {
  return children.value.find(child => child.id === selectedChild.value) || children.value[0]
})

onMounted(() => {
  userName.value = localStorage.getItem('user_name') || '家长'
})

const switchChild = () => {
  // 切换子女逻辑
  console.log('切换到子女：', selectedChild.value)
}

const goToChildManagement = () => {
  router.push('/parent/children')
}

const goToAssessment = () => {
  router.push('/parent/assessment')
}

const goToAppointment = () => {
  router.push('/parent/appointment')
}

const goToActivity = () => {
  router.push('/parent/activity')
}

const goToProfile = () => {
  router.push('/parent/profile')
}

const goToContact = () => {
  router.push('/parent/contact')
}

const goToMessage = () => {
  router.push('/parent/message')
}

const goToNotices = () => {
  router.push('/notices')
}
</script>

<style scoped>
.parent-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.welcome-text {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 子女切换器 */
.child-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto 30px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  color: white;
}

.child-selector label {
  font-weight: 500;
  font-size: 1rem;
}

.child-selector select {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.child-selector select option {
  background: #667eea;
  color: white;
}

.add-child-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-child-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  color: #555;
}

.info-item .label {
  font-weight: 500;
  min-width: 80px;
}

.info-item .value {
  color: #333;
}

/* 通知列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.notification-content h4 {
  margin: 0 0 8px;
  color: #333;
  font-size: 1rem;
}

.notification-content p {
  margin: 0 0 10px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.notification-date {
  font-size: 0.8rem;
  color: #999;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn .icon {
  font-size: 2rem;
}

.action-btn .text {
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .child-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
