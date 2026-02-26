<template>
  <div class="dashboard">
    <!-- 1. 快捷入口 -->
    <section class="card quick">
      <h3>快捷应用</h3>
      <div class="grid">
        <div class="item" @click="go('appointments')">预约管理</div>
        <div class="item" @click="go('consult-records')">咨询记录</div>
        <div class="item" @click="go('schedule')">排班</div>
        <div class="item" @click="go('crisis')">危机干预</div>
        <div class="item">测评</div>
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

    <!-- 3. 今日预约时间轴 -->
    <section class="card calendar">
      <h3>今日预约时间轴</h3>
      <ul>
        <li v-for="s in todaySchedules" :key="s.id">
          <span class="time">{{ s.time }}</span> {{ s.title }}
          <router-link :to="`/appointment/${s.id}/detail`" class="link">详情</router-link>
        </li>
        <li v-if="todaySchedules.length === 0">今天没有预约安排</li>
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

    <section class="card">
      <h3>未完事项</h3>
      <p>未完成预约：{{ unfinishedCount }}</p>
      <p>未写咨询报告：{{ unReportCount }}</p>
    </section>

    <section class="card">
  <h3>我的预约</h3>
  <table width="100%">
    <thead>
      <tr>
        <th>日期</th>
        <th>时间</th>
        <th>学生</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="a in appointmentList" :key="a.id">
        <td>{{ a.date }}</td>
        <td>{{ a.time }}</td>
        <td>{{ a.student }}</td>
        <td>{{ a.status }}</td>
      </tr>
    </tbody>
  </table>
</section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCounselorAppointmentsAsync } from '../../api/appointment'
import type { Appointment } from '../../types/appointment'

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
  if (userRole === 'counselor' && counselorId) {
    try {
      const res = await getCounselorAppointmentsAsync(counselorId)
      appointments.value = res.data || []
    } catch (e) {
      console.error('获取预约失败', e)
    }
  }
})

const router = useRouter()
function go(path) {
  router.push('/admin/' + path)
}


// --- 今日待办（状态未完成） ---
const todayTodos = computed(() =>
  appointmentList.value
    .filter(a =>
      ['sign_done','submitted','confirmed'].includes(a.status)
    )
    .map(a => ({
      id: a.id,
      type: '预约待办',
      title: `${a.date} ${a.time} 学生${a.student}`
    }))
)

// --- 今日预约时间轴（仅今日且未取消） ---
const todaySchedules = computed(() =>
  appointmentList.value
    .filter(a => a.date === today && a.status !== 'cancelled')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    .map(a => ({
      id: a.id,
      date: a.date,
      time: a.time,
      title: `学生 ${a.student}`
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

const unfinishedCount = computed(() =>
  appointments.value.filter(a => a.status !== 'closed').length
)

const unReportCount = computed(() =>
  appointments.value.filter(a => a.status === 'checked_in').length
)

const appointmentList = computed(() =>
  appointments.value.map(a => ({
    id: a.id,
    date: a.appointmentDate,
    time: a.appointmentTime,
    student: a.studentId,
    counselor: a.counselorName,
    status: a.status
  }))
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
.item:hover { background: #e6f0ff; }
.calendar .time { display: inline-block; width: 80px; font-weight: 500; }
.calendar .link { margin-left: 8px; font-size: 12px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.stat-box {
  background: #eef3ff;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
}
</style>
