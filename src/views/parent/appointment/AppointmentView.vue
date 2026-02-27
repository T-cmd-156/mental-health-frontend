<template>
  <div class="appointment-view">
    <h2>预约咨询查看</h2>
    
    <!-- 子女切换器 -->
    <div class="child-selector">
      <label>选择子女：</label>
      <select v-model="selectedChild" @change="switchChild">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.studentId }})
        </option>
      </select>
    </div>

    <!-- 预约记录 -->
    <div class="appointment-records">
      <h3>预约记录</h3>
      <div v-if="currentAppointments.length === 0" class="empty-state">
        <p>暂无预约记录</p>
      </div>
      <div v-else class="records-list">
        <div v-for="appointment in currentAppointments" :key="appointment.id" class="appointment-card">
          <div class="appointment-header">
            <h4>{{ appointment.counselor }}</h4>
            <span :class="['status', appointment.status]">{{ appointment.status }}</span>
          </div>
          <div class="appointment-body">
            <div class="appointment-info">
              <p><span class="label">预约时间：</span>{{ appointment.date }} {{ appointment.time }}</p>
              <p><span class="label">咨询方式：</span>{{ appointment.method }}</p>
              <p><span class="label">预约时间：</span>{{ appointment.createdAt }}</p>
            </div>
            <div class="appointment-actions">
              <button class="action-btn view-btn" @click="viewAppointment(appointment.id)">
                查看详情
              </button>
              <button 
                v-if="appointment.status === '已确认'" 
                class="action-btn cancel-btn" 
                @click="cancelAppointment(appointment.id)"
              >
                取消预约
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="appointment-stats">
      <h3>预约统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ currentAppointments.length }}</span>
          <span class="stat-label">总预约次数</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ confirmedAppointments }}</span>
          <span class="stat-label">已确认</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ completedAppointments }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ cancelledAppointments }}</span>
          <span class="stat-label">已取消</span>
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

// 模拟预约数据
const appointments = ref([
  {
    id: '1',
    childId: '1',
    counselor: '张老师',
    date: '2026-02-26',
    time: '09:00-10:00',
    method: '线下咨询',
    status: '已确认',
    createdAt: '2026-02-20 14:30'
  },
  {
    id: '2',
    childId: '1',
    counselor: '李老师',
    date: '2026-02-20',
    time: '14:00-15:00',
    method: '线上咨询',
    status: '已完成',
    createdAt: '2026-02-18 10:00'
  },
  {
    id: '3',
    childId: '1',
    counselor: '王老师',
    date: '2026-02-15',
    time: '16:00-17:00',
    method: '线下咨询',
    status: '已取消',
    createdAt: '2026-02-10 09:00'
  },
  {
    id: '4',
    childId: '2',
    counselor: '张老师',
    date: '2026-02-25',
    time: '10:00-11:00',
    method: '线上咨询',
    status: '已完成',
    createdAt: '2026-02-22 15:00'
  }
])

const currentAppointments = computed(() => {
  return appointments.value.filter(appointment => appointment.childId === selectedChild.value)
})

const confirmedAppointments = computed(() => {
  return currentAppointments.value.filter(appointment => appointment.status === '已确认').length
})

const completedAppointments = computed(() => {
  return currentAppointments.value.filter(appointment => appointment.status === '已完成').length
})

const cancelledAppointments = computed(() => {
  return currentAppointments.value.filter(appointment => appointment.status === '已取消').length
})

const switchChild = () => {
  // 切换子女逻辑
  console.log('切换到子女：', selectedChild.value)
}

const viewAppointment = (id) => {
  // 查看预约详情
  alert('查看预约详情功能正在开发中')
}

const cancelAppointment = (id) => {
  if (confirm('确定要取消该预约吗？')) {
    const appointment = appointments.value.find(a => a.id === id)
    if (appointment) {
      appointment.status = '已取消'
      alert('预约已取消')
    }
  }
}
</script>

<style scoped>
.appointment-view {
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

.appointment-records {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.appointment-records h3 {
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

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.appointment-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.appointment-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.appointment-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
}

.status.已确认 {
  background: #17a2b8;
}

.status.已完成 {
  background: #28a745;
}

.status.已取消 {
  background: #6c757d;
}

.appointment-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.appointment-info {
  flex: 1;
}

.appointment-info p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95rem;
}

.appointment-info .label {
  font-weight: 500;
  color: #666;
}

.appointment-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.appointment-stats {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.appointment-stats h3 {
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
  .appointment-view {
    padding: 15px;
  }

  .child-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .child-selector select {
    max-width: none;
  }

  .appointment-records,
  .appointment-stats {
    padding: 20px;
  }

  .appointment-body {
    flex-direction: column;
    gap: 15px;
  }

  .appointment-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
