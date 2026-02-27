<template>
  <div class="assessment-view">
    <h2>测评情况查看</h2>
    
    <!-- 子女切换器 -->
    <div class="child-selector">
      <label>选择子女：</label>
      <select v-model="selectedChild" @change="switchChild">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.studentId }})
        </option>
      </select>
    </div>

    <!-- 测评记录 -->
    <div class="assessment-records">
      <h3>测评记录</h3>
      <div v-if="currentAssessments.length === 0" class="empty-state">
        <p>暂无测评记录</p>
      </div>
      <div v-else class="records-grid">
        <div v-for="assessment in currentAssessments" :key="assessment.id" class="assessment-card">
          <div class="assessment-header">
            <h4>{{ assessment.title }}</h4>
            <span class="assessment-date">{{ assessment.date }}</span>
          </div>
          <div class="assessment-body">
            <div class="score-section">
              <div class="score-circle">
                <span class="score">{{ assessment.score }}</span>
                <span class="score-label">总分</span>
              </div>
              <span :class="['level', assessment.level]">{{ getLevelText(assessment.level) }}</span>
            </div>
            <div class="assessment-info">
              <p class="duration">用时：{{ assessment.duration }}分钟</p>
              <p class="status">{{ assessment.status }}</p>
            </div>
          </div>
          <div class="assessment-footer">
            <button class="view-btn" @click="viewAssessment(assessment.id)">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 测评统计 -->
    <div class="assessment-stats">
      <h3>测评统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ currentAssessments.length }}</span>
          <span class="stat-label">总测评次数</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ completedAssessments }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ pendingAssessments }}</span>
          <span class="stat-label">待完成</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ averageScore.toFixed(1) }}</span>
          <span class="stat-label">平均得分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getChildAssessments } from '../../../api/parent.js'

const selectedChild = ref('1')
const loading = ref(false)
const children = ref([])
const assessments = ref([])

onMounted(async () => {
  await loadChildren()
  await loadAssessments()
})

watch(selectedChild, async () => {
  await loadAssessments()
})

const loadChildren = async () => {
  try {
    loading.value = true
    const res = await fetch('/api/parent/children')
    const data = await res.json()
    children.value = data.data || []
    if (children.value.length > 0) {
      selectedChild.value = children.value[0].id
    }
  } catch (error) {
    console.error('加载子女列表失败', error)
  } finally {
    loading.value = false
  }
}

const loadAssessments = async () => {
  try {
    loading.value = true
    const child = children.value.find(c => c.id === selectedChild.value)
    if (child) {
      const res = await getChildAssessments(child.studentId)
      assessments.value = res.data || []
    }
  } catch (error) {
    console.error('加载测评记录失败', error)
  } finally {
    loading.value = false
  }
}

const currentAssessments = computed(() => {
  return assessments.value.filter(assessment => assessment.childId === selectedChild.value)
})

const completedAssessments = computed(() => {
  return currentAssessments.value.filter(assessment => assessment.status === '已完成').length
})

const pendingAssessments = computed(() => {
  return currentAssessments.value.filter(assessment => assessment.status === '待完成').length
})

const averageScore = computed(() => {
  const completed = currentAssessments.value.filter(assessment => assessment.status === '已完成')
  if (completed.length === 0) return 0
  const sum = completed.reduce((total, assessment) => total + assessment.score, 0)
  return sum / completed.length
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

const viewAssessment = (id) => {
  // 查看测评详情
  alert('查看测评详情功能正在开发中')
}
</script>

<style scoped>
.assessment-view {
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

.assessment-records {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.assessment-records h3 {
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

.assessment-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.assessment-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.assessment-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.assessment-date {
  font-size: 0.85rem;
  color: #666;
}

.assessment-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.score-label {
  font-size: 0.8rem;
  opacity: 0.9;
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

.assessment-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.assessment-footer {
  text-align: right;
}

.view-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background: #e9ecef;
}

.assessment-stats {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.assessment-stats h3 {
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
  .assessment-view {
    padding: 15px;
  }

  .child-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .child-selector select {
    max-width: none;
  }

  .assessment-records,
  .assessment-stats {
    padding: 20px;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }

  .assessment-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
