<template>
  <div>
    <h2>咨询记录列表</h2>

    <div style="margin-bottom:12px; display:flex; gap:12px; align-items:center; flex-wrap:wrap">
      <el-button type="primary" @click="createNew">+ 新建记录</el-button>

      <el-input
        v-model="searchStudentId"
        placeholder="按学生ID筛选"
        clearable
        style="width: 200px"
      />
      <el-date-picker
        v-model="searchDateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />
    </div>

    <el-table :data="filteredList" style="width:100%">
      <el-table-column prop="consultationDate" label="日期" />
      <el-table-column prop="studentId" label="学生ID" />
      <el-table-column prop="consultant_name" label="咨询师" />
      <el-table-column prop="status" label="状态" />

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="view(row.id)">查看</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="row.status !== '未审核'"
            @click="edit(row.id)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getRecordsByCounselorAsync } from '../../api/record'
import type { Record } from '../../types/record'

const list = ref<Record[]>([])
const searchStudentId = ref('')
const searchDateRange = ref<[string, string] | null>(null)
const router = useRouter()

const counselor_id = localStorage.getItem('user_id') || localStorage.getItem('counselor_id') || ''

onMounted(async () => {
  const res = await getRecordsByConsultantAsync(counselor_id)
  list.value = res.data
})

const filteredList = computed(() => {
  return list.value.filter(r => {
    const matchStudent =
      !searchStudentId.value ||
      String(r.studentId).toLowerCase().includes(searchStudentId.value.toLowerCase())

    let matchDate = true
    if (searchDateRange.value && searchDateRange.value.length === 2) {
      const [start, end] = searchDateRange.value
      matchDate = r.consultationDate >= start && r.consultationDate <= end
    }

    return matchStudent && matchDate
  })
})

function createNew() {
  router.push('/record/new')
}

function view(id: string) {
  router.push(`/record/${id}`)
}

function edit(id: string) {
  router.push(`/record/${id}/edit`)
}
</script>
