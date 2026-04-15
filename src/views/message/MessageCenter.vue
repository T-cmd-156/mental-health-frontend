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
        <el-table-column prop="title" label="标题" min-width="240" show-overflow-tooltip />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">{{ typeLabel(row.type) }}</template>
        </el-table-column>
        <el-table-column label="时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="88">
          <template #default="{ row }">
            <el-tag :type="row.read ? 'info' : 'danger'" size="small">{{ row.read ? '已读' : '未读' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)">查看详情</el-button>
            <el-button v-if="row.link" type="success" link @click="goMessageLink(row.link)">前往处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && list.length === 0" description="暂无消息" />

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

    <el-dialog v-model="detailVisible" :title="detail.title || '消息详情'" width="720px">
      <div class="detail-meta">
        <span>时间：{{ formatTime(detail.createTime, true) || '—' }}</span>
        <span v-if="detail.type" class="meta-gap">类型：{{ typeLabel(detail.type) }}</span>
      </div>
      <div class="detail-content">{{ detail.content || '暂无内容' }}</div>
      <template #footer>
        <el-button v-if="detail.link" type="primary" @click="goMessageLink(detail.link)">前往处理</el-button>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getMessageList, markAsRead } from '../../api/message.js'

const router = useRouter()

const loading = ref(false)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const detailVisible = ref(false)
const detail = ref({})

const TYPE_LABELS = {
  crisis: '危机',
  appointment: '预约',
  assessment: '测评',
  system: '系统',
  activity: '活动',
  NOTIFICATION: '通知',
  APPOINTMENT: '预约',
  ALERT: '预警',
}

function typeLabel(t) {
  if (t == null || t === '') return '—'
  return TYPE_LABELS[String(t)] || String(t)
}

function normalizeListPayload(data) {
  if (Array.isArray(data)) return { records: data, total: data.length }
  if (data && typeof data === 'object') {
    const records = data.records || data.list || []
    const arr = Array.isArray(records) ? records : []
    let totalVal = data.total != null ? Number(data.total) : arr.length
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
    const res = await getMessageList({ page: currentPage.value, pageSize: pageSize.value })
    const { records, total: t } = normalizeListPayload(res?.data)
    list.value = records
    total.value = t
  } catch (_) {
    list.value = []
    total.value = 0
    ElMessage.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

function onSizeChange() {
  currentPage.value = 1
  loadList()
}

async function openDetail(row) {
  detail.value = { ...row }
  detailVisible.value = true
  const id = row?.id
  if (id && row.read === false) {
    try {
      await markAsRead([id])
      row.read = true
    } catch (_) {
      /* 标记已读失败不阻断查看 */
    }
  }
}

function goMessageLink(link) {
  if (!link) return
  const path = String(link).startsWith('/') ? link : `/${link}`
  router.push(path)
  detailVisible.value = false
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
.meta-gap { margin-left: 16px; }
.detail-content { line-height: 1.8; color: #334155; white-space: pre-wrap; }
</style>
