<template>
  <el-card>
    <h2>危机评估</h2>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="危机编号">{{ crisis.id }}</el-descriptions-item>
      <el-descriptions-item label="学生姓名">{{ crisis.student_name }}</el-descriptions-item>
      <el-descriptions-item label="危机等级">{{ crisis.level }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ crisis.status }}</el-descriptions-item>
    </el-descriptions>
    <el-button @click="intervene">干预</el-button>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCrisisDetail } from '../../api/crisis'
import { useRoute } from 'vue-router'
const route = useRoute()
const crisis = ref<any>({})
onMounted(async () => {
  crisis.value = await fetchCrisisDetail(String(route.params.id))
})
function intervene() {
  // 跳转到干预页面
}
</script>
