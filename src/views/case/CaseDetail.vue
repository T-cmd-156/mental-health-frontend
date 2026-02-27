<template>
  <el-card>
    <h2>个案详情</h2>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="个案编号">{{ caseData.id }}</el-descriptions-item>
      <el-descriptions-item label="学生姓名">{{ caseData.student_name }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ caseData.status }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ caseData.created_at }}</el-descriptions-item>
      <el-descriptions-item label="最新进展">{{ caseData.progress }}</el-descriptions-item>
    </el-descriptions>
    <el-button @click="operateCase">操作</el-button>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCaseDetail } from '../../api/case'
import { useRoute } from 'vue-router'
const route = useRoute()
const caseData = ref<any>({})
onMounted(async () => {
  caseData.value = await fetchCaseDetail(String(route.params.id))
})
function operateCase() {
  // 跳转到操作页面
}
</script>
