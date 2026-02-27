<template>
  <div class="activity-view">
    <h2>活动记录查看</h2>
    
    <!-- 子女切换器 -->
    <div class="child-selector">
      <label>选择子女：</label>
      <select v-model="selectedChild" @change="switchChild">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.studentId }})
        </option>
      </select>
    </div>

    <!-- 活动记录 -->
    <div class="activity-records">
      <h3>活动记录</h3>
      <div v-if="currentActivities.length === 0" class="empty-state">
        <p>暂无活动记录</p>
      </div>
      <div v-else class="records-grid">
        <div v-for="activity in currentActivities" :key="activity.id" class="activity-card">
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.title" />
          </div>
          <div class="activity-content">
            <h4>{{ activity.title }}</h4>
            <div class="activity-info">
              <p><span class="label">时间：</span>{{ activity.time }}</p>
              <p><span class="label">地点：</span>{{ activity.location }}</p>
              <p><span class="label">状态：</span><span :class="['status', activity.status]">{{ activity.status }}</span></p>
            </div>
            <div class="activity-actions">
              <button class="action-btn view-btn" @click="viewActivity(activity.id)">
                查看详情
              </button>
              <button 
                v-if="activity.status === '已报名'" 
                class="action-btn cancel-btn" 
                @click="cancelActivity(activity.id)"
              >
                取消报名
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="activity-stats">
      <h3>活动统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ currentActivities.length }}</span>
          <span class="stat-label">总参与活动</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ registeredActivities }}</span>
          <span class="stat-label">已报名</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ completedActivities }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ feedbackSubmittedActivities }}</span>
          <span class="stat-label">已提交反馈</span>
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
    studentId: '2024001'
  },
  {
    id: '2',
    name: '李四',
    studentId: '2024002'
  }
])

// 模拟活动数据
const activities = ref([
  {
    id: '1',
    childId: '1',
    title: '情绪管理工作坊',
    time: '2026-03-10 14:00-16:00',
    location: '心理健康中心活动室',
    status: '已报名',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mental%20health%20workshop%20activity&image_size=landscape_4_3'
  },
  {
    id: '2',
    childId: '1',
    title: '正念冥想体验',
    time: '2026-02-20 16:00-17:00',
    location: '瑜伽室',
    status: '已完成',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mindfulness%20meditation%20activity&image_size=landscape_4_3'
  },
  {
    id: '3',
    childId: '1',
    title: '压力管理讲座',
    time: '2026-02-15 15:00-17:00',
    location: '学术报告厅',
    status: '已完成',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stress%20management%20lecture&image_size=landscape_4_3'
  },
  {
    id: '4',
    childId: '2',
    title: '人际关系小组',
    time: '每周三 16:00-17:30',
    location: '心理咨询室',
    status: '已报名',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=interpersonal%20relationship%20group%20activity&image_size=landscape_4_3'
  }
])

const currentActivities = computed(() => {
  return activities.value.filter(activity => activity.childId === selectedChild.value)
})

const registeredActivities = computed(() => {
  return currentActivities.value.filter(activity => activity.status === '已报名').length
})

const completedActivities = computed(() => {
  return currentActivities.value.filter(activity => activity.status === '已完成').length
})

const feedbackSubmittedActivities = computed(() => {
  // 模拟已提交反馈的活动数量
  return Math.floor(completedActivities.value * 0.7)
})

const switchChild = () => {
  // 切换子女逻辑
  console.log('切换到子女：', selectedChild.value)
}

const viewActivity = (id) => {
  // 查看活动详情
  alert('查看活动详情功能正在开发中')
}

const cancelActivity = (id) => {
  if (confirm('确定要取消报名该活动吗？')) {
    const activity = activities.value.find(a => a.id === id)
    if (activity) {
      activity.status = '已取消'
      alert('报名已取消')
    }
  }
}
</script>

<style scoped>
.activity-view {
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

.activity-records {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.activity-records h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.activity-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.activity-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
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

.activity-content h4 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.1rem;
}

.activity-info {
  margin-bottom: 20px;
}

.activity-info p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95rem;
}

.activity-info .label {
  font-weight: 500;
  color: #666;
}

.status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
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

.activity-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.view-btn:hover {
  background: #e9ecef;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

.activity-stats {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.activity-stats h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .activity-view {
    padding: 15px;
  }

  .child-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .child-selector select {
    max-width: none;
  }

  .activity-records,
  .activity-stats {
    padding: 20px;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }

  .activity-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
