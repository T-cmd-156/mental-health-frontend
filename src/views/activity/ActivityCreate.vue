<template>
  <div class="activity-create-page">
    <div class="page-head">
      <div class="head-main">
        <el-button @click="$router.back()" :icon="ArrowLeft" text>返回上级</el-button>
        <h2>创建团体活动</h2>
        <p class="page-desc">填写活动名称、时间与描述，创建新的团体心理活动。</p>
      </div>
    </div>
    <el-card class="form-card" shadow="never">
      <el-form :model="form" label-width="100px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择活动时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入活动描述" />
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary" @click="submit">创建</el-button>
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
const form = ref({ name: '', date: '', desc: '' })

function submit() {
  ElMessage.success('活动创建成功')
  router.back()
}
</script>

<style scoped>
.activity-create-page {
  padding: 0;
  max-width: 800px;
}

.page-head {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border-radius: 14px;
  border: 1px solid #bae6fd;
}

.head-main h2 {
  margin: 12px 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.form-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}
</style>
