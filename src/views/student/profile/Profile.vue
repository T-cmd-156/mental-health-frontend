<template>
  <div class="profile-container">
    <div class="profile-header-section">
      <h2>个人心理档案</h2>
      <div class="profile-actions">
        <button class="export-btn" @click="exportProfile">
          导出档案
        </button>
      </div>
    </div>
    
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20portrait&image_size=square" alt="头像" />
        </div>
        <div class="basic-info">
          <h3>{{ profile.name }}</h3>
          <p class="student-id">{{ profile.studentId }}</p>
          <div class="info-row">
            <span class="info-item">性别：{{ profile.gender === 1 ? '男' : '女' }}</span>
            <span class="info-item">年龄：{{ profile.age }}岁</span>
            <span class="info-item">学院：{{ profile.college }}</span>
          </div>
          <div class="info-row">
            <span class="info-item">专业：{{ profile.major }}</span>
            <span class="info-item">班级：{{ profile.class }}</span>
          </div>
          <div class="tags">
            <span v-for="tag in profile.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="profile-body">
        <!-- 基本信息 -->
        <div class="section">
          <h4>基本信息</h4>
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
        <div class="section">
          <h4>学业信息</h4>
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
        <div class="section">
          <h4>健康信息</h4>
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
        <div class="section">
          <h4>联系方式</h4>
          <div class="contact-info">
            <div class="contact-item">
              <span class="label">手机：</span>
              <span class="value">{{ profile.contact.phone }}</span>
            </div>
            <div class="contact-item">
              <span class="label">邮箱：</span>
              <span class="value">{{ profile.contact.email }}</span>
            </div>
            <div class="contact-item">
              <span class="label">紧急联系人：</span>
              <span class="value">{{ profile.contact.emergencyContact }}（{{ profile.contact.emergencyRelation }}）</span>
            </div>
          </div>
        </div>

        <!-- 心理测评档案 -->
        <div class="section">
          <h4>心理测评档案</h4>
          <div class="assessment-records">
            <div v-for="record in profile.assessmentRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">{{ record.title }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span class="record-score">得分：{{ record.score }}</span>
                <span :class="['record-level', record.level]">{{ getLevelText(record.level) }}</span>
                <button class="view-btn" @click="viewAssessment(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 访谈档案 -->
        <div class="section">
          <h4>访谈档案</h4>
          <div class="interview-records">
            <div v-for="record in profile.interviewRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">{{ record.title }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span class="record-interviewer">访谈者：{{ record.interviewer }}</span>
                <span class="record-duration">{{ record.duration }}分钟</span>
                <button class="view-btn" @click="viewInterview(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 咨询档案 -->
        <div class="section">
          <h4>咨询档案</h4>
          <div class="consultation-records">
            <div v-for="record in profile.consultationRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">咨询 {{ record.id }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span class="record-counselor">咨询师：{{ record.counselor }}</span>
                <span class="record-duration">{{ record.duration }}分钟</span>
                <button class="view-btn" @click="viewConsultation(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 危机干预档案 -->
        <div class="section">
          <h4>危机干预档案</h4>
          <div class="crisis-records">
            <div v-for="record in profile.crisisRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">{{ record.title }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span :class="['record-level', record.level]">{{ getCrisisLevelText(record.level) }}</span>
                <span class="record-status">{{ record.status }}</span>
                <button class="view-btn" @click="viewCrisis(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 活动档案 -->
        <div class="section">
          <h4>活动档案</h4>
          <div class="activity-records">
            <div v-for="record in profile.activityRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">{{ record.title }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span class="record-status">{{ record.status }}</span>
                <button class="view-btn" @click="viewActivity(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 转介记录 -->
        <div class="section">
          <h4>转介记录</h4>
          <div class="referral-records">
            <div v-for="record in profile.referralRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">{{ record.title }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span class="record-target">转介机构：{{ record.target }}</span>
                <span class="record-reason">转介原因：{{ record.reason }}</span>
                <button class="view-btn" @click="viewReferral(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 行为记录 -->
        <div class="section">
          <h4>行为记录</h4>
          <div class="behavior-records">
            <div v-for="record in profile.behaviorRecords" :key="record.id" class="record-item">
              <div class="record-header">
                <span class="record-title">{{ record.title }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <span class="record-type">{{ record.type }}</span>
                <span class="record-description">{{ record.description }}</span>
                <button class="view-btn" @click="viewBehavior(record.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../../../api/request.js'

const router = useRouter()
const loading = ref(false)
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
  await loadProfile()
})

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
    console.error('加载个人档案失败', error)
  } finally {
    loading.value = false
  }
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

const viewAssessment = (id) => {
  router.push(`/student/assessment/${id}/result`)
}

const viewInterview = (id) => {
  alert('访谈记录详情功能正在开发中')
}

const viewConsultation = (id) => {
  alert('咨询记录详情功能正在开发中')
}

const viewCrisis = (id) => {
  alert('危机干预记录详情功能正在开发中')
}

const viewActivity = (id) => {
  router.push(`/student/activity/${id}`)
}

const viewReferral = (id) => {
  alert('转介记录详情功能正在开发中')
}

const viewBehavior = (id) => {
  alert('行为记录详情功能正在开发中')
}

const exportProfile = () => {
  alert('档案导出功能正在开发中')
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1000px;
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

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basic-info h3 {
  margin: 0 0 5px;
  font-size: 1.5rem;
}

.student-id {
  margin: 0 0 15px;
  font-size: 1rem;
  opacity: 0.9;
}

.info-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.info-item {
  display: inline-block;
}

.tags {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.profile-body {
  padding: 30px;
}

.section {
  margin-bottom: 30px;
}

.section h4 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.1rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-grid .info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.info-grid .info-item .label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-grid .info-item .value {
  color: #333;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.95rem;
}

.contact-item .label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.contact-item .value {
  color: #333;
}

.assessment-records,
.interview-records,
.consultation-records,
.crisis-records,
.activity-records,
.referral-records,
.behavior-records {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-item {
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.record-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-title {
  font-weight: 500;
  color: #333;
}

.record-date {
  font-size: 0.85rem;
  color: #666;
}

.record-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  flex-wrap: wrap;
  gap: 10px;
}

.record-score,
.record-counselor,
.record-status,
.record-interviewer,
.record-target,
.record-reason,
.record-type,
.record-description {
  color: #555;
}

.record-level {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.record-level.excellent {
  background: #28a745;
}

.record-level.normal {
  background: #17a2b8;
}

.record-level.warning {
  background: #ffc107;
  color: #333;
}

.record-level.danger {
  background: #dc3545;
}

.record-level.red {
  background: #dc3545;
}

.record-level.orange {
  background: #fd7e14;
}

.record-level.yellow {
  background: #ffc107;
  color: #333;
}

.record-level.blue {
  background: #17a2b8;
}

.record-level.green {
  background: #28a745;
}

.view-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.view-btn:hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }

  .profile-header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .info-row {
    flex-wrap: wrap;
    gap: 10px;
  }

  .tags {
    justify-content: center;
  }

  .profile-body {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .record-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .view-btn {
    align-self: flex-end;
  }
}
</style>
