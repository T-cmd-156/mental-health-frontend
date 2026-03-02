<template>
  <el-card>
    <h2>活动总结填写</h2>
    <el-form :model="form">
      <el-form-item label="总结内容">
        <el-input v-model="form.content" type="textarea" />
      </el-form-item>
      <el-button type="primary" @click="submit">提交总结</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const form = ref({ content: '' })
function submit() {
  // 总结API
}
</script>
