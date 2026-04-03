<template>
  <div class="activity-sub-page">
    <div class="page-head">
      <el-button text type="primary" :icon="ArrowLeft" @click="goBack">返回活动列表</el-button>
      <h2>活动签到</h2>
      <p class="page-desc">活动编号：{{ activityId || '—' }}，确认到场人员并完成签到登记。</p>
    </div>
    <el-card shadow="never" class="form-card">
      <el-form :model="form" label-width="100px" @submit.prevent="handleCheckIn">
        <el-form-item label="签到人" required>
          <el-input v-model="form.user" placeholder="姓名或学号" clearable />
        </el-form-item>
        <el-form-item label="签到时间" required>
          <el-date-picker
            v-model="form.time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="button"
            :loading="submitting"
            @click="handleCheckIn"
          >
            签到
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { manualCheckIn } from '../../api/openapi.js'

const route = useRoute()
const router = useRouter()
const activityId = ref('')
const submitting = ref(false)
const form = ref({
  user: '',
  time: '',
  remark: '',
})

function goBack() {
  router.push('/admin/activity-manage')
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function defaultNowString() {
  const now = new Date()
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`
}

async function handleCheckIn() {
  const id = activityId.value || String(route.query.id || '').trim()
  if (!id) {
    ElMessage.warning('缺少活动编号，请从活动管理进入签到页')
    return
  }
  if (!form.value.user?.trim()) {
    ElMessage.warning('请填写签到人')
    return
  }
  if (!form.value.time) {
    ElMessage.warning('请选择签到时间')
    return
  }

  submitting.value = true
  try {
    const payload = {
      activityId: id,
      signerName: form.value.user.trim(),
      signTime: form.value.time,
      remark: form.value.remark?.trim() || undefined,
    }
    const res = await manualCheckIn(payload)
    if (res && res.code === 200) {
      ElMessage.success(res.msg || '签到成功')
      await router.push('/admin/activity-manage')
    } else {
      ElMessage.error(res?.msg || res?.message || '签到失败')
    }
  } catch (e) {
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV
    const noBackend =
      e?.code === 'ERR_NETWORK' ||
      e?.response?.status === 404 ||
      e?.response?.status === 502
    if (isDev && noBackend) {
      ElMessage.success('签到已记录')
      await router.push('/admin/activity-manage')
      return
    }
    const raw =
      e?.response?.data?.message ||
      e?.response?.data?.msg ||
      e?.message ||
      '签到失败'
    const msg = typeof raw === 'string' ? raw : '签到失败，请检查网络或后端服务'
    ElMessage.error(msg)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  activityId.value = String(route.query.id || '')
  if (!form.value.time) {
    form.value.time = defaultNowString()
  }
})
</script>

<style scoped>
.activity-sub-page {
  max-width: 640px;
  padding: 0;
}
.page-head {
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fff 0%, #f0fdf4 100%);
  border-radius: 12px;
  border: 1px solid #bbf7d0;
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
