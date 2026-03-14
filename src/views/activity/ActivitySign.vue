<template>
  <el-card>
    <h2>活动签到</h2>
    <el-form :model="form">
      <el-form-item label="签到人">
        <el-input v-model="form.user" />
      </el-form-item>
      <el-form-item label="签到时间">
        <el-date-picker v-model="form.time" type="datetime" />
      </el-form-item>
      <el-button type="primary" @click="submit">签到</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const form = ref({ user: '', time: '' })
function submit() {
  // 签到API
}
</script>
