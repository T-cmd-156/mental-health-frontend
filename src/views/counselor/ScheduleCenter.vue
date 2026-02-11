<template>
  <el-card>
    <h2>我的排班</h2>
    <div v-if="!canView">
      <el-alert type="warning" title="暂无权限查看排班" />
    </div>
    <div v-else>
      <el-table :data="mySchedule" style="width: 100%">
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="consultant_name" label="咨询师" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="mini" @click="editSlot(row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="editDialogVisible" title="修改排班">
        <el-form :model="editForm">
          <el-form-item label="日期">
            <el-input v-model="editForm.date" disabled />
          </el-form-item>
          <el-form-item label="时间">
            <el-input v-model="editForm.time" disabled />
          </el-form-item>
          <el-form-item label="咨询师">
            <el-select v-model="editForm.counselor_id" filterable>
              <el-option v-for="c in consultants" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchSchedule, updateSchedule } from '../../mock/schedule'
import { consultants } from '../../mock/mock'

const userId = localStorage.getItem('user_id')
const userRole = localStorage.getItem('user_role')
const canView = computed(() => userRole === 'counselor' && localStorage.getItem('smart_schedule_enabled') === '1')

const mySchedule = ref<any[]>([])
const editDialogVisible = ref(false)
const editForm = ref({ date: '', time: '', counselor_id: '', consultant_college_id: '' })

onMounted(async () => {
  if (!canView.value) return
  const all = await fetchSchedule()
  mySchedule.value = all.filter((s: any) => s.counselor_id === userId)
})

function editSlot(row: any) {
  editForm.value = { date: row.date, time: row.time, counselor_id: row.counselor_id, consultant_college_id: row.consultant_college_id }
  editDialogVisible.value = true
}

async function saveEdit() {
  
   const consultant = consultants.find(c => c.id === editForm.value.counselor_id)

    await updateSchedule({
    date: editForm.value.date,
    time: editForm.value.time,
    counselor_id: editForm.value.counselor_id,
    consultant_name: consultant?.name || '',
  })
  const all = await fetchSchedule()
  mySchedule.value = all.filter((s: any) => s.counselor_id === userId)
  editDialogVisible.value = false
}
</script>
