<template>
  <div class="my-appointments">
    <header class="page-header">
      <h1 class="page-title">四川文理学院 - 我的预约</h1>
      <p class="page-subtitle">管理您的心理咨询预约</p>
    </header>

    <div class="content-wrapper">
      <el-button
        type="primary"
        class="create-btn"
        @click="createNew"
      >
        + 新建预约
      </el-button>
      <el-table :data="list" class="appointment-table">
        <el-table-column prop="appointmentDate" label="日期" />
        <el-table-column prop="appointmentTime" label="时间" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

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
    router.push(`/appointment/${res.data.id}`)
  }
}

function go(id: string) {
  router.push(`/appointment/${id}`)
}

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    draft: 'info',
    info_done: 'primary',
    scale_done: 'warning',
    sign_done: 'success',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    draft: '待填写',
    info_done: '待填写量表',
    scale_done: '待签署',
    sign_done: '已完成',
    completed: '已完成'
  }
  return textMap[status] || status
}

</script>

<style scoped>
.my-appointments {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.content-wrapper {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.create-btn {
  margin-bottom: 20px;
  padding: 12px 30px;
  font-size: 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.appointment-table {
  width: 100%;
}

.appointment-table :deep(.el-table__header) {
  background: #f5f7fa;
}

.appointment-table :deep(.el-table__row) {
  transition: all 0.3s ease;
}

.appointment-table :deep(.el-table__row:hover) {
  background: #f0f7ff;
}
</style>
