<template>
  <div>
    <h2>我的预约</h2>

    <el-button
      type="primary"
      style="margin-bottom:12px"
      @click="createNew"
    >
      + 新建预约
    </el-button>
    <el-table :data="list" style="width:100%">
      <el-table-column prop="appointmentDate" label="日期" />
      <el-table-column prop="appointmentTime" label="时间" />
      <el-table-column prop="status" label="状态" />

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="go(row.id)"
          >
            进入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyAppointmentsAsync } from '../../api/appointment'
import type { Appointment } from '../../types/appointment'
import { createAppointmentAsync } from '../../api/appointment'

const list = ref<Appointment[]>([])


const router = useRouter()

onMounted(async () => {
  const res = await getMyAppointmentsAsync('student_001')
  list.value = res.data
})

async function createNew() {
  const res = await createAppointmentAsync({
    studentId: 'student_001',
    counselorId: 'C1',
    appointmentDate: '2026-04-10',
    appointmentTime: '09:00-09:50',
  })

  if (res.code === 200) {
    router.push(`/appointment/${res.data.id}`) //新建
  }
}

function go(id: string) {
  router.push(`/appointment/${id}`) //进入已有
}



</script>
