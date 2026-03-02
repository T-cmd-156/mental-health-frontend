<template>
  <el-card>
    <h2>个案列表</h2>
    <el-table :data="cases" style="width:100%">
      <el-table-column prop="id" label="个案编号" />
      <el-table-column prop="student_name" label="学生姓名" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="viewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCases } from '../../api/case'
import { useRouter } from 'vue-router'
const cases = ref<any[]>([])
const router = useRouter()
onMounted(async () => {
  cases.value = await fetchCases()
})
function viewDetail(row:any) {
  router.push(`/case/${row.id}`)
}
</script>
