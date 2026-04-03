<template>
  <div class="page">
    <header class="page-head">
      <h1>关联家长</h1>
      <p class="sub">家长发起绑定后，请在本页或登录后的提示框中确认或拒绝。状态：0 待确认 · 1 已绑定 · 2 已拒绝。</p>
    </header>

    <el-card v-loading="loading" shadow="never" class="mb">
      <template #header>
        <span>当前绑定状态</span>
      </template>
      <el-empty v-if="!bindUserId" description="未获取到学生账号 ID，请使用学校统一登录（JWT 中会写入 userId）" />
      <template v-else>
        <div class="status-row">
          <span class="label">状态：</span>
          <el-tag :type="statusTagType(bindStatus)" size="large">{{ statusText(bindStatus) }}</el-tag>
        </div>
        <p v-if="showPendingTip" class="pending-tip">
          有家长申请与您关联，请核对身份后点击「确认」或「拒绝」。接口使用当前登录账号的 studentId（路径参数）。
        </p>
        <p v-else-if="showBindActions && bindStatus == null" class="pending-tip muted">
          未能解析绑定状态，若确有家长申请，仍可尝试「确认」或「拒绝」。
        </p>
        <div class="actions">
          <template v-if="showBindActions">
            <el-button type="primary" size="large" :loading="acting" @click="onConfirm">确认</el-button>
            <el-button type="danger" plain size="large" :loading="acting" @click="onReject">拒绝</el-button>
          </template>
          <el-button link type="primary" @click="refresh">刷新状态</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBindStatus,
  confirmStudentBind,
  rejectStudentBind,
  normalizeBindStatus,
} from '@/api/studentBind.js'
import { getStudentBindUserId } from '@/utils/studentBindSession.js'

const loading = ref(false)
const acting = ref(false)
const bindStatus = ref(null)
const bindUserId = ref('')

/** 已绑定(1)、已拒绝(2) 不再显示确认/拒绝；待确认(0)、未知(null) 及其他非终态显示按钮 */
const showBindActions = computed(() => {
  if (!bindUserId.value) return false
  const s = bindStatus.value
  if (s === 1 || s === 2) return false
  return true
})

const showPendingTip = computed(() => bindStatus.value === 0)

function statusText(v) {
  const n = Number(v)
  if (Number.isNaN(n)) return '未知'
  if (n === 0) return '待确认'
  if (n === 1) return '已绑定'
  if (n === 2) return '已拒绝'
  return `状态码 ${n}`
}

function statusTagType(v) {
  const n = Number(v)
  if (n === 1) return 'success'
  if (n === 0) return 'warning'
  if (n === 2) return 'info'
  return 'info'
}

async function refresh() {
  const sid = (getStudentBindUserId() || '').trim()
  bindUserId.value = sid
  if (!sid) {
    bindStatus.value = null
    return
  }
  loading.value = true
  try {
    const res = await getBindStatus(sid)
    if (res.code === 200) {
      bindStatus.value = normalizeBindStatus(res.data)
    } else {
      ElMessage.error(res.msg || '查询失败')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function resolveStudentId() {
  return (getStudentBindUserId() || bindUserId.value || '').trim()
}

async function onConfirm() {
  const sid = resolveStudentId()
  if (!sid) {
    ElMessage.warning('缺少 studentId，请重新登录')
    return
  }
  try {
    await ElMessageBox.confirm('确认后将与家长建立关联，是否继续？', '接受绑定', { type: 'warning' })
    acting.value = true
    const res = await confirmStudentBind(sid)
    if (res.code === 200) {
      ElMessage.success(res.msg || '已确认')
      await refresh()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (e) {
    if (e !== 'cancel') {
      console.error(e)
      ElMessage.error(e?.response?.data?.msg || e?.message || '操作失败')
    }
  } finally {
    acting.value = false
  }
}

async function onReject() {
  const sid = resolveStudentId()
  if (!sid) {
    ElMessage.warning('缺少 studentId，请重新登录')
    return
  }
  try {
    await ElMessageBox.confirm('拒绝后家长需重新发起绑定，是否拒绝？', '拒绝绑定', { type: 'warning' })
    acting.value = true
    const res = await rejectStudentBind(sid)
    if (res.code === 200) {
      ElMessage.success(res.msg || '已拒绝')
      await refresh()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (e) {
    if (e !== 'cancel') {
      console.error(e)
      ElMessage.error(e?.response?.data?.msg || e?.message || '操作失败')
    }
  } finally {
    acting.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}
.page-head h1 {
  margin: 0 0 8px;
  font-size: 1.35rem;
}
.sub {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}
.mb {
  margin-bottom: 20px;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.status-row .label {
  color: #64748b;
  font-size: 14px;
}
.pending-tip {
  margin: 0 0 16px;
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;
}
.pending-tip.muted {
  color: #64748b;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
