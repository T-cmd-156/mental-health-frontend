<template>
  <div class="notice-list">
    <header class="page-header">
      <h1 class="page-title">四川文理学院 - 通知公告</h1>
      <p class="page-subtitle">及时了解最新通知与活动信息</p>
    </header>
    <div class="page-content">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索公告标题或摘要"
          clearable
          class="search-input"
          @input="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-radio-group v-model="filterTop" class="top-filter" @change="loadList">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button :label="true">置顶</el-radio-button>
        </el-radio-group>
      </div>

      <div class="notice-cards">
        <div
          v-for="item in list"
          :key="item.id"
          class="notice-card"
          @click="goDetail(item.id)"
        >
          <div class="card-top">
            <span v-if="item.isTop" class="card-top-tag">置顶</span>
            <span class="card-date">{{ item.date }}</span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">{{ item.summary }}</p>
          <span class="card-link">查看全文 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </div>

      <div v-if="list.length === 0" class="empty-tip">
        <el-icon class="empty-icon"><Document /></el-icon>
        <p>暂无匹配的通知公告</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNotices } from '@/api/portal'
import { Search, ArrowRight, Document } from '@element-plus/icons-vue'

const router = useRouter()
const keyword = ref('')
const filterTop = ref('')
const list = ref([])

function loadList() {
  const params = { keyword: keyword.value }
  if (filterTop.value === true) params.isTop = true
  getNotices(params).then(res => {
    list.value = Array.isArray(res) ? res : []
  })
}

function onSearch() {
  loadList()
}

function goDetail(id) {
  router.push(`/notices/${id}`)
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.notice-list {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.page-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.top-filter {
  flex-shrink: 0;
}

.notice-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.notice-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.notice-card:hover {
  border-color: #1e4f9c;
  box-shadow: 0 4px 16px rgba(30, 79, 156, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-top-tag {
  font-size: 12px;
  color: #d4380d;
  background: #fff2e8;
  padding: 2px 8px;
  border-radius: 4px;
}

.card-date {
  font-size: 12px;
  color: #999;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.card-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-link {
  font-size: 13px;
  color: #1e4f9c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.notice-card:hover .card-link {
  text-decoration: underline;
}

.empty-tip {
  text-align: center;
  padding: 48px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
</style>
