<template>
  <el-card>
    <h2>提交请假申请</h2>
    <el-form :model="form">
      <el-form-item label="请假原因">
        <el-input v-model="form.reason" type="textarea" />
      </el-form-item>
      <el-form-item label="请假时间">
        <el-date-picker v-model="form.date" type="date" />
      </el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const form = ref({ reason: '', date: '' })
function submit() {
  // 提交API
}
</script>
