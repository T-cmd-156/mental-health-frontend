<template>
  <div class="message-center">
    <div class="page-header">
      <div class="header-left">
        <h1>消息中心</h1>
        <el-badge v-if="total > 0" :value="total" class="total-badge" />
      </div>
      <el-button :icon="Refresh" @click="loadList">刷新</el-button>
    </div>

    <el-card class="list-card" shadow="never" v-loading="loading">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="title" label="通知标题" min-width="260" show-overflow-tooltip />
        <el-table-column prop="publishTime" label="发布时间" width="180">
          <template #default="{ row }">{{ formatTime(row.publishTime || row.createTime) }}</template>
        </el-table-column>
        <el-table-column prop="publisher" label="发布人" width="140">
          <template #default="{ row }">{{ row.publisher || row.author || '系统' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && list.length === 0" description="暂无通知公告" />

      <div v-if="total > pageSize" class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @current-change="loadList"
          @size-change="onSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" :title="detail.title || '通知详情'" width="720px">
      <div class="detail-meta">
        <span>发布时间：{{ formatTime(detail.publishTime || detail.createTime, true) || '—' }}</span>
      </div>
      <div class="detail-content">{{ detail.content || detail.summary || '暂无内容' }}</div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getNoticeList, getNoticeDetail } from '../../api/notice'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const detailVisible = ref(false)
const detail = ref({})

function normalizeListPayload(data) {
  if (Array.isArray(data)) return { records: data, total: data.length }
  if (data && typeof data === 'object') {
    const records = data.records || data.list || []
    const arr = Array.isArray(records) ? records : []
    let totalVal = data.total != null ? Number(data.total) : arr.length
    /* 部分后端返回 total=0 但 records 有数据，分页组件依赖 total */
    if (arr.length > 0 && (!Number.isFinite(totalVal) || totalVal < arr.length)) {
      totalVal = arr.length
    }
    return { records: arr, total: Number.isFinite(totalVal) ? totalVal : 0 }
  }
  return { records: [], total: 0 }
}

async function loadList() {
  loading.value = true
  try {
    const res = await getNoticeList({ page: currentPage.value, pageSize: pageSize.value })
    const { records, total: t } = normalizeListPayload(res?.data)
    list.value = records
    total.value = t
  } catch (_) {
    list.value = []
    total.value = 0
    ElMessage.error('获取通知列表失败')
  } finally {
    loading.value = false
  }
}

function onSizeChange() {
  currentPage.value = 1
  loadList()
}

async function openDetail(row) {
  const id = row?.id || row?.noticeId
  if (!id) {
    ElMessage.warning('通知编号不存在')
    return
  }
  try {
    const res = await getNoticeDetail({ id })
    detail.value = res?.data || {}
    detailVisible.value = true
  } catch (_) {
    ElMessage.error('获取通知详情失败')
  }
}

function formatTime(str, full = false) {
  if (!str) return ''
  const d = new Date(str)
  if (Number.isNaN(d.getTime())) return String(str)
  if (full) return d.toLocaleString('zh-CN')
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => loadList())
</script>

<style scoped>
.message-center { max-width: 1000px; margin: 0 auto; padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.header-left { display: flex; align-items: center; gap: 10px; }
.header-left h1 { margin: 0; font-size: 22px; color: #1f2937; }
.list-card { border-radius: 12px; border: 1px solid #e2e8f0; }
.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
.detail-meta { margin-bottom: 12px; color: #64748b; font-size: 13px; }
.detail-content { line-height: 1.8; color: #334155; white-space: pre-wrap; }
</style>
