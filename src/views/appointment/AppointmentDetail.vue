<template>
  <el-card>
    <h3>预约流程</h3>

    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in timeline"
        :key="index"
        :timestamp="item.time"
        :type="item.status === appointment?.status ? 'primary' : 'info'"
      >
        {{ statusText[item.status] }}
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getMyAppointmentsAsync } from '../../api/appointment'
import type { Appointment, AppointmentStatus } from '../../types/appointment'

const route = useRoute()
const appointment = ref<Appointment | null>(null)

const statusFlow: AppointmentStatus[] = [
  'draft',
  'info_done',
  'scale_done',
  'sign_done',
  'completed',
  'confirmed',
  'checked_in',
  'report_done',
  'closed'
]


const timeline = computed(() => {
  if (!appointment.value) return []

  const currentIndex = statusFlow.indexOf(appointment.value.status)

  return statusFlow.slice(0, currentIndex + 1).map((s, idx) => ({
    status: s,
    time: idx === currentIndex ? '当前' : ''
  }))
})

console.log('route.params.id =', route.params.id)
console.log('当前预约状态 =', appointment.value?.status)//调试

const statusText: Partial<Record<AppointmentStatus, string>> = {
  draft: '已创建预约',
  info_done: '完成来访登记',
  scale_done: '完成前测量表',
  sign_done: '已签署知情同意书',
  completed: '预约提交成功',
  confirmed: '咨询师已确认',
  checked_in: '已签到',
  report_done: '完成咨询报告',
  closed: '已结案'
}

onMounted(async () => {
  const sid = localStorage.getItem('student_id')!
  if (!sid) return
  
  const res = await getMyAppointmentsAsync(sid)
  console.log('接口返回的全部 id：', res.data.map(i => i.id))
    appointment.value = res.data.find(
    i => i.id === route.params.id
  ) ?? null

  console.log('当前预约状态 =', appointment.value?.status)
})
</script>
