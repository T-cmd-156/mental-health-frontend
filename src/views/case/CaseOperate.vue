<template>
  <el-card>
    <h2>个案操作</h2>
    <el-form :model="operateForm">
      <el-form-item label="操作类型">
        <el-select v-model="operateForm.type">
          <el-option label="进展更新" value="progress" />
          <el-option label="结案" value="close" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="operateForm.remark" type="textarea" />
      </el-form-item>
      <el-button type="primary" @click="submitOperate">提交</el-button>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const operateForm = ref({ type: '', remark: '' })
function submitOperate() {
  // 提交操作
}
</script>
