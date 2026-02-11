<template>
  <div class="dashboard">
    <!-- 快捷应用区 -->
    <section class="card shortcuts">
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in shortcuts" :key="item.label">
          <el-card class="shortcut-card" @click="goShortcut(item)" style="cursor:pointer">
            <div>{{ item.label }}</div>
          </el-card>
        </el-col>
      </el-row>
    </section>

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
      <h3>日历日程</h3>
      <el-calendar v-model="selectedDate" />
      <div class="day-list">
        <h4>当天项目 ({{ selectedStr }})</h4>
        <el-timeline v-if="dailyItems.length > 0">
          <el-timeline-item
            v-for="item in sortedDailyItems"
            :key="item.id"
            placement="top"
          >
            <span v-if="item.type==='appointment'">
              <a href="javascript:;" @click="goAppointment(item.id)" style="color:#409EFF">{{ item.title }}</a>
            </span>
            <span v-else>{{ item.title }}</span>
          </el-timeline-item>
        </el-timeline>
        <p v-else style="color:#999;margin-top:10px">无</p>
      </div>
    </section>

    <!-- 待办提醒区 -->
    <section class="card todos">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-badge :value="pendingCount" class="badge">
            <span @click="goShortcut({path:'/appointment'})" style="cursor:pointer">待处理预约</span>
          </el-badge>
        </el-col>
        <el-col :span="4">
          <el-badge :value="unwrittenCount" class="badge">
            <span @click="goShortcut({path:'/record'})" style="cursor:pointer">未写咨询记录</span>
          </el-badge>
        </el-col>
        <el-col :span="4">
          <el-badge :value="crisisPendingCount" class="badge">
            <span @click="goShortcut({path:'/crisis'})" style="cursor:pointer">危机待处理</span>
          </el-badge>
        </el-col>
        <el-col :span="4">
          <el-badge :value="longLeaveCount" class="badge">
            <span @click="goShortcut({path:'/leave'})" style="cursor:pointer">长程申请待审批</span>
          </el-badge>
        </el-col>
        <el-col :span="4">
          <el-badge :value="assessmentWarningCount" class="badge">
            <span @click="goShortcut({path:'/assessment'})" style="cursor:pointer">测评预警</span>
          </el-badge>
        </el-col>
      </el-row>
    </section>

    <!-- 个人工作数据图形化 -->
    <section class="card charts">
      <el-radio-group v-model="chartDimension" size="small" style="margin-bottom:10px">
        <el-radio-button label="累计" />
        <el-radio-button label="年" />
        <el-radio-button label="月" />
      </el-radio-group>
      <div id="work-chart" style="height:300px;width:100%;"></div>
    </section>

    <!-- 未完事项图形化 -->
    <section class="card charts">
      <div id="unfinished-chart" style="height:300px;width:100%;"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { getConsultantAppointmentsAsync } from '../../api/appointment'
import { getRecordsByConsultantAsync } from '../../api/record'
import { getCasesByConsultantAsync } from '../../api/case'
import { getCrisesByConsultantAsync } from '../../api/crisis'
import type { Appointment } from '../../types/appointment'
import type { CrisisCase } from '../../types/case'

const router = useRouter()
const userRole = localStorage.getItem('user_role')
const counselorId = localStorage.getItem('user_id') || ''

const appointments = ref<Appointment[]>([])
const records = ref<any[]>([])
const casesList = ref<CrisisCase[]>([])
const crises = ref<CrisisCase[]>([])

const today = toDay(new Date())

// 统一把各种日期（Date / 字符串 / ISO）规范成 yyyy-MM-dd，避免比较失败（使用本地时间）
function toDay(d: string | Date) {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  if (isNaN(dt.getTime())) return ''
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function goShortcut(item: { path: string }) {
  if (!item.path || item.path === '#') return
  router.push(item.path).catch(err => {
    console.warn('导航失败', err)
  })
}

const shortcuts = [
  { label: '发起预约', path: '/appointment/select' },
  { label: '咨询记录', path: '/records' },
  { label: '排班管理', path: '/counselor/schedule' },
  { label: '长程申请', path: '#' },
  { label: '个案转介', path: '#' },
  { label: '咨询记录修改申请', path: '#' },
  { label: '危机上报', path: '#' },
  { label: '团体活动管理', path: '#' },
  { label: '联系咨询师', path: '/peer-support' }
]

const selectedDate = ref<Date | string>(new Date())
const selectedStr = computed(() => toDay(selectedDate.value))

const groupActivities = ref<Array<{id:string;date:string;title:string}>>([])
const personalTasks = ref<Array<{id:string;date:string;title:string}>>([])

const dailyItems = computed<any[]>(() => {
  const appts = appointments.value
    .filter(a => toDay(a.date) === selectedStr.value)
    .map(a => ({
      id: a.id,
      type: 'appointment',
      title: `${a.start_time}-${a.end_time} 学生${a.student_id}`,
      time: a.start_time
    }))
  const groups = groupActivities.value.filter(g => toDay(g.date) === selectedStr.value)
  const personals = personalTasks.value.filter(p => toDay(p.date) === selectedStr.value)
  return [...appts, ...groups, ...personals]
})

const sortedDailyItems = computed<any[]>(() => {
  return [...dailyItems.value].sort((a: any, b: any) => {
    const timeA = (a.time || '99:99') as string
    const timeB = (b.time || '99:99') as string
    return timeA.localeCompare(timeB)
  })
})

const chartDimension = ref<'累计'|'年'|'月'>('累计')
let workChart: any = null
let unfinishedChart: any = null

async function initWorkChart() {
  const chart = (workChart = echarts.init(
    document.getElementById('work-chart') as HTMLElement
  ))
  const update = () => {
    const total = totalConsultations.value
    const year = yearConsultations.value
    const month = monthConsultations.value
    const data =
      chartDimension.value === '累计'
        ? total
        : chartDimension.value === '年'
        ? year
        : month
    chart.setOption({
      title: { text: '咨询人数', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['当前'] },
      yAxis: { type: 'value' },
      series: [{ 
        type: 'bar', 
        data: [data],
        itemStyle: { color: '#409EFF' }
      }]
    })
  }
  watch(chartDimension, update)
  watch(totalConsultations, update)
  update()
}

async function initUnfinishedChart() {
  const chart = (unfinishedChart = echarts.init(
    document.getElementById('unfinished-chart') as HTMLElement
  ))
  const update = () => {
    const todayUn = todayUnfinished.value
    const weekUn = weekUnfinished.value
    const monthUn = monthUnfinished.value
    chart.setOption({
      title: { text: '未完事项', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { name: '今日', value: todayUn },
            { name: '本周', value: weekUn },
            { name: '本月', value: monthUn }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
  watch([todayUnfinished, weekUnfinished, monthUnfinished], update)
  update()
}

const totalConsultations = computed(() => appointments.value.length)
const yearConsultations = computed(() =>
  appointments.value.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length
)
const monthConsultations = computed(() =>
  appointments.value.filter(a => {
    const d = new Date(a.date)
    return (
      d.getFullYear() === new Date().getFullYear() &&
      d.getMonth() === new Date().getMonth()
    )
  }).length
)
const todayUnfinished = computed(() =>
  appointments.value.filter(a => a.status !== 'closed' && toDay(a.date) === today).length
)
const weekUnfinished = computed(() => todayUnfinished.value)
const monthUnfinished = computed(() =>
  appointments.value.filter(a => {
    const d = new Date(a.date)
    return (
      d.getFullYear() === new Date().getFullYear() &&
      d.getMonth() === new Date().getMonth() &&
      a.status !== 'closed'
    )
  }).length
)

async function fetchAllData() {
  if (!(userRole === 'counselor' && counselorId)) {
    console.warn('Dashboard skipped fetch, role=', userRole, 'id=', counselorId)
    return
  }
  try {
    const res = await getConsultantAppointmentsAsync(counselorId)
    appointments.value = res.data || []

    const rres = await getRecordsByConsultantAsync(counselorId)
    records.value = rres.data || []

    const cres = await getCasesByConsultantAsync(counselorId)
    casesList.value = cres.data || []

    const cris = await getCrisesByConsultantAsync(counselorId)
    crises.value = cris.data || []

    groupActivities.value = [
      { id: 'g1', date: selectedStr.value, title: '团体活动：心理讲座' }
    ]
    personalTasks.value = [
      { id: 'p1', date: selectedStr.value, title: '个人事务：整理档案' }
    ]

    if (workChart == null || unfinishedChart == null) {
      await new Promise(r => setTimeout(r, 100))
      initWorkChart()
      initUnfinishedChart()
    }
  } catch (e) {
    console.error('获取数据失败', e)
  }
}

let updateHandler: any = null
let visibilityHandler: any = null

onMounted(() => {
  fetchAllData()

  updateHandler = async () => {
    console.log('收到 appointments-updated 事件，重新拉取')
    await fetchAllData()
  }
  window.addEventListener('appointments-updated', updateHandler)

  visibilityHandler = async () => {
    if (document.visibilityState === 'visible') {
      await fetchAllData()
    }
  }
  document.addEventListener('visibilitychange', visibilityHandler)
})

onUnmounted(() => {
  if (updateHandler) window.removeEventListener('appointments-updated', updateHandler)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

const todayCount = computed(() =>
  appointments.value.filter(a => toDay(a.date as any) === today).length
)

const pendingStatuses = ['draft', 'submitted', 'info_done']
const pendingCount = computed(() =>
  appointments.value.filter(a => pendingStatuses.includes(a.status)).length
)

const unwrittenCount = computed(() =>
  appointments.value.filter(a =>
    ['confirmed', 'completed', 'checked_in'].includes(a.status) &&
    !records.value.some((r: any) => r.appointment_id === a.id)
  ).length
)

const caseCount = computed(() =>
  casesList.value.filter((c: CrisisCase) => !c.status || c.status !== 'closed').length
)

const crisisPendingCount = computed(() =>
  crises.value.filter((c: CrisisCase) => c.status === 'pending').length
)

const longLeaveCount = ref(0)
const assessmentWarningCount = ref(0)

function goAppointment(id: string) {
  router.push(`/appointment/${id}/detail`)
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
  font-weight: bold;
  color: #409EFF;
  margin-top: 8px;
}
.card {
  margin-top: 20px;
}
.shortcuts .shortcut-card {
  text-align: center;
  padding: 20px 0;
  font-weight: bold;
  transition: all 0.3s;
}
.shortcuts .shortcut-card:hover {
  color: #409EFF;
  border-color: #409EFF;
}
.day-list {
  margin-top: 10px;
}
.day-list h4 {
  margin: 10px 0 5px;
}
.badge {
  cursor: pointer;
  transition: all 0.3s;
}
.badge:hover {
  color: #409EFF;
}
.charts {
  min-height: 350px;
}
</style>
