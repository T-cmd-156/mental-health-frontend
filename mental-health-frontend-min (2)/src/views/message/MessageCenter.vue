<template>
  <div class="message-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>消息中心</h1>
        <el-badge v-if="unreadCount > 0" :value="unreadCount" class="unread-badge" />
      </div>
      <div class="header-actions">
        <el-select v-model="filterType" placeholder="消息类型" clearable style="width: 120px" @change="handleFilterChange">
          <el-option v-for="t in messageTypes" :key="t.value" :label="t.label" :value="t.value || undefined" />
        </el-select>
        <el-select v-model="filterRead" placeholder="阅读状态" clearable style="width: 120px" @change="handleFilterChange">
          <el-option label="未读" :value="false" />
          <el-option label="已读" :value="true" />
        </el-select>
        <el-button :icon="Refresh" @click="loadList">刷新</el-button>
      </div>
    </div>

    <!-- 未读提示 -->
    <el-alert
      v-if="unreadCount > 0"
      type="warning"
      show-icon
      :closable="false"
      class="unread-alert"
    >
      <template #title>
        您有 <strong>{{ unreadCount }}</strong> 条未读消息
        <span v-if="priorityCount > 0">，其中 <strong style="color: #ff4d4f">{{ priorityCount }}</strong> 条为危机/预警类，请优先处理</span>
      </template>
    </el-alert>

    <!-- 批量操作栏 -->
    <div class="batch-actions" v-if="selectedIds.length > 0 || list.length > 0">
      <div class="batch-left">
        <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="handleSelectAllChange">
          全选
        </el-checkbox>
        <span class="selected-count" v-if="selectedIds.length > 0">
          已选择 {{ selectedIds.length }} 条
        </span>
      </div>
      <div class="batch-right" v-if="selectedIds.length > 0">
        <el-button size="small" @click="batchMarkRead">标为已读</el-button>
        <el-button size="small" @click="batchMarkUnread">标为未读</el-button>
        <el-button size="small" type="danger" @click="batchDelete">删除</el-button>
      </div>
      <div class="batch-right" v-else>
        <el-button size="small" type="primary" @click="markAllRead">全部标为已读</el-button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" v-loading="loading">
      <div
        v-for="message in list"
        :key="message.id"
        class="message-item"
        :class="{
          unread: !message.read,
          crisis: message.priority || message.type === 'crisis',
          selected: selectedIds.includes(message.id)
        }"
      >
        <div class="item-checkbox">
          <el-checkbox v-model="message.checked" @change="handleItemCheck(message)" />
        </div>
        <div class="item-content" @click="openMessage(message)">
          <div class="item-header">
            <el-tag
              v-if="message.priority || message.type === 'crisis'"
              type="danger"
              size="small"
              class="priority-tag"
            >
              优先
            </el-tag>
            <el-tag
              :color="getTypeColor(message.type)"
              size="small"
              class="type-tag"
            >
              {{ typeLabel(message.type) }}
            </el-tag>
            <span class="item-title" :class="{ bold: !message.read }">{{ message.title }}</span>
            <span class="item-dot" v-if="!message.read" />
          </div>
          <div class="item-body">
            <p class="item-summary">{{ message.content }}</p>
          </div>
          <div class="item-footer">
            <span class="item-time">
              <el-icon><Clock /></el-icon>
              {{ formatTime(message.createTime) }}
            </span>
          </div>
        </div>
        <div class="item-actions">
          <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, message)">
            <el-button :icon="MoreFilled" circle size="small" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view">
                  <el-icon><View /></el-icon> 查看详情
                </el-dropdown-item>
                <el-dropdown-item v-if="!message.read" command="read">
                  <el-icon><Select /></el-icon> 标为已读
                </el-dropdown-item>
                <el-dropdown-item v-else command="unread">
                  <el-icon><Document /></el-icon> 标为未读
                </el-dropdown-item>
                <el-dropdown-item v-if="message.link" command="goto">
                  <el-icon><Right /></el-icon> 前往处理
                </el-dropdown-item>
                <el-dropdown-item command="delete" divided>
                  <span style="color: #ff4d4f"><el-icon><Delete /></el-icon> 删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && list.length === 0" description="暂无消息" />
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 消息详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="currentMessage?.title"
      width="600px"
      class="message-detail-dialog"
    >
      <div class="detail-content" v-if="currentMessage">
        <div class="detail-meta">
          <el-tag :color="getTypeColor(currentMessage.type)" size="small">
            {{ typeLabel(currentMessage.type) }}
          </el-tag>
          <span class="detail-time">{{ formatTime(currentMessage.createTime, true) }}</span>
        </div>
        <div class="detail-body">
          <p>{{ currentMessage.content }}</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button v-if="currentMessage?.link" type="primary" @click="gotoLink(currentMessage)">
            前往处理
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, Refresh, MoreFilled, View, Select, Document, Right, Delete } from '@element-plus/icons-vue'
import {
  getMessageListMock as getMessageList,
  getUnreadCountMock as getUnreadCount,
  markAsReadMock as markAsRead,
  markAsUnreadMock as markAsUnread,
  markAllAsReadMock as markAllAsRead,
  deleteMessagesMock as deleteMessages,
  messageTypes,
  messageTypeColors
} from '../../api/message'

const router = useRouter()

// 列表数据
const list = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const filterType = ref('')
const filterRead = ref(undefined)

// 未读统计
const unreadCount = ref(0)
const priorityCount = ref(0)

// 选择状态
const selectedIds = ref([])
const selectAll = ref(false)

// 详情弹窗
const detailVisible = ref(false)
const currentMessage = ref(null)

// 计算属性：是否半选
const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < list.value.length
})

// 加载消息列表
async function loadList() {
  loading.value = true
  selectedIds.value = []
  selectAll.value = false
  try {
    const res = await getMessageList({
      type: filterType.value || undefined,
      read: filterRead.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    if (res.code === 200 && res.data) {
      list.value = (res.data.list || []).map(item => ({
        ...item,
        checked: false
      }))
      total.value = res.data.total || 0
    } else {
      list.value = []
      total.value = 0
    }
  } catch (err) {
    console.error('获取消息列表失败', err)
    ElMessage.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

// 加载未读数量
async function loadUnread() {
  try {
    const res = await getUnreadCount()
    unreadCount.value = res.data || 0
    priorityCount.value = list.value.filter(m => !m.read && (m.priority || m.type === 'crisis')).length
  } catch (err) {
    console.error('获取未读数量失败', err)
  }
}

// 类型标签
function typeLabel(type) {
  const t = messageTypes.find(x => x.value === type)
  return t ? t.label : type
}

// 类型颜色
function getTypeColor(type) {
  return messageTypeColors[type] || '#8c8c8c'
}

// 格式化时间
function formatTime(str, full = false) {
  if (!str) return ''
  const d = new Date(str)
  const now = new Date()
  if (full) {
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  if (diffDays === 1) {
    return '昨天 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekdays[d.getDay()] + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

// 筛选变化
function handleFilterChange() {
  currentPage.value = 1
  loadList()
}

// 分页变化
function handlePageChange(page) {
  currentPage.value = page
  loadList()
}

function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
  loadList()
}

// 全选处理
function handleSelectAllChange(val) {
  list.value.forEach(item => {
    item.checked = val
  })
  if (val) {
    selectedIds.value = list.value.map(item => item.id)
  } else {
    selectedIds.value = []
  }
}

// 单项选择处理
function handleItemCheck(message) {
  if (message.checked) {
    if (!selectedIds.value.includes(message.id)) {
      selectedIds.value.push(message.id)
    }
  } else {
    selectedIds.value = selectedIds.value.filter(id => id !== message.id)
  }
  selectAll.value = selectedIds.value.length === list.value.length
}

// 打开消息
async function openMessage(message) {
  currentMessage.value = message
  detailVisible.value = true
  if (!message.read) {
    try {
      await markAsRead(message.id)
      message.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
      if (message.priority || message.type === 'crisis') {
        priorityCount.value = Math.max(0, priorityCount.value - 1)
      }
    } catch (err) {
      console.error('标记已读失败', err)
    }
  }
}

// 前往链接
function gotoLink(message) {
  detailVisible.value = false
  if (message.link) {
    router.push(message.link)
  }
}

// 下拉菜单命令
async function handleCommand(command, message) {
  switch (command) {
    case 'view':
      openMessage(message)
      break
    case 'read':
      await markMessageRead(message)
      break
    case 'unread':
      await markMessageUnread(message)
      break
    case 'goto':
      gotoLink(message)
      break
    case 'delete':
      await deleteMessage(message)
      break
    default:
      break
  }
}

// 标记单条已读
async function markMessageRead(message) {
  try {
    await markAsRead(message.id)
    message.read = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    ElMessage.success('已标记为已读')
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

// 标记单条未读
async function markMessageUnread(message) {
  try {
    await markAsUnread(message.id)
    message.read = false
    unreadCount.value += 1
    ElMessage.success('已标记为未读')
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

// 删除单条
async function deleteMessage(message) {
  try {
    await ElMessageBox.confirm('确定要删除这条消息吗？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteMessages(message.id)
    list.value = list.value.filter(m => m.id !== message.id)
    total.value -= 1
    if (!message.read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
    ElMessage.success('删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量标为已读
async function batchMarkRead() {
  if (selectedIds.value.length === 0) return
  try {
    await markAsRead(selectedIds.value)
    let readCount = 0
    list.value.forEach(m => {
      if (selectedIds.value.includes(m.id) && !m.read) {
        m.read = true
        m.checked = false
        readCount++
      }
    })
    unreadCount.value = Math.max(0, unreadCount.value - readCount)
    selectedIds.value = []
    selectAll.value = false
    ElMessage.success('批量标记已读成功')
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

// 批量标为未读
async function batchMarkUnread() {
  if (selectedIds.value.length === 0) return
  try {
    await markAsUnread(selectedIds.value)
    let unreadAddCount = 0
    list.value.forEach(m => {
      if (selectedIds.value.includes(m.id) && m.read) {
        m.read = false
        m.checked = false
        unreadAddCount++
      }
    })
    unreadCount.value += unreadAddCount
    selectedIds.value = []
    selectAll.value = false
    ElMessage.success('批量标记未读成功')
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

// 批量删除
async function batchDelete() {
  if (selectedIds.value.length === 0) return
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条消息吗？`, '批量删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteMessages(selectedIds.value)
    const deletedUnread = list.value.filter(m => selectedIds.value.includes(m.id) && !m.read).length
    list.value = list.value.filter(m => !selectedIds.value.includes(m.id))
    total.value -= selectedIds.value.length
    unreadCount.value = Math.max(0, unreadCount.value - deletedUnread)
    selectedIds.value = []
    selectAll.value = false
    ElMessage.success('批量删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 全部标为已读
async function markAllRead() {
  try {
    await ElMessageBox.confirm('确定要将所有消息标记为已读吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    await markAllAsRead()
    list.value.forEach(m => {
      m.read = true
    })
    unreadCount.value = 0
    priorityCount.value = 0
    ElMessage.success('全部标记已读成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 监听列表变化更新优先级计数
watch(list, (val) => {
  priorityCount.value = val.filter(m => !m.read && (m.priority || m.type === 'crisis')).length
}, { deep: true })

onMounted(() => {
  loadList()
  loadUnread()
})
</script>

<style scoped>
.message-center {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
}

.unread-badge {
  margin-left: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.unread-alert {
  margin-bottom: 16px;
  border-radius: 8px;
}

.unread-alert strong {
  font-size: 16px;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.batch-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selected-count {
  color: #1890ff;
  font-size: 14px;
}

.batch-right {
  display: flex;
  gap: 8px;
}

.message-list {
  background: #fff;
  border-radius: 0 0 8px 8px;
  min-height: 300px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s ease;
  cursor: pointer;
}

.message-item:hover {
  background: #fafafa;
}

.message-item.unread {
  background: #f0f9ff;
}

.message-item.unread:hover {
  background: #e6f4ff;
}

.message-item.crisis {
  border-left: 4px solid #ff4d4f;
}

.message-item.selected {
  background: #e6f7ff;
}

.item-checkbox {
  padding-top: 4px;
  margin-right: 12px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.priority-tag {
  font-size: 11px;
}

.type-tag {
  font-size: 11px;
  color: #fff !important;
  border: none;
}

.item-title {
  font-size: 15px;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.item-title.bold {
  font-weight: 600;
}

.item-dot {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-body {
  margin-bottom: 8px;
}

.item-summary {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  align-items: center;
}

.item-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.item-actions {
  margin-left: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-item:hover .item-actions {
  opacity: 1;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
}

/* 详情弹窗样式 */
.message-detail-dialog .detail-content {
  padding: 8px 0;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-time {
  font-size: 13px;
  color: #9ca3af;
}

.detail-body p {
  margin: 0;
  font-size: 15px;
  color: #374151;
  line-height: 1.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .message-center {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions .el-select {
    flex: 1;
    min-width: 100px;
  }

  .batch-actions {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .message-item {
    padding: 12px 16px;
  }

  .item-actions {
    opacity: 1;
  }
}
</style>
