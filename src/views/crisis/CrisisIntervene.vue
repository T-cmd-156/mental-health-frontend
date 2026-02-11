<template>
  <el-card>
    <h2>危机干预</h2>
    <el-form :model="interveneForm">
      <el-form-item label="干预措施">
        <el-input v-model="interveneForm.action" type="textarea" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="interveneForm.remark" type="textarea" />
      </el-form-item>
      <el-button type="primary" @click="submitIntervene">提交</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const interveneForm = ref({ action: '', remark: '' })
function submitIntervene() {
  // 提交干预
}
</script>
