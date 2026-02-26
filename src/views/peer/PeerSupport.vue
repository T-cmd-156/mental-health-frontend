<template>
  <div class="peer-support">
    <header class="page-header">
      <h1 class="page-title">四川文理学院 - 朋辈互助</h1>
      <p class="page-subtitle">同学之间相互支持，共同成长</p>
    </header>
    <div class="page-content">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索标题、摘要或类型"
          clearable
          class="search-input"
          @input="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="type" placeholder="全部类型" clearable class="type-select" @change="loadList">
          <el-option label="全部类型" value="" />
          <el-option v-for="t in types" :key="t" :label="t" :value="t" />
        </el-select>
      </div>

      <div class="peer-cards">
        <div
          v-for="item in list"
          :key="item.id"
          class="peer-card"
          @click="goDetail(item.id)"
        >
          <div class="card-top">
            <span class="card-type">{{ item.type }}</span>
            <span class="card-date">{{ item.date }}</span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">{{ item.summary }}</p>
          <span class="card-link">查看详情 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </div>

      <div v-if="list.length === 0" class="empty-tip">
        <el-icon class="empty-icon"><Document /></el-icon>
        <p>暂无匹配的朋辈互助内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPeerList } from '@/api/portal'
import { Search, ArrowRight, Document } from '@element-plus/icons-vue'

const router = useRouter()
const keyword = ref('')
const type = ref('')
const list = ref([])
const allList = ref([])

const types = computed(() => {
  const set = new Set(allList.value.map(item => item.type).filter(Boolean))
  return [...set].sort()
})

function loadList() {
  getPeerList({ keyword: keyword.value, type: type.value || undefined }).then(res => {
    list.value = Array.isArray(res) ? res : []
  })
}

function onSearch() {
  loadList()
}

function goDetail(id) {
  router.push(`/peer-support/${id}`)
}

onMounted(() => {
  getPeerList().then(res => {
    const data = Array.isArray(res) ? res : []
    allList.value = data
    list.value = data
  })
})
</script>

<style scoped>
.peer-support {
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
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.type-select {
  width: 140px;
}

.peer-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.peer-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.peer-card:hover {
  border-color: #1e4f9c;
  box-shadow: 0 4px 16px rgba(30, 79, 156, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-type {
  font-size: 12px;
  color: #1e4f9c;
  background: #e8f4fd;
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

.peer-card:hover .card-link {
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
