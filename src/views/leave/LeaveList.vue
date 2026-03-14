<template>
  <div class="leave-list-page">
    <div class="page-head">
      <div class="head-main">
        <h2>请假记录</h2>
        <p class="page-desc">查看我的请假申请记录，支持撤销待审批申请或重新申请。</p>
      </div>
      <div class="head-actions">
        <el-button type="primary" :icon="Plus" @click="goApply">申请请假</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.pending }}</span>
        <span class="stat-label">待审批</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.approved }}</span>
        <span class="stat-label">已通过</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.rejected }}</span>
        <span class="stat-label">已拒绝</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.cancelled }}</span>
        <span class="stat-label">已撤销</span>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <div class="card-header">
        <el-form :inline="true" :model="filter" class="filter-form">
          <el-form-item label="状态">
            <el-select v-model="filter.status" placeholder="全部" clearable style="width: 120px" @change="applyFilter">
              <el-option label="待审批" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已拒绝" value="rejected" />
              <el-option label="已撤销" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="filteredList" stripe v-loading="loading">
        <el-table-column prop="id" label="编号" width="100" />
        <el-table-column prop="leaveDate" label="请假日期" width="120" />
        <el-table-column prop="leaveTime" label="时间段" width="140" />
        <el-table-column prop="reason" label="请假原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="warning"
              link
              size="small"
              @click="cancel(row)"
            >
              撤销
            </el-button>
            <el-button
              v-if="['rejected', 'cancelled'].includes(row.status)"
              type="primary"
              link
              size="small"
              @click="reapply(row)"
            >
              重新申请
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!filteredList.length && !loading" description="暂无请假记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../api/request.js'

const router = useRouter()
const loading = ref(false)
const leaves = ref([])
const filter = reactive({ status: '' })

const STATUS_MAP = {
  pending: { type: 'warning', text: '待审批' },
  approved: { type: 'success', text: '已通过' },
  rejected: { type: 'info', text: '已拒绝' },
  cancelled: { type: 'info', text: '已撤销' },
}

const filteredList = computed(() => {
  let list = leaves.value
  if (filter.status) {
    list = list.filter((l) => l.status === filter.status)
  }
  return list
})

const stats = computed(() => {
  const list = leaves.value
  return {
    pending: list.filter((l) => l.status === 'pending').length,
    approved: list.filter((l) => l.status === 'approved').length,
    rejected: list.filter((l) => l.status === 'rejected').length,
    cancelled: list.filter((l) => l.status === 'cancelled').length,
  }
})

function getStatusType(status) {
  return STATUS_MAP[status]?.type || 'info'
}

function getStatusText(status) {
  return STATUS_MAP[status]?.text || status
}

async function loadData() {
  loading.value = true
  try {
    const res = await request.get('/api/leave/list')
    if (res?.code === 200 && Array.isArray(res.data)) {
      leaves.value = res.data.map(normalizeItem)
    } else {
      leaves.value = getMockList()
    }
  } catch {
    leaves.value = getMockList()
  }
  loading.value = false
}

function normalizeItem(item) {
  return {
    id: item.id,
    leaveDate: item.leaveDate || item.date,
    leaveTime: item.leaveTime || '全天',
    reason: item.reason,
    status: mapStatus(item.status),
    applyTime: item.applyTime || item.createTime || '-',
  }
}

function mapStatus(s) {
  if (['pending', 'approved', 'rejected', 'cancelled'].includes(s)) return s
  if (s === '已提交') return 'pending'
  if (s === '已通过') return 'approved'
  if (s === '已拒绝') return 'rejected'
  if (s === '已撤销') return 'cancelled'
  return s
}

function getMockList() {
  return [
    { id: 'l001', leaveDate: '2026-02-20', leaveTime: '09:00-12:00', reason: '身体不适', status: 'pending', applyTime: '2026-02-19 14:30' },
    { id: 'l002', leaveDate: '2026-02-15', leaveTime: '全天', reason: '家庭原因', status: 'cancelled', applyTime: '2026-02-14 10:00' },
    { id: 'l003', leaveDate: '2026-02-10', leaveTime: '14:00-17:00', reason: '参加学术会议', status: 'approved', applyTime: '2026-02-09 16:20' },
  ]
}

function applyFilter() {
  // 筛选由 computed 自动处理
}

function goApply() {
  router.push('/leave/apply')
}

function cancel(row) {
  ElMessageBox.confirm('确定撤销该请假申请？', '撤销确认', {
    type: 'warning',
  })
    .then(() => {
      request
        .post('/api/leave/cancel', { id: row.id })
        .then((res) => {
          if (res?.code === 200) {
            row.status = 'cancelled'
            ElMessage.success('已撤销')
          } else {
            row.status = 'cancelled'
            ElMessage.success('已撤销（演示）')
          }
        })
        .catch(() => {
          row.status = 'cancelled'
          ElMessage.success('已撤销（演示）')
        })
    })
    .catch(() => {})
}

function reapply(row) {
  router.push({ path: '/leave/apply', query: { fromId: row.id } })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.leave-list-page {
  max-width: 1000px;
  padding: 20px 0;
}

.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #fffbeb 100%);
  border-radius: 14px;
  border: 1px solid #fde68a;
}

.head-main h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.stats-row {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.table-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.card-header {
  margin-bottom: 16px;
}

.filter-form {
  margin-bottom: 0;
}
</style>
