<template>
  <el-card>
    <h2>危机等级调整</h2>
    <el-form :model="levelForm">
      <el-form-item label="当前等级">
        <el-input v-model="levelForm.current" disabled />
      </el-form-item>
      <el-form-item label="调整等级">
        <el-select v-model="levelForm.new">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitLevel">提交</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const levelForm = ref({ current: '', new: '' })
function submitLevel() {
  // 提交等级调整
}
</script>
