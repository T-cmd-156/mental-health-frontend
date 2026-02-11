<template>
  <el-card>
    <h2>团体活动管理</h2>
    <el-table :data="activities" style="width:100%">
      <el-table-column prop="id" label="活动编号" />
      <el-table-column prop="name" label="活动名称" />
      <el-table-column prop="date" label="活动时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="sign(row)">签到</el-button>
          <el-button @click="summary(row)">填写总结</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const activities = ref<any[]>([])
onMounted(async () => {
  // 获取活动API
  activities.value = [
    { id: 'act001', name: '团体辅导', date: '2026-02-12', status: '进行中' },
    { id: 'act002', name: '心理讲座', date: '2026-02-08', status: '已结束' }
  ]
})
function sign(row:any) {
  // 签到API
}
function summary(row:any) {
  // 总结API
}
</script>
