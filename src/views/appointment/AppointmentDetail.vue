<template>
  <el-card>
    <h3>预约流程</h3>

    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in appointment?.timeline"
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMyAppointmentsAsync } from '../../api/appointment'
import type { Appointment, AppointmentStatus } from '../../types/appointment'

const route = useRoute()
const appointment = ref<Appointment | null>(null)

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
  const res = await getMyAppointmentsAsync('student_001')
  appointment.value = res.data.find(i => i.id === route.params.id)?? null
  
})
</script>
