<template>
  <div class="profile-view">
    <div class="profile-header-section">
      <h2>成长档案查看</h2>
      <div class="profile-actions">
        <button class="export-btn" @click="exportProfile">
          导出档案
        </button>
      </div>
    </div>
    
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
          <span class="value">{{ profile.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">学号：</span>
          <span class="value">{{ profile.studentId }}</span>
        </div>
        <div class="info-item">
          <span class="label">性别：</span>
          <span class="value">{{ profile.gender === 1 ? '男' : '女' }}</span>
        </div>
        <div class="info-item">
          <span class="label">年龄：</span>
          <span class="value">{{ profile.age }}岁</span>
        </div>
        <div class="info-item">
          <span class="label">出生日期：</span>
          <span class="value">{{ profile.birthday }}</span>
        </div>
        <div class="info-item">
          <span class="label">民族：</span>
          <span class="value">{{ profile.nation }}</span>
        </div>
      </div>
    </div>

    <!-- 学业信息 -->
    <div class="profile-card">
      <h3>学业信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">学院：</span>
          <span class="value">{{ profile.college }}</span>
        </div>
        <div class="info-item">
          <span class="label">专业：</span>
          <span class="value">{{ profile.major }}</span>
        </div>
        <div class="info-item">
          <span class="label">班级：</span>
          <span class="value">{{ profile.class }}</span>
        </div>
        <div class="info-item">
          <span class="label">入学时间：</span>
          <span class="value">{{ profile.enrollmentDate }}</span>
        </div>
        <div class="info-item">
          <span class="label">学业状态：</span>
          <span class="value">{{ profile.academicStatus }}</span>
        </div>
      </div>
    </div>

    <!-- 健康信息 -->
    <div class="profile-card">
      <h3>健康信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">身体状况：</span>
          <span class="value">{{ profile.healthStatus }}</span>
        </div>
        <div class="info-item">
          <span class="label">既往病史：</span>
          <span class="value">{{ profile.medicalHistory || '无' }}</span>
        </div>
        <div class="info-item">
          <span class="label">过敏史：</span>
          <span class="value">{{ profile.allergyHistory || '无' }}</span>
        </div>
      </div>
    </div>

    <!-- 联系方式 -->
    <div class="profile-card">
      <h3>联系方式</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">手机：</span>
          <span class="value">{{ profile.contact.phone }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ profile.contact.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">紧急联系人：</span>
          <span class="value">{{ profile.contact.emergencyContact }}（{{ profile.contact.emergencyRelation }}）</span>
        </div>
      </div>
    </div>

    <!-- 标签系统 -->
    <div class="profile-card">
      <h3>标签系统</h3>
      <div v-if="profile.tags.length === 0" class="empty-section">
        <p>暂无标签</p>
      </div>
      <div v-else class="tags-container">
        <span v-for="tag in profile.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <!-- 心理测评档案 -->
    <div class="profile-card">
      <h3>心理测评档案</h3>
      <div v-if="profile.assessmentRecords.length === 0" class="empty-section">
        <p>暂无测评记录</p>
      </div>
      <div v-else class="assessment-list">
        <div v-for="assessment in profile.assessmentRecords" :key="assessment.id" class="assessment-item">
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

    <!-- 访谈档案 -->
    <div class="profile-card">
      <h3>访谈档案</h3>
      <div v-if="profile.interviewRecords.length === 0" class="empty-section">
        <p>暂无访谈记录</p>
      </div>
      <div v-else class="interview-list">
        <div v-for="interview in profile.interviewRecords" :key="interview.id" class="interview-item">
          <div class="interview-header">
            <span class="interview-title">{{ interview.title }}</span>
            <span class="interview-date">{{ interview.date }}</span>
          </div>
          <div class="interview-body">
            <span class="interviewer">访谈者：{{ interview.interviewer }}</span>
            <span class="duration">{{ interview.duration }}分钟</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 咨询档案 -->
    <div class="profile-card">
      <h3>咨询档案</h3>
      <div v-if="profile.consultationRecords.length === 0" class="empty-section">
        <p>暂无咨询记录</p>
      </div>
      <div v-else class="consultation-list">
        <div v-for="consultation in profile.consultationRecords" :key="consultation.id" class="consultation-item">
          <div class="consultation-header">
            <span class="counselor">{{ consultation.counselor }}</span>
            <span class="consultation-date">{{ consultation.date }}</span>
          </div>
          <div class="consultation-body">
            <span class="duration">{{ consultation.duration }}分钟</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 危机干预档案 -->
    <div class="profile-card">
      <h3>危机干预档案</h3>
      <div v-if="profile.crisisRecords.length === 0" class="empty-section">
        <p>暂无危机干预记录</p>
      </div>
      <div v-else class="crisis-list">
        <div v-for="crisis in profile.crisisRecords" :key="crisis.id" class="crisis-item">
          <div class="crisis-header">
            <span class="crisis-title">{{ crisis.title }}</span>
            <span class="crisis-date">{{ crisis.date }}</span>
          </div>
          <div class="crisis-body">
            <span :class="['level', crisis.level]">{{ getCrisisLevelText(crisis.level) }}</span>
            <span class="status">{{ crisis.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动档案 -->
    <div class="profile-card">
      <h3>活动档案</h3>
      <div v-if="profile.activityRecords.length === 0" class="empty-section">
        <p>暂无活动参与记录</p>
      </div>
      <div v-else class="activity-list">
        <div v-for="activity in profile.activityRecords" :key="activity.id" class="activity-item">
          <div class="activity-header">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-date">{{ activity.date }}</span>
          </div>
          <div class="activity-body">
            <span :class="['status', activity.status]">{{ activity.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 转介记录 -->
    <div class="profile-card">
      <h3>转介记录</h3>
      <div v-if="profile.referralRecords.length === 0" class="empty-section">
        <p>暂无转介记录</p>
      </div>
      <div v-else class="referral-list">
        <div v-for="referral in profile.referralRecords" :key="referral.id" class="referral-item">
          <div class="referral-header">
            <span class="referral-title">{{ referral.title }}</span>
            <span class="referral-date">{{ referral.date }}</span>
          </div>
          <div class="referral-body">
            <span class="target">转介机构：{{ referral.target }}</span>
            <span class="reason">转介原因：{{ referral.reason }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 行为记录 -->
    <div class="profile-card">
      <h3>行为记录</h3>
      <div v-if="profile.behaviorRecords.length === 0" class="empty-section">
        <p>暂无行为记录</p>
      </div>
      <div v-else class="behavior-list">
        <div v-for="behavior in profile.behaviorRecords" :key="behavior.id" class="behavior-item">
          <div class="behavior-header">
            <span class="behavior-title">{{ behavior.title }}</span>
            <span class="behavior-date">{{ behavior.date }}</span>
          </div>
          <div class="behavior-body">
            <span class="type">{{ behavior.type }}</span>
            <span class="description">{{ behavior.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getChildProfile } from '../../../api/parent.js'

const selectedChild = ref('1')
const loading = ref(false)
const children = ref([])
const profile = ref({
  name: '',
  studentId: '',
  gender: 1,
  age: 0,
  birthday: '',
  nation: '',
  college: '',
  major: '',
  class: '',
  enrollmentDate: '',
  academicStatus: '',
  healthStatus: '',
  medicalHistory: '',
  allergyHistory: '',
  contact: {
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyRelation: ''
  },
  tags: [],
  assessmentRecords: [],
  interviewRecords: [],
  consultationRecords: [],
  crisisRecords: [],
  activityRecords: [],
  referralRecords: [],
  behaviorRecords: []
})

onMounted(async () => {
  await loadChildren()
  await loadProfile()
})

watch(selectedChild, async () => {
  await loadProfile()
})

const loadChildren = async () => {
  try {
    loading.value = true
    // 模拟数据
    children.value = [
      {
        id: '1',
        name: '张三',
        studentId: '2024001'
      },
      {
        id: '2',
        name: '李四',
        studentId: '2024002'
      }
    ]
    if (children.value.length > 0) {
      selectedChild.value = children.value[0].id
    }
  } catch (error) {
    console.error('加载子女列表失败', error)
  } finally {
    loading.value = false
  }
}

const loadProfile = async () => {
  try {
    loading.value = true
    // 模拟数据
    profile.value = {
      name: '张三',
      studentId: '2024001',
      gender: 1,
      age: 19,
      birthday: '2007-01-01',
      nation: '汉族',
      college: '计算机学院',
      major: '计算机科学与技术',
      class: '计算机科学与技术1班',
      enrollmentDate: '2024-09-01',
      academicStatus: '正常',
      healthStatus: '良好',
      medicalHistory: '',
      allergyHistory: '',
      contact: {
        phone: '13800138000',
        email: 'zhangsan@example.com',
        emergencyContact: '张父',
        emergencyRelation: '父亲'
      },
      tags: ['积极向上', '学习认真', '团队合作'],
      assessmentRecords: [
        {
          id: 1,
          title: '心理健康状况评估',
          date: '2026-02-15',
          score: 75,
          level: 'normal'
        },
        {
          id: 2,
          title: '抑郁倾向测评',
          date: '2026-01-20',
          score: 60,
          level: 'excellent'
        }
      ],
      interviewRecords: [
        {
          id: 1,
          title: '入学访谈',
          date: '2024-09-15',
          interviewer: '李老师',
          duration: 30
        }
      ],
      consultationRecords: [
        {
          id: 1,
          date: '2026-02-10',
          counselor: '王老师',
          duration: 50
        }
      ],
      crisisRecords: [
        {
          id: 1,
          title: '学业压力危机',
          date: '2026-01-05',
          level: 'yellow',
          status: '已干预'
        }
      ],
      activityRecords: [
        {
          id: 1,
          title: '心理健康讲座',
          date: '2026-02-20',
          status: '已参与'
        }
      ],
      referralRecords: [],
      behaviorRecords: []
    }
  } catch (error) {
    console.error('加载成长档案失败', error)
  } finally {
    loading.value = false
  }
}

const currentChild = computed(() => {
  return children.value.find(child => child.id === selectedChild.value) || children.value[0]
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

const getCrisisLevelText = (level) => {
  const levelMap = {
    red: '红色（极高危）',
    orange: '橙色（高危）',
    yellow: '黄色（中危）',
    blue: '蓝色（轻度）',
    green: '绿色（正常/关注）'
  }
  return levelMap[level] || level
}

const exportProfile = () => {
  alert('档案导出功能正在开发中')
}
</script>

<style scoped>
.profile-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.profile-actions {
  display: flex;
  gap: 10px;
}

.export-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
  transform: translateY(-1px);
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

/* 标签系统 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 6px 16px;
  background: #f0f5ff;
  color: #667eea;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #e0e7ff;
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

.level.red {
  background: #dc3545;
}

.level.orange {
  background: #fd7e14;
}

.level.yellow {
  background: #ffc107;
  color: #333;
}

.level.blue {
  background: #17a2b8;
}

.level.green {
  background: #28a745;
}

/* 访谈档案 */
.interview-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.interview-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #fd7e14;
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.interview-title {
  font-weight: 500;
  color: #333;
}

.interview-date {
  font-size: 0.85rem;
  color: #666;
}

.interview-body {
  display: flex;
  gap: 20px;
  align-items: center;
}

.interviewer {
  color: #555;
  font-size: 0.95rem;
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

.duration {
  color: #555;
  font-size: 0.95rem;
}

/* 危机干预档案 */
.crisis-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.crisis-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #dc3545;
}

.crisis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.crisis-title {
  font-weight: 500;
  color: #333;
}

.crisis-date {
  font-size: 0.85rem;
  color: #666;
}

.crisis-body {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* 活动档案 */
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

.status.已参与 {
  background: #28a745;
}

/* 转介记录 */
.referral-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.referral-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #6f42c1;
}

.referral-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.referral-title {
  font-weight: 500;
  color: #333;
}

.referral-date {
  font-size: 0.85rem;
  color: #666;
}

.referral-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.target,
.reason {
  color: #555;
  font-size: 0.95rem;
}

/* 行为记录 */
.behavior-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.behavior-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #20c997;
}

.behavior-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.behavior-title {
  font-weight: 500;
  color: #333;
}

.behavior-date {
  font-size: 0.85rem;
  color: #666;
}

.behavior-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.type,
.description {
  color: #555;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 15px;
  }

  .profile-header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
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
  .interview-header,
  .crisis-header,
  .referral-header,
  .behavior-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .assessment-body,
  .consultation-body,
  .activity-body,
  .interview-body,
  .crisis-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
