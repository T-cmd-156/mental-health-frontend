<template>
  <div class="activity-container">
    <h2>团体活动</h2>
    
    <div class="filter-section">
      <div class="filter-item">
        <label>活动类型：</label>
        <select v-model="typeFilter">
          <option value="all">全部</option>
          <option value="lecture">讲座</option>
          <option value="workshop">工作坊</option>
          <option value="group">小组活动</option>
        </select>
      </div>
      <div class="filter-item">
        <label>状态：</label>
        <select v-model="statusFilter">
          <option value="all">全部</option>
          <option value="upcoming">即将开始</option>
          <option value="ongoing">进行中</option>
          <option value="ended">已结束</option>
        </select>
      </div>
    </div>

    <div class="activity-list">
      <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card">
        <div class="activity-image">
          <img :src="activity.image" :alt="activity.title" />
        </div>
        <div class="activity-content">
          <h3>{{ activity.title }}</h3>
          <p class="description">{{ activity.description }}</p>
          <div class="activity-info">
            <span class="time">{{ activity.time }}</span>
            <span class="location">{{ activity.location }}</span>
            <span :class="['status', activity.status]">{{ getStatusText(activity.status) }}</span>
          </div>
          <div class="activity-footer">
            <button 
              v-if="activity.status === 'upcoming'" 
              class="join-btn" 
              @click="joinActivity(activity.id)"
            >
              立即报名
            </button>
            <button 
              v-else 
              class="detail-btn" 
              @click="viewActivity(activity.id)"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="my-activities-link">
      <button class="my-activities-btn" @click="goToMyActivities">
        查看我的活动
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const typeFilter = ref('all')
const statusFilter = ref('all')

// 模拟活动数据
const activities = ref([
  {
    id: 1,
    title: '情绪管理工作坊',
    description: '学习如何有效管理情绪，提高心理健康水平',
    type: 'workshop',
    status: 'upcoming',
    time: '2026-03-10 14:00-16:00',
    location: '心理健康中心活动室',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mental%20health%20workshop%20activity&image_size=landscape_4_3'
  },
  {
    id: 2,
    title: '压力管理讲座',
    description: '专家讲解如何应对学习和生活中的压力',
    type: 'lecture',
    status: 'upcoming',
    time: '2026-03-05 15:00-17:00',
    location: '学术报告厅',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stress%20management%20lecture&image_size=landscape_4_3'
  },
  {
    id: 3,
    title: '人际关系小组',
    description: '通过小组活动改善人际关系技巧',
    type: 'group',
    status: 'ongoing',
    time: '每周三 16:00-17:30',
    location: '心理咨询室',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=interpersonal%20relationship%20group%20activity&image_size=landscape_4_3'
  },
  {
    id: 4,
    title: '正念冥想体验',
    description: '学习正念冥想技巧，提高专注力和内心平静',
    type: 'workshop',
    status: 'ended',
    time: '2026-02-20 16:00-17:00',
    location: '瑜伽室',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mindfulness%20meditation%20activity&image_size=landscape_4_3'
  }
])

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const typeMatch = typeFilter.value === 'all' || activity.type === typeFilter.value
    const statusMatch = statusFilter.value === 'all' || activity.status === statusFilter.value
    return typeMatch && statusMatch
  })
})

const getStatusText = (status) => {
  const statusMap = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束'
  }
  return statusMap[status] || status
}

const joinActivity = (id) => {
  router.push(`/student/activity/${id}`)
}

const viewActivity = (id) => {
  router.push(`/student/activity/${id}`)
}

const goToMyActivities = () => {
  router.push('/student/activity/my')
}
</script>

<style scoped>
.activity-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item label {
  font-weight: 500;
  color: #333;
}

.filter-item select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.activity-image {
  height: 200px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-card:hover .activity-image img {
  transform: scale(1.05);
}

.activity-content {
  padding: 20px;
}

.activity-content h3 {
  margin: 0 0 10px;
  color: #333;
  font-size: 1.1rem;
}

.description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: #666;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 5px;
}

.status.upcoming {
  background: #17a2b8;
  color: white;
}

.status.ongoing {
  background: #28a745;
  color: white;
}

.status.ended {
  background: #6c757d;
  color: white;
}

.activity-footer {
  margin-top: 15px;
}

.join-btn, .detail-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.join-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.join-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
}

.detail-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.detail-btn:hover {
  background: #e9ecef;
}

.my-activities-link {
  text-align: center;
}

.my-activities-btn {
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.my-activities-btn:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-list {
    grid-template-columns: 1fr;
  }
}
</style>
