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
      <el-table-column prop="consultant_name" label="咨询师" />

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
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { createAppointmentForStudent } from '../../mock/appointment'
import { fetchSchedule } from '../../mock/schedule'
import { consultants } from '../../mock/mock'
import { getSemester } from '../../api/mock'

const router = useRouter()

const dates = ref<string[]>([])
const selectedDate = ref('')
const slots = ref<any[]>([])
const studentId = ref('')
let scheduleUpdateHandler: any

function toDay(d: string | Date) {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  if (isNaN(dt.getTime())) return ''
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function refreshSchedule() {
  try {
    const schedule = await fetchSchedule()

    if (!schedule || schedule.length === 0) {
      dates.value = []
      slots.value = []
      return
    }

    const semester = getSemester()
    const semesterStartStr = toDay(semester.start)
    const semesterEndStr = toDay(semester.end)

    const storedDb = localStorage.getItem('MOCK_DB') || '{}'
    const db = JSON.parse(storedDb)
    const appointments = db.appointments || []

    const used = new Set<string>()
    appointments.forEach((a: any) => {
      used.add(`${toDay(a.appointmentDate)}|${a.appointmentTime}`)
    })

    const dateSet = new Set<string>()
    const allAvailableSlots: any[] = []

    schedule.forEach((slot: any) => {
      const dateStr = toDay(slot.date)
      if (dateStr >= semesterStartStr && dateStr <= semesterEndStr) {
        if (!used.has(`${dateStr}|${slot.time}`)) {
          dateSet.add(dateStr)
          allAvailableSlots.push(slot)
        }
      }
    })

    dates.value = Array.from(dateSet).sort()

    if (!selectedDate.value && dates.value.length > 0) {
      selectedDate.value = dates.value[0]
    }

    if (selectedDate.value) {
      const dayStr = toDay(selectedDate.value)

      slots.value = allAvailableSlots
        .filter(s => toDay(s.date) === dayStr)
        .map(s => {
          const cons = consultants.find(
            c => c.id === s.counselor_id || c.account === s.counselor_id
          )
          console.log('consultant=', cons)

          return {
            ...s,
            consultant_name: s.consultant_name || s.name || '',
            avoid_colleges: cons && Array.isArray(cons.avoid_college_ids)
              ? cons.avoid_college_ids
              : [],
            consultant_college_id:
              s.consultant_college_id || (cons && cons.college_id) || ''
          }
        })
    } else {
      slots.value = []
    }
  } catch (e) {
    dates.value = []
    slots.value = []
  }
}

onMounted(async () => {
  studentId.value = localStorage.getItem('student_id') || ''
  await refreshSchedule()

  const scheduleUpdateHandler = async () => {
    await refreshSchedule()
  }

  window.addEventListener('schedule-updated', scheduleUpdateHandler)

})

onUnmounted(() => {
  if (scheduleUpdateHandler) {
    window.removeEventListener('schedule-updated', scheduleUpdateHandler)
  }
})

watch(selectedDate, async (d) => {
  if (!d) return

  const dayStr = toDay(d)

  const storedDb = localStorage.getItem('MOCK_DB') || '{}'
  const db = JSON.parse(storedDb)
  const appointments = db.appointments || []

  const used = new Set<string>()
  appointments.forEach((a: any) => {
    used.add(`${toDay(a.appointmentDate)}|${a.appointmentTime}`)
  })

  const schedule = await fetchSchedule()

  const daySlots = schedule
    .filter((s: any) => toDay(s.date) === dayStr)
    .filter((s: any) => !used.has(`${dayStr}|${s.time}`))

  slots.value = daySlots.map((s: any) => {
    const cons = consultants.find(
      c => c.id === s.counselor_id || c.account === s.counselor_id
    )

    if (!cons) {
  console.warn('未找到咨询师，counselor_id=', s.counselor_id)
  console.log('consultants 列表=', consultants)
console.log('consultants 长度=', consultants?.length)
}
    return {
      ...s,
      consultant_name: s.consultant_name || s.name || '',
      avoid_colleges: cons && Array.isArray(cons.avoid_college_ids)
        ? cons.avoid_college_ids
        : [],
      consultant_college_id: s.consultant_college_id || cons?.college_id || ''
    }
  })
})

const choose = async (slot: any) => {
  if (isAvoidedByCollege(slot)) {
    alert('当前学生所属学院被设置为回避，无法预约该时段！')
    return
  }

  if (slot.onlyCollege) {
    const studentCollege = localStorage.getItem('student_college') || ''
    if (!studentCollege || studentCollege !== (slot.counselorCollege || '')) {
      alert('当前时段仅对本学院开放，如需预约请确认学生学院信息')
      return
    }
  }

  if (slot.unitType === 'single_unit') {
    if (!confirm('提示：本次预约为一次性单元咨询，是否继续预约？')) return
  }

  const res = await createAppointmentForStudent({
    student_id: studentId.value,
    counselor_id: slot.counselor_id,
    consultant_name: slot.consultant_name,
    date: slot.date,
    start_time: slot.time,
    end_time: slot.time
  })

  if (res.code === 200) {
    router.push(`/appointment/${res.data.id}`)
  }
}

function goToAppointments() {
  router.push('/my-appointment')
}

function isOnlyCollegeBlocked(row: any) {
  if (!row || !row.onlyCollege) return false
  const studentCollege = localStorage.getItem('student_college') || ''
  return !studentCollege || studentCollege !== (row.counselorCollege || '')
}

/* ✅ 只保留真正的“回避学院”逻辑 */
function isAvoidedByCollege(row: any) {
  const studentCollegeId = localStorage.getItem('student_college_id') || ''
  if (!studentCollegeId) return false

  if (Array.isArray(row.avoid_colleges)) {
    return row.avoid_colleges.includes(studentCollegeId)
  }

  return false
}
</script>