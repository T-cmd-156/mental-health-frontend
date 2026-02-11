<template>
  <el-card>
    <h2>危机列表</h2>
    <el-table :data="crises" style="width:100%">
      <el-table-column prop="id" label="危机编号" />
      <el-table-column prop="student_name" label="学生姓名" />
      <el-table-column prop="level" label="危机等级" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="viewDetail(row)">评估</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCrises } from '../../api/crisis'
import { useRouter } from 'vue-router'
const crises = ref<any[]>([])
const router = useRouter()
onMounted(async () => {
  crises.value = await fetchCrises()
})
function viewDetail(row:any) {
  router.push(`/crisis/${row.id}`)
}
</script>
