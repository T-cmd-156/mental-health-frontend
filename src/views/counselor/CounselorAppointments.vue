<template>
  <div class="counselor-appointments">
    <h2>预约管理</h2>

    <!-- 今日预约时间轴 -->
    <section class="card today-section">
      <h3>今日预约时间轴</h3>
      <div class="timeline">
        <div v-for="a in todayList" :key="a.id" class="timeline-item">
          <span class="time">{{ a.appointmentTime }}</span>
          <span class="student">学生 {{ a.studentId }}</span>
          <span class="status-tag" :class="a.status">{{ statusLabel(a.status) }}</span>
          <el-button type="primary" size="small" @click="goDetail(a.id)">详情</el-button>
          <el-button v-if="canRenew(a)" size="small" @click="renew(a)">一键续约</el-button>
        </div>
        <div v-if="todayList.length === 0" class="empty">今日暂无预约</div>
      </div>
    </section>

    <!-- 全部预约列表 -->
    <section class="card">
      <h3>全部预约</h3>
      <el-table :data="list" style="width:100%">
        <el-table-column prop="appointmentDate" label="日期" width="120" />
        <el-table-column prop="appointmentTime" label="时间" width="120" />
        <el-table-column prop="studentId" label="学生" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ statusLabel(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="goDetail(row.id)">详情</el-button>
            <template v-if="row.status === 'submitted'">
              <el-button type="success" size="small" @click="confirm(row.id)">同意</el-button>
              <el-button type="danger" size="small" @click="reject(row.id)">拒绝</el-button>
            </template>
            <el-button v-if="canRenew(row)" size="small" @click="renew(row)">续约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCounselorAppointmentsAsync, updateAppointmentStatusAsync } from '../../api/appointment'

const router = useRouter()
const counselorId = localStorage.getItem('user_id')
const list = ref([])

const today = new Date().toISOString().slice(0, 10)

const todayList = computed(() =>
  list.value.filter(a => a.appointmentDate === today && !['cancelled', 'draft'].includes(a.status))
)

const statusMap = {
  draft: '草稿',
  info_done: '已填登记',
  scale_done: '已填量表',
  sign_done: '已签署',
  submitted: '待确认',
  confirmed: '已确认',
  cancelled: '已取消',
  checked_in: '已签到',
  report_done: '已写报告',
  closed: '已结案'
}
function statusLabel(s) {
  return statusMap[s] || s
}

function canRenew(row) {
  return ['confirmed', 'checked_in', 'report_done', 'closed'].includes(row.status)
}

async function load() {
  const res = await getCounselorAppointmentsAsync(counselorId)
  list.value = res.data || []
}

async function confirm(id) {
  await updateAppointmentStatusAsync(id, 'confirmed')
  await load()
}

async function reject(id) {
  await updateAppointmentStatusAsync(id, 'cancelled')
  await load()
}

function goDetail(id) {
  router.push(`/appointment/${id}/detail`)
}

function renew(row) {
  // 一键续约：跳转预约选择页，可由学生或咨询师代约。此处仅提示或后续对接“下周同时段”接口
  router.push({ path: '/appointment/select', query: { studentId: row.studentId, renew: '1' } })
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.counselor-appointments { padding: 0 0 20px 0; }
.counselor-appointments h2 { margin: 0 0 16px 0; }
.card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.card h3 { margin: 0 0 12px 0; font-size: 16px; }
.timeline { display: flex; flex-direction: column; gap: 8px; }
.timeline-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: #fafafa; border-radius: 6px; }
.timeline-item .time { width: 100px; font-weight: 500; }
.timeline-item .student { flex: 1; }
.status-tag { font-size: 12px; padding: 2px 8px; border-radius: 4px; }
.status-tag.submitted { background: #e6f7ff; color: #1890ff; }
.status-tag.confirmed { background: #f6ffed; color: #52c41a; }
.status-tag.closed { background: #f0f0f0; color: #666; }
.empty { color: #8c8c8c; padding: 16px; text-align: center; }
</style>
