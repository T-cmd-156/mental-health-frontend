<template>
  <el-card>
    <h2>创建团体活动</h2>
    <el-form :model="form">
      <el-form-item label="活动名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker v-model="form.date" type="date" />
      </el-form-item>
      <el-form-item label="活动描述">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-button type="primary" @click="submit">创建</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const form = ref({ name: '', date: '', desc: '' })
function submit() {
  // 创建活动API
}
</script>
