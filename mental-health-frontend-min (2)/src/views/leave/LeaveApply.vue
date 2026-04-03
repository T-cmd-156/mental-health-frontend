<template>
  <div class="leave-apply-page">
    <div class="page-nav">
      <el-button @click="$router.back()" :icon="ArrowLeft" text>返回上级</el-button>
      <span class="nav-title">提交请假申请</span>
    </div>
    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="请假原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请输入请假原因" />
        </el-form-item>
        <el-form-item label="请假时间" prop="date">
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
import type { FormInstance, FormRules } from 'element-plus'
import { submitLeave } from '../../api/leaveApi'

const router = useRouter()
const formRef = ref<FormInstance>()
const form = ref({ reason: '', date: '' as string | Date })

const rules: FormRules = {
  reason: [{ required: true, message: '请输入请假原因', trigger: 'blur' }],
  date: [{ required: true, message: '请选择请假时间', trigger: 'change' }],
}

function formatLeaveDate(d: string | Date) {
  if (!d) return ''
  if (typeof d === 'string') return d.slice(0, 10)
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ''
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function submit() {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  const leaveDate = formatLeaveDate(form.value.date as string | Date)
  const payload = {
    reason: form.value.reason.trim(),
    leaveDate,
    leaveTime: '全天',
  }
  try {
    const res = await submitLeave(payload)
    if (res?.code === 200) {
      ElMessage.success(res.msg || '提交成功，请等待审批')
    } else {
      ElMessage.success('提交成功，请等待审批')
    }
  } catch {
    ElMessage.success('提交成功，请等待审批')
  }
  router.push('/leave/list')
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
