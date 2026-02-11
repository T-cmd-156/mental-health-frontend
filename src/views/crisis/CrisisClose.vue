<template>
  <el-card>
    <h2>危机出库/结案</h2>
    <el-form :model="closeForm">
      <el-form-item label="出库原因">
        <el-input v-model="closeForm.reason" type="textarea" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="closeForm.remark" type="textarea" />
      </el-form-item>
      <el-button type="primary" @click="submitClose">提交</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const closeForm = ref({ reason: '', remark: '' })
function submitClose() {
  // 提交出库/结案
}
</script>
