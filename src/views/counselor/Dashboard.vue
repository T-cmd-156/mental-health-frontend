<template>
  <div class="dashboard">
<<<<<<< HEAD
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
=======
    <!-- 顶部信息卡片 -->
    <el-row :gutter="20" class="info-cards">
      <el-col :span="6">
        <el-card>
          <div>今日预约</div>
          <div class="number">{{ todayCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>待处理预约</div>
          <div class="number">{{ pendingCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>未写咨询记录</div>
          <div class="number">{{ unwrittenCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>当前个案</div>
          <div class="number">{{ caseCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 今日预约时间轴 -->
    <section class="card timeline">
      <h3>今日预约</h3>
      <el-timeline>
        <el-timeline-item
          v-for="a in todayAppointments"
          :key="a.id"
          :timestamp="a.appointmentTime"
          @click="goAppointment(a.id)"
          style="cursor: pointer;"
        >
          {{ a.studentId }}
        </el-timeline-item>
        <div v-if="todayAppointments.length === 0">今日暂无预约</div>
      </el-timeline>
    </section>

    <!-- 待办提醒区 -->
    <section class="card todos">
      <el-row>
        <el-col :span="8">
          <el-badge :value="pendingCount" class="badge">
            <span>待处理预约</span>
          </el-badge>
        </el-col>
        <el-col :span="8">
          <el-badge :value="unwrittenCount" class="badge">
            <span>未写咨询记录</span>
          </el-badge>
        </el-col>
        <el-col :span="8">
          <el-badge :value="crisisPendingCount" class="badge">
            <span>危机待处理</span>
          </el-badge>
        </el-col>
      </el-row>
>>>>>>> master
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
<<<<<<< HEAD
=======
import { getCounselorAppointmentsAsync } from '../../api/appointment'
import { getRecordsByCounselorAsync } from '../../api/record'
import { getCasesByCounselorAsync } from '../../api/case'
import { getCrisesByCounselorAsync } from '../../api/crisis'
import type { Appointment } from '../../types/appointment'
import type { Record } from '../../types/record'
import type { Case } from '../../types/case'
import type { Crisis } from '../../types/crisis'

const router = useRouter()
const userRole = localStorage.getItem('user_role')
const counselorId = localStorage.getItem('user_id') || ''

const appointments = ref<Appointment[]>([])
const records = ref<Record[]>([])
const casesList = ref<Case[]>([])
const crises = ref<Crisis[]>([])

const today = new Date().toISOString().slice(0, 10)

onMounted(async () => {
  if (userRole === 'counselor' && counselorId) {
    try {
      const res = await getCounselorAppointmentsAsync(counselorId)
      appointments.value = res.data || []

      const rres = await getRecordsByCounselorAsync(counselorId)
      records.value = rres.data || []

      const cres = await getCasesByCounselorAsync(counselorId)
      casesList.value = cres.data || []

      const cris = await getCrisesByCounselorAsync(counselorId)
      crises.value = cris.data || []
    } catch (e) {
      console.error('获取数据失败', e)
    }
  }
})

const todayCount = computed(() =>
  appointments.value.filter(a => a.appointmentDate === today).length
)

const pendingStatuses = ['draft', 'submitted', 'info_done']
const pendingCount = computed(() =>
  appointments.value.filter(a => pendingStatuses.includes(a.status)).length
)

const unwrittenCount = computed(() =>
  appointments.value.filter(a =>
    ['confirmed', 'completed', 'checked_in'].includes(a.status) &&
    !records.value.some(r => r.appointmentId === a.id)
  ).length
)

const caseCount = computed(() =>
  casesList.value.filter(c => !c.isClosed).length
)

const crisisPendingCount = computed(() =>
  crises.value.filter(c => c.status === 'pending').length
)

const todayAppointments = computed(() =>
  appointments.value
    .filter(a => a.appointmentDate === today)
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
)

function goAppointment(id: string) {
  router.push(`/appointment/${id}`)
}
</script>

<style scoped>
.dashboard {
  padding: 16px;
}
.info-cards .el-card {
  text-align: center;
}
.info-cards .number {
  font-size: 24px;
  margin-top: 8px;
}
.card {
  margin-top: 20px;
}
</style>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
>>>>>>> master
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
<<<<<<< HEAD
      appointments.value = res.data || []
=======
      console.log('咨询师预约:', res.data)
      appointments.value = res.data.filter(
  a => String(a.counselorId).toLowerCase() === String(counselorId).toLowerCase()
)

    console.log('过滤后 appointments:', appointments.value)
      appointments.value = res.data.filter(
  a => String(a.counselorId).toLowerCase() === String(counselorId).toLowerCase()
)

    console.log('过滤后 appointments:', appointments.value)
>>>>>>> master
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
  appointmentList.value
    .filter(a =>
      ['sign_done','submitted','confirmed'].includes(a.status)
    )
    .map(a => ({
      id: a.id,
      type: '预约待办',
      title: `${a.date} ${a.time} 学生${a.student}`
      type: '预约待办',
      title: `${a.date} ${a.time} 学生${a.student}`
    }))
)

// --- 今日预约时间轴（仅今日且未取消） ---
const todaySchedules = computed(() =>
  appointmentList.value
<<<<<<< HEAD
    .filter(a => a.date === today && a.status !== 'cancelled')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
=======
  appointmentList.value
  .filter(a => a) // 确保非 null
    // .filter(a => a.status === 'confirmed' && a.appointmentDate === today)
>>>>>>> master
    .map(a => ({
      id: a.id,
      date: a.date,
      time: a.time,
      title: `学生 ${a.student}`
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
  padding: 16px;
}
.info-cards .el-card {
  text-align: center;
}
.info-cards .number {
  font-size: 24px;
  margin-top: 8px;
}
.card {
  margin-top: 20px;
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
