<template>
  <div class="activity-sub-page">
    <div class="page-head">
      <el-button text type="primary" :icon="ArrowLeft" @click="goBack">返回活动列表</el-button>
      <h2>活动总结</h2>
      <p class="page-desc">活动编号：{{ activityId || '—' }}，填写本场次小结并提交归档。</p>
    </div>
    <el-card shadow="never" class="form-card">
      <el-form :model="form" label-width="100px" @submit.prevent>
        <el-form-item label="总结内容" required>
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            maxlength="2000"
            show-word-limit
            placeholder="活动过程、参与情况、效果与改进建议等"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submit">提交总结</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const activityId = ref('')
const submitting = ref(false)
const form = ref({ content: '' })

function goBack() {
  router.push('/admin/activity-manage')
}

function submit() {
  if (!form.value.content?.trim()) {
    ElMessage.warning('请填写总结内容')
    return
  }
  submitting.value = true
  // 对接 POST /api/activity/summary 时在此调用
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('总结已提交')
    router.push('/admin/activity-manage')
  }, 400)
}

onMounted(() => {
  activityId.value = (route.query.id as string) || ''
})
</script>

<style scoped>
.activity-sub-page {
  max-width: 720px;
  padding: 0;
}
.page-head {
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fff 0%, #eff6ff 100%);
  border-radius: 12px;
  border: 1px solid #bfdbfe;
}
.page-head h2 {
  margin: 12px 0 8px;
  font-size: 20px;
  color: #1e293b;
}
.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}
.form-card {
  border-radius: 12px;
}
</style>
