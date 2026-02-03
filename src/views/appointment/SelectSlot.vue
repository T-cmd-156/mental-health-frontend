<template>
  <el-card>
    <h3>选择预约时间</h3>

    <!-- 添加“查看我的预约”按钮 -->
    <el-button
      type="primary"
      style="margin-top: 12px"
      @click="goToAppointments"
    >
      查看我的预约
    </el-button>

  <el-select v-model="selectedDate" placeholder="请选择日期" style="margin-bottom:12px">
    <el-option
      v-for="d in dates"
      :key="d"
      :label="d"
      :value="d"
    />
  </el-select>

    <el-table :data="slots">
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="time" label="时间" />
      <el-table-column prop="counselor" label="咨询师" />

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="choose(row)">
            预约
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAvailableSlots, getAvailableDates } from '../../mock/appointment'
import { createAppointmentAsync } from '../../api/appointment'
import { getSemester } from '../../api/mock'

const router = useRouter()


// 从父组件或路由传日期
// const selectedDate = ref(new Date().toISOString().slice(0, 10))

const dates = ref<string[]>([])
const selectedDate = ref('') // 测试用，保证在排班范围内

const slots = ref<any[]>([])

onMounted(async () => {
  const semester = getSemester()
  const start = semester.start   // 学期开学日
  dates.value = await getAvailableDates(start, 10)
  selectedDate.value = dates.value[0]|| '' // 默认第一天
})

watch(selectedDate, async (d) => {
  if (!d) return
  slots.value = await getAvailableSlots(d)
})

const choose = async (slot: any) => {
  const res = await createAppointmentAsync({
    studentId: 'student_001',
    counselorId: slot.counselor,
    appointmentDate: slot.date,
    appointmentTime: slot.time,
  })

  if (res.code === 200) {
    router.push(`/appointment/${res.data.id}`)
  }
}

// 点击按钮时跳转到我的预约页面
function goToAppointments() {
  router.push('/my-appointment')  // 假设你的预约列表页面路径是 /appointment/my
}

</script>
