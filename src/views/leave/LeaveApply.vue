<template>
  <div class="leave-apply-page">
    <div class="page-nav">
      <el-button @click="$router.back()" :icon="ArrowLeft" text>返回上级</el-button>
      <span class="nav-title">提交请假申请</span>
    </div>
    <el-card>
      <el-form :model="form" label-width="100px">
        <el-form-item label="请假原因">
          <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请输入请假原因" />
        </el-form-item>
        <el-form-item label="请假时间">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择请假时间" style="width: 100%" />
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const form = ref({ reason: '', date: '' })

function submit() {
  ElMessage.success('提交成功')
  router.back()
}
</script>

<style scoped>
.leave-apply-page {
  padding: 20px;
  max-width: 800px;
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}
</style>
