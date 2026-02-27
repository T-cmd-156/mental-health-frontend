<template>
  <div class="activity-detail">
    <div class="activity-header">
      <img :src="activity.image" :alt="activity.title" class="activity-banner" />
      <div class="activity-info">
        <h2>{{ activity.title }}</h2>
        <div class="meta-info">
          <span class="type">{{ getTypeText(activity.type) }}</span>
          <span :class="['status', activity.status]">{{ getStatusText(activity.status) }}</span>
        </div>
        <div class="details">
          <div class="detail-item">
            <span class="label">时间：</span>
            <span class="value">{{ activity.time }}</span>
          </div>
          <div class="detail-item">
            <span class="label">地点：</span>
            <span class="value">{{ activity.location }}</span>
          </div>
          <div class="detail-item">
            <span class="label">人数限制：</span>
            <span class="value">{{ activity.maxParticipants }}人</span>
          </div>
          <div class="detail-item">
            <span class="label">已报名：</span>
            <span class="value">{{ activity.currentParticipants }}人</span>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-body">
      <div class="section">
        <h3>活动介绍</h3>
        <p class="description">{{ activity.description }}</p>
        <div class="content" v-html="activity.content"></div>
      </div>

      <div class="section">
        <h3>主讲人</h3>
        <div class="speaker">
          <div class="speaker-avatar">
            <img :src="activity.speaker.avatar" :alt="activity.speaker.name" />
          </div>
          <div class="speaker-info">
            <h4>{{ activity.speaker.name }}</h4>
            <p class="speaker-title">{{ activity.speaker.title }}</p>
            <p class="speaker-bio">{{ activity.speaker.bio }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-footer">
      <button 
        v-if="activity.status === 'upcoming' && !isJoined" 
        class="join-btn" 
        @click="joinActivity"
      >
        立即报名
      </button>
      <button 
        v-else-if="isJoined && activity.status === 'upcoming'" 
        class="joined-btn" 
        @click="cancelJoin"
      >
        取消报名
      </button>
      <button 
        v-else-if="isJoined && activity.status === 'ongoing'" 
        class="checkin-btn" 
        @click="checkinActivity"
      >
        活动签到
      </button>
      <button 
        v-else-if="isJoined && activity.status === 'ended'" 
        class="feedback-btn" 
        @click="submitFeedback"
      >
        提交反馈
      </button>
      <button 
        class="back-btn" 
        @click="goBack"
      >
        返回列表
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activityId = route.params.id

const activity = ref({
  id: 1,
  title: '情绪管理工作坊',
  description: '学习如何有效管理情绪，提高心理健康水平',
  content: '<p>本工作坊将通过理论讲解、互动练习和小组讨论等方式，帮助参与者学习情绪管理的基本原理和实用技巧。</p><p>内容包括：</p><ul><li>情绪的本质和功能</li><li>常见的情绪调节策略</li><li>压力与情绪的关系</li><li>如何建立健康的情绪表达模式</li></ul><p>通过本工作坊，参与者将能够：</p><ul><li>更好地识别和理解自己的情绪</li><li>掌握有效的情绪调节技巧</li><li>提高应对压力的能力</li><li>建立更健康的人际关系</li></ul>',
  type: 'workshop',
  status: 'upcoming',
  time: '2026-03-10 14:00-16:00',
  location: '心理健康中心活动室',
  maxParticipants: 20,
  currentParticipants: 15,
  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mental%20health%20workshop%20activity&image_size=landscape_16_9',
  speaker: {
    name: '张老师',
    title: '心理咨询师',
    bio: '拥有10年心理咨询经验，专注于情绪管理和压力应对领域',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20counselor%20portrait&image_size=square'
  }
})

const isJoined = ref(false)

onMounted(() => {
  // 模拟检查是否已报名
  isJoined.value = Math.random() > 0.5
})

const getTypeText = (type) => {
  const typeMap = {
    lecture: '讲座',
    workshop: '工作坊',
    group: '小组活动'
  }
  return typeMap[type] || type
}

const getStatusText = (status) => {
  const statusMap = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束'
  }
  return statusMap[status] || status
}

const joinActivity = () => {
  if (activity.value.currentParticipants >= activity.value.maxParticipants) {
    alert('活动人数已满')
    return
  }
  
  // 模拟报名
  setTimeout(() => {
    isJoined.value = true
    activity.value.currentParticipants++
    alert('报名成功')
  }, 500)
}

const cancelJoin = () => {
  // 模拟取消报名
  setTimeout(() => {
    isJoined.value = false
    activity.value.currentParticipants--
    alert('取消报名成功')
  }, 500)
}

const checkinActivity = () => {
  alert('签到成功')
}

const submitFeedback = () => {
  // 模拟提交反馈
  alert('反馈提交功能正在开发中')
}

const goBack = () => {
  router.push('/student/activity')
}
</script>

<style scoped>
.activity-detail {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.activity-header {
  margin-bottom: 30px;
}

.activity-banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
}

.activity-info h2 {
  margin: 0 0 10px;
  color: #333;
}

.meta-info {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.type, .status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.type {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.status {
  color: white;
}

.status.upcoming {
  background: #17a2b8;
}

.status.ongoing {
  background: #28a745;
}

.status.ended {
  background: #6c757d;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.detail-item .label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.detail-item .value {
  color: #333;
}

.activity-body {
  margin-bottom: 30px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section h3 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.1rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
}

.content {
  color: #555;
  line-height: 1.6;
}

.content p {
  margin-bottom: 15px;
}

.content ul {
  margin-bottom: 15px;
  padding-left: 20px;
}

.content li {
  margin-bottom: 8px;
}

.speaker {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.speaker-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.speaker-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.speaker-info {
  flex: 1;
}

.speaker-info h4 {
  margin: 0 0 5px;
  color: #333;
}

.speaker-title {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 10px;
}

.speaker-bio {
  color: #555;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

.activity-footer {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.join-btn, .joined-btn, .checkin-btn, .feedback-btn, .back-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.join-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
  transform: translateY(-1px);
}

.joined-btn {
  background: #dc3545;
  color: white;
}

.joined-btn:hover {
  background: #c82333;
}

.checkin-btn {
  background: #28a745;
  color: white;
}

.checkin-btn:hover {
  background: #218838;
}

.feedback-btn {
  background: #ffc107;
  color: #333;
}

.feedback-btn:hover {
  background: #e0a800;
}

.back-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.back-btn:hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .activity-detail {
    padding: 15px;
  }

  .activity-banner {
    height: 200px;
  }

  .details {
    flex-direction: column;
    gap: 10px;
  }

  .speaker {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .activity-footer {
    flex-direction: column;
  }

  .join-btn, .joined-btn, .checkin-btn, .feedback-btn, .back-btn {
    width: 100%;
  }
}
</style>
