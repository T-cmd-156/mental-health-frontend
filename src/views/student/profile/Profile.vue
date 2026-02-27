<template>
  <div class="profile-container">
    <h2>个人心理档案</h2>
    
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
        </div>
      </div>

      <div class="profile-body">
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

        <div class="section">
          <h4>测评记录</h4>
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

        <div class="section">
          <h4>咨询记录</h4>
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

        <div class="section">
          <h4>活动参与</h4>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const profile = ref({
  name: '张三',
  studentId: '2024001',
  gender: 1,
  age: 19,
  college: '计算机学院',
  major: '计算机科学与技术',
  class: '2024级1班',
  contact: {
    phone: '13800138000',
    email: 'zhangsan@example.com',
    emergencyContact: '李四',
    emergencyRelation: '父亲'
  },
  assessmentRecords: [
    {
      id: 1,
      title: '心理健康状况评估',
      date: '2026-02-20',
      score: 75,
      level: 'normal'
    },
    {
      id: 2,
      title: '抑郁倾向测评',
      date: '2026-01-15',
      score: 60,
      level: 'normal'
    }
  ],
  consultationRecords: [
    {
      id: 1,
      date: '2026-02-10',
      counselor: '张老师',
      duration: 50
    },
    {
      id: 2,
      date: '2026-01-25',
      counselor: '李老师',
      duration: 60
    }
  ],
  activityRecords: [
    {
      id: 1,
      title: '情绪管理工作坊',
      date: '2026-03-10',
      status: '已报名'
    },
    {
      id: 2,
      title: '正念冥想体验',
      date: '2026-02-20',
      status: '已完成'
    }
  ]
})

const getLevelText = (level) => {
  const levelMap = {
    excellent: '优秀',
    normal: '良好',
    warning: '需关注',
    danger: '需干预'
  }
  return levelMap[level] || level
}

const viewAssessment = (id) => {
  router.push(`/student/assessment/${id}/result`)
}

const viewConsultation = (id) => {
  alert('咨询记录详情功能正在开发中')
}

const viewActivity = (id) => {
  router.push(`/student/activity/${id}`)
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
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
.consultation-records,
.activity-records {
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
}

.record-score,
.record-counselor,
.record-status {
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

.view-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
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

  .profile-body {
    padding: 20px;
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
