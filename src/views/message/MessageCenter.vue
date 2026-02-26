<template>
  <div class="message-center">
    <div class="page-header">
      <h1>消息中心</h1>
      <div class="actions">
        <el-select v-model="filterType" placeholder="分类" clearable style="width:120px" @change="loadList">
          <el-option v-for="t in messageTypes" :key="t.value" :label="t.label" :value="t.value || undefined" />
        </el-select>
        <el-select v-model="filterRead" placeholder="已读状态" clearable style="width:120px" @change="loadList">
          <el-option label="未读" :value="false" />
          <el-option label="已读" :value="true" />
        </el-select>
        <el-button type="primary" @click="markAllRead">全部标为已读</el-button>
      </div>
    </div>
    <div class="unread-tip" v-if="unreadCount > 0">
      未读消息 <strong>{{ unreadCount }}</strong> 条，其中危机/预警类请优先处理。
    </div>
    <ul class="message-list">
      <li
        v-for="message in list"
        :key="message.id"
        class="message-item"
        :class="{ unread: !message.isRead, crisis: message.priority }"
        @click="openMessage(message)"
      >
        <span class="tag" v-if="message.priority">危机优先</span>
        <span class="type">{{ typeLabel(message.type) }}</span>
        <span class="title">{{ message.title }}</span>
        <span class="time">{{ formatTime(message.createdAt) }}</span>
      </li>
      <li v-if="list.length === 0" class="empty">暂无消息</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMessageList, getUnreadCount, markAsRead, markAllAsRead, messageTypes } from '../../api/message'

const router = useRouter()
const list = ref([])
const unreadCount = ref(0)
const filterType = ref('')
const filterRead = ref(undefined)

async function loadList() {
  const res = await getMessageList({
    type: filterType.value || undefined,
    isRead: filterRead.value
  })
  list.value = res.data || []
}

async function loadUnread() {
  const res = await getUnreadCount()
  unreadCount.value = res.data || 0
}

function typeLabel(type) {
  const t = messageTypes.find(x => x.value === type)
  return t ? t.label : type
}

function formatTime(str) {
  if (!str) return ''
  const d = new Date(str)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  return sameDay ? d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('zh-CN')
}

async function openMessage(message) {
  if (!message.isRead) {
    await markAsRead(message.id)
    message.isRead = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }
  if (message.link) router.push(message.link)
}

async function markAllRead() {
  await markAllAsRead()
  list.value.forEach(m => { m.isRead = true })
  unreadCount.value = 0
}

onMounted(() => {
  loadList()
  loadUnread()
})
</script>

<style scoped>
.message-center {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h1 { margin: 0; font-size: 20px; }
.actions { display: flex; gap: 10px; align-items: center; }
.unread-tip {
  background: #fff7e6;
  border: 1px solid #ffd591;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.unread-tip strong { color: #d4380d; }
.message-list { list-style: none; padding: 0; margin: 0; }
.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}
.message-item:hover { background: #fafafa; }
.message-item.unread { background: #e6f7ff; }
.message-item.crisis { border-left: 3px solid #ff4d4f; }
.tag { background: #ff4d4f; color: #fff; font-size: 12px; padding: 2px 6px; border-radius: 4px; }
.type { color: #8c8c8c; font-size: 12px; width: 48px; }
.title { flex: 1; }
.time { color: #8c8c8c; font-size: 12px; }
.empty { padding: 40px; text-align: center; color: #8c8c8c; }
</style>
