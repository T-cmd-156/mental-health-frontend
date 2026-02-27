<template>
  <div class="profile-view">
    <h2>成长档案查看</h2>
    
    <!-- 子女切换器 -->
    <div class="child-selector">
      <label>选择子女：</label>
      <select v-model="selectedChild" @change="switchChild">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.studentId }})
        </option>
      </select>
    </div>

    <!-- 基本信息 -->
    <div class="profile-card">
      <h3>基本信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">姓名：</span>
          <span class="value">{{ currentChild.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">学号：</span>
          <span class="value">{{ currentChild.studentId }}</span>
        </div>
        <div class="info-item">
          <span class="label">性别：</span>
          <span class="value">{{ currentChild.gender === 1 ? '男' : '女' }}</span>
        </div>
        <div class="info-item">
          <span class="label">年龄：</span>
          <span class="value">{{ currentChild.age }}岁</span>
        </div>
        <div class="info-item">
          <span class="label">班级：</span>
          <span class="value">{{ currentChild.class }}</span>
        </div>
        <div class="info-item">
          <span class="label">学院：</span>
          <span class="value">{{ currentChild.college }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系方式：</span>
          <span class="value">{{ currentChild.contact }}</span>
        </div>
      </div>
    </div>

    <!-- 测评记录 -->
    <div class="profile-card">
      <h3>测评记录</h3>
      <div v-if="currentAssessments.length === 0" class="empty-section">
        <p>暂无测评记录</p>
      </div>
      <div v-else class="assessment-list">
        <div v-for="assessment in currentAssessments" :key="assessment.id" class="assessment-item">
          <div class="assessment-header">
            <span class="assessment-title">{{ assessment.title }}</span>
            <span class="assessment-date">{{ assessment.date }}</span>
          </div>
          <div class="assessment-body">
            <span class="score">得分：{{ assessment.score }}</span>
            <span :class="['level', assessment.level]">{{ getLevelText(assessment.level) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 咨询记录 -->
    <div class="profile-card">
      <h3>咨询记录</h3>
      <div v-if="currentConsultations.length === 0" class="empty-section">
        <p>暂无咨询记录</p>
      </div>
      <div v-else class="consultation-list">
        <div v-for="consultation in currentConsultations" :key="consultation.id" class="consultation-item">
          <div class="consultation-header">
            <span class="counselor">{{ consultation.counselor }}</span>
            <span class="consultation-date">{{ consultation.date }}</span>
          </div>
          <div class="consultation-body">
            <span class="duration">{{ consultation.duration }}分钟</span>
            <span class="method">{{ consultation.method }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动参与 -->
    <div class="profile-card">
      <h3>活动参与</h3>
      <div v-if="currentActivities.length === 0" class="empty-section">
        <p>暂无活动参与记录</p>
      </div>
      <div v-else class="activity-list">
        <div v-for="activity in currentActivities" :key="activity.id" class="activity-item">
          <div class="activity-header">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-date">{{ activity.date }}</span>
          </div>
          <div class="activity-body">
            <span class="location">{{ activity.location }}</span>
            <span :class="['status', activity.status]">{{ activity.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 辅导员评价 -->
    <div class="profile-card">
      <h3>辅导员评价</h3>
      <div v-if="currentEvaluations.length === 0" class="empty-section">
        <p>暂无辅导员评价</p>
      </div>
      <div v-else class="evaluation-list">
        <div v-for="evaluation in currentEvaluations" :key="evaluation.id" class="evaluation-item">
          <div class="evaluation-header">
            <span class="evaluator">{{ evaluation.evaluator }}</span>
            <span class="evaluation-date">{{ evaluation.date }}</span>
          </div>
          <div class="evaluation-body">
            <p class="content">{{ evaluation.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedChild = ref('1')

// 模拟子女数据
const children = ref([
  {
    id: '1',
    name: '张三',
    studentId: '2024001',
    gender: 1,
    age: 19,
    class: '计算机科学与技术1班',
    college: '计算机学院',
    contact: '13800138000'
  },
  {
    id: '2',
    name: '李四',
    studentId: '2024002',
    gender: 0,
    age: 18,
    class: '软件工程2班',
    college: '计算机学院',
    contact: '13800138001'
  }
])

// 模拟测评数据
const assessments = ref([
  {
    id: '1',
    childId: '1',
    title: '心理健康状况评估',
    date: '2026-02-20',
    score: 75,
    level: 'normal'
  },
  {
    id: '2',
    childId: '1',
    title: '抑郁倾向测评',
    date: '2026-01-15',
    score: 60,
    level: 'normal'
  },
  {
    id: '3',
    childId: '2',
    title: '心理健康状况评估',
    date: '2026-02-18',
    score: 85,
    level: 'excellent'
  }
])

// 模拟咨询数据
const consultations = ref([
  {
    id: '1',
    childId: '1',
    counselor: '张老师',
    date: '2026-02-26',
    duration: 50,
    method: '线下咨询'
  },
  {
    id: '2',
    childId: '1',
    counselor: '李老师',
    date: '2026-02-20',
    duration: 60,
    method: '线上咨询'
  },
  {
    id: '3',
    childId: '2',
    counselor: '张老师',
    date: '2026-02-25',
    duration: 45,
    method: '线上咨询'
  }
])

// 模拟活动数据
const activities = ref([
  {
    id: '1',
    childId: '1',
    title: '情绪管理工作坊',
    date: '2026-03-10',
    location: '心理健康中心活动室',
    status: '已报名'
  },
  {
    id: '2',
    childId: '1',
    title: '正念冥想体验',
    date: '2026-02-20',
    location: '瑜伽室',
    status: '已完成'
  },
  {
    id: '3',
    childId: '2',
    title: '人际关系小组',
    date: '2026-03-05',
    location: '心理咨询室',
    status: '已报名'
  }
])

// 模拟辅导员评价数据
const evaluations = ref([
  {
    id: '1',
    childId: '1',
    evaluator: '王辅导员',
    date: '2026-02-10',
    content: '该生学习态度认真，积极参与班级活动，与同学相处融洽，希望继续保持。'
  },
  {
    id: '2',
    childId: '2',
    evaluator: '李辅导员',
    date: '2026-02-05',
    content: '该生性格开朗，乐于助人，学习成绩优异，是班级的积极分子。'
  }
])

const currentChild = computed(() => {
  return children.value.find(child => child.id === selectedChild.value) || children.value[0]
})

const currentAssessments = computed(() => {
  return assessments.value.filter(assessment => assessment.childId === selectedChild.value)
})

const currentConsultations = computed(() => {
  return consultations.value.filter(consultation => consultation.childId === selectedChild.value)
})

const currentActivities = computed(() => {
  return activities.value.filter(activity => activity.childId === selectedChild.value)
})

const currentEvaluations = computed(() => {
  return evaluations.value.filter(evaluation => evaluation.childId === selectedChild.value)
})

const switchChild = () => {
  // 切换子女逻辑
  console.log('切换到子女：', selectedChild.value)
}

const getLevelText = (level) => {
  const levelMap = {
    excellent: '优秀',
    normal: '良好',
    warning: '需关注',
    danger: '需干预'
  }
  return levelMap[level] || level
}
</script>

<style scoped>
.profile-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 子女切换器 */
.child-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.child-selector label {
  font-weight: 500;
  color: #333;
  font-size: 1rem;
}

.child-selector select {
  flex: 1;
  max-width: 400px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.profile-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

/* 基本信息 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-item .label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-item .value {
  color: #333;
  font-size: 0.95rem;
}

/* 空状态 */
.empty-section {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

/* 测评记录 */
.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.assessment-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.assessment-title {
  font-weight: 500;
  color: #333;
}

.assessment-date {
  font-size: 0.85rem;
  color: #666;
}

.assessment-body {
  display: flex;
  gap: 20px;
  align-items: center;
}

.score {
  color: #555;
  font-size: 0.95rem;
}

.level {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
}

.level.excellent {
  background: #28a745;
}

.level.normal {
  background: #17a2b8;
}

.level.warning {
  background: #ffc107;
  color: #333;
}

.level.danger {
  background: #dc3545;
}

/* 咨询记录 */
.consultation-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.consultation-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #17a2b8;
}

.consultation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.counselor {
  font-weight: 500;
  color: #333;
}

.consultation-date {
  font-size: 0.85rem;
  color: #666;
}

.consultation-body {
  display: flex;
  gap: 20px;
  align-items: center;
}

.duration,
.method {
  color: #555;
  font-size: 0.95rem;
}

/* 活动参与 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.activity-title {
  font-weight: 500;
  color: #333;
}

.activity-date {
  font-size: 0.85rem;
  color: #666;
}

.activity-body {
  display: flex;
  gap: 20px;
  align-items: center;
}

.location {
  color: #555;
  font-size: 0.95rem;
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
}

.status.已报名 {
  background: #17a2b8;
}

.status.已完成 {
  background: #28a745;
}

.status.已取消 {
  background: #6c757d;
}

/* 辅导员评价 */
.evaluation-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.evaluation-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.evaluator {
  font-weight: 500;
  color: #333;
}

.evaluation-date {
  font-size: 0.85rem;
  color: #666;
}

.evaluation-body .content {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 15px;
  }

  .child-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .child-selector select {
    max-width: none;
  }

  .profile-card {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .assessment-header,
  .consultation-header,
  .activity-header,
  .evaluation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .assessment-body,
  .consultation-body,
  .activity-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
