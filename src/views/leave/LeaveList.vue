<template>
  <el-card>
    <h2>请假记录</h2>
    <el-table :data="leaves" style="width:100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="reason" label="原因" />
      <el-table-column prop="date" label="时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="cancel(row)">撤销</el-button>
          <el-button @click="reapply(row)">重新申请</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const leaves = ref<any[]>([])
onMounted(async () => {
  // 获取请假记录API
  leaves.value = [
    { id: 'l001', reason: '身体不适', date: '2026-02-20', status: '已提交' },
    { id: 'l002', reason: '家庭原因', date: '2026-02-15', status: '已撤销' }
  ]
})
function cancel(row:any) {
  // 撤销API
}
function reapply(row:any) {
  // 重新申请API
}
</script>
