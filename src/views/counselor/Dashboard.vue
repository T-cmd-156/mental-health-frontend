<template>
  <div class="dashboard">
    <!-- 1. 快捷入口 -->
    <section class="card quick">
      <h3>快捷应用</h3>
      <div class="grid">
        <div class="item">预约</div>
        <div class="item">测评</div>
        <div class="item">排班</div>
        <div class="item">咨询记录</div>
        <div class="item">危机干预</div>
        <div class="item">团体活动</div>
      </div>
    </section>

    <!-- 2. 待办事项 -->
    <section class="card todo">
      <h3>今日待办</h3>
      <ul>
        <li v-for="t in todayTodos" :key="t.id">
          【{{ t.type }}】{{ t.title }}
        </li>
        <li v-if="todayTodos.length === 0">暂无待办</li>
      </ul>
    </section>

    <!-- 3. 日历日程 -->
    <section class="card calendar">
      <h3>今日日程</h3>
      <ul>
        <li v-for="s in todaySchedules" :key="s.id">
          {{ s.time }} - {{ s.title }}
        </li>
        <li v-if="todaySchedules.length === 0">今天没有安排</li>
      </ul>
    </section>

    <!-- 4. 工作数据 -->
    <section class="card stats">
      <h3>个人工作数据</h3>
      <ul>
        <li>累计咨询：{{ totalConsultations }}</li>
        <li>本月咨询：{{ monthConsultations }}</li>
        <li>危机个案：{{ crisisCases }}</li>
        <li>爽约次数：{{ noShowCount }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCounselorAppointmentsAsync } from '../../api/appointment'
import type { Appointment } from '../../types/appointment'
import { getAppointmentsByCounselor } from '../../mock/appointment'

// --- 获取登录信息里的 counselorId ---
const userRole = localStorage.getItem('user_role')
// const counselorId = localStorage.getItem('user_token') || 'c1' // 如果没登录，默认 c1 

// --- 存储咨询师自己的预约 ---
const appointments = ref<Appointment[]>([])

const counselorId = localStorage.getItem('user_id') // 登录的咨询师 ID

// --- 今天日期 ---
const today = new Date().toISOString().slice(0, 10)

// --- 页面加载时获取预约 ---
// onMounted(async () => {
//    console.log('Dashboard mounted') //调试
//    localStorage.getItem('user_role')
//   if (userRole === 'counselor') {
//     const res = await getCounselorAppointmentsAsync()
//     console.log('咨询师拿到的预约：', res.data)  // <- 看这里是不是空
//     appointments.value = res.data
//   }
// })

onMounted(async () => {
 if (userRole === 'counselor'&& counselorId) {
    try {
      const res = await getCounselorAppointmentsAsync(counselorId)
      console.log('咨询师预约:', res.data)
      appointments.value = res.data.filter(a => a.counselorId === counselorId)
    } catch (e) {
      console.error('获取预约失败', e)
    }
  }
})


// --- 今日待办（状态未完成） ---
const todayTodos = computed(() =>
  appointments.value
    .filter(a => a) // 确保非 null
    // .filter(a => a.status !== 'closed' && a.appointmentDate === today)
    .map(a => ({
      id: a.id,
      type: '预约',
      title: `学生 ${a.studentId} ${a.appointmentTime}`
    }))
)

// --- 今日日程（状态已确认） ---
const todaySchedules = computed(() =>
  appointments.value
  .filter(a => a) // 确保非 null
    // .filter(a => a.status === 'confirmed' && a.appointmentDate === today)
    .map(a => ({
      id: a.id,
      time: a.appointmentTime,
      title: `学生 ${a.studentId}`
    }))
)

// --- 工作数据统计 ---
const totalConsultations = computed(() =>
  appointments.value.filter(a => a.status === 'completed' || a.status === 'closed'|| a.status ==='draft' || a.status === 'info_done' || a.status === 'scale_done' || a.status ==='sign_done' || a.status === 'submitted' || a.status ==='confirmed' || a.status ==='checked_in' || a.status === 'report_done' ).length
)
const monthConsultations = computed(() => {
  const now = new Date()
  return appointments.value.filter(a => {
    const d = new Date(a.appointmentDate)
    return (
      (a.status === 'completed' || a.status === 'closed') &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  }).length
})
const crisisCases = computed(() =>
  appointments.value.filter(a => a.status === 'closed').length
)
const noShowCount = computed(() =>
  appointments.value.filter(a => a.status === 'cancelled').length
)
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.item {
  background: #f3f3f3;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
