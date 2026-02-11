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
      <el-table-column prop="date" label="日期">
        <template #default="{ row }">
          {{ row.date || row.appointmentDate || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="start_time" label="时间">
        <template #default="{ row }">
          {{ row.start_time || row.appointmentTime || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="go(row.id)"
          >
            填写
          </el-button>
        
        <el-button @click="$router.push(`/appointment/${row.id}/detail`)">
          查看进度
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

const list = ref<Appointment[]>([])


const router = useRouter()

const studentId = localStorage.getItem('student_id')!

onMounted(async () => {
  const res = await getMyAppointmentsAsync(studentId)
  list.value = res.data
})

function createNew() {
  router.push('/appointment/select') // 预约时间
}


function go(id: string) {
  router.push(`/appointment/${id}`) //进入已有
}


</script>
