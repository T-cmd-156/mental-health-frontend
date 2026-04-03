<template>
  <div class="activity-manage-page">
    <div class="page-head">
      <div class="head-main">
        <h2>团体活动管理</h2>
        <p class="page-desc">管理团体心理活动，支持签到与填写活动总结。</p>
      </div>
      <div class="head-actions">
        <el-button type="primary" :icon="Plus" @click="goCreate">创建活动</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.ongoing }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.finished }}</span>
        <span class="stat-label">已结束</span>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table :data="activities" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="活动编号" width="120" />
        <el-table-column prop="name" label="活动名称" min-width="160" />
        <el-table-column prop="date" label="活动时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === '进行中'"
              type="primary"
              size="small"
              @click="sign(row)"
            >
              签到
            </el-button>
            <el-button
              type="default"
              size="small"
              @click="summary(row)"
            >
              填写总结
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!activities.length && !loading" description="暂无活动" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const activities = ref<any[]>([])

const stats = computed(() => ({
  ongoing: activities.value.filter((a) => a.status === '进行中').length,
  finished: activities.value.filter((a) => a.status === '已结束').length,
}))

function getStatusType(status: string) {
  return status === '进行中' ? 'success' : 'info'
}

function loadData() {
  loading.value = true
  activities.value = [
    { id: 'act001', name: '团体辅导', date: '2026-02-12', status: '进行中' },
    { id: 'act002', name: '心理讲座', date: '2026-02-08', status: '已结束' },
  ]
  loading.value = false
}

function sign(row: any) {
  router.push({ path: '/admin/activity-sign', query: { id: row.id } })
}

function summary(row: any) {
  router.push({ path: '/admin/activity-summary', query: { id: row.id } })
}

function goCreate() {
  router.push('/admin/activity-create')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.activity-manage-page {
  max-width: 1000px;
  padding: 0;
}

.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border-radius: 14px;
  border: 1px solid #bae6fd;
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
</style>
