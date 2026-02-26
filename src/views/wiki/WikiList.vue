<template>
  <div class="wiki-list">
    <header class="page-header">
      <h1 class="page-title">四川文理学院 - 心理百科</h1>
      <p class="page-subtitle">探索心理健康知识，了解心理科学</p>
    </header>
    <div class="page-content">
      <!-- 搜索与筛选 -->
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索百科标题、摘要或分类"
          clearable
          class="search-input"
          @input="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="category" placeholder="全部分类" clearable class="category-select" @change="loadList">
          <el-option label="全部分类" value="" />
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
      </div>

      <!-- 专属学习平台链接（需求：提供心理健康基础知识与专属学习平台链接） -->
      <div class="learning-platform">
        <div class="platform-card" @click="openLearningPlatform">
          <span class="platform-icon">📚</span>
          <div class="platform-text">
            <span class="platform-title">心理健康专属学习平台</span>
            <span class="platform-desc">更多课程、视频与自助学习资源，点击进入</span>
          </div>
          <el-icon class="platform-arrow"><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 百科列表 -->
      <div class="wiki-cards">
        <div
          v-for="item in list"
          :key="item.id"
          class="wiki-card"
          @click="goDetail(item.id)"
        >
          <div class="card-top">
            <span class="card-category">{{ item.category }}</span>
            <span class="card-date">{{ item.date }}</span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">{{ item.summary }}</p>
          <span class="card-link">阅读全文 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </div>

      <div v-if="list.length === 0" class="empty-tip">
        <el-icon class="empty-icon"><Document /></el-icon>
        <p>暂无匹配的心理百科内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getWiki } from '@/api/portal'
import { Search, ArrowRight, Document } from '@element-plus/icons-vue'

const router = useRouter()
const keyword = ref('')
const category = ref('')
const list = ref([])
const allList = ref([])

const categories = computed(() => {
  const set = new Set(allList.value.map(item => item.category).filter(Boolean))
  return [...set].sort()
})

function loadList() {
  getWiki({ keyword: keyword.value, category: category.value || undefined }).then(res => {
    list.value = Array.isArray(res) ? res : []
  })
}

function onSearch() {
  loadList()
}

function goDetail(id) {
  router.push(`/wiki/${id}`)
}

function openLearningPlatform() {
  // 可配置为实际学习平台地址
  window.open('https://www.example.com/mental-health-learning', '_blank')
}

onMounted(() => {
  getWiki().then(res => {
    const data = Array.isArray(res) ? res : []
    allList.value = data
    list.value = data
  })
})
</script>

<style scoped>
.wiki-list {
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

.category-select {
  width: 140px;
}

.learning-platform {
  margin-bottom: 28px;
}

.platform-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #e8f4fd 0%, #d4e9f7 100%);
  border: 1px solid #b8daff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.platform-card:hover {
  background: linear-gradient(135deg, #d4e9f7 0%, #b8daff 100%);
  box-shadow: 0 2px 12px rgba(30, 79, 156, 0.15);
}

.platform-icon {
  font-size: 28px;
}

.platform-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.platform-title {
  font-weight: 600;
  color: #1e4f9c;
  font-size: 15px;
}

.platform-desc {
  font-size: 13px;
  color: #666;
}

.platform-arrow {
  color: #1e4f9c;
  font-size: 18px;
}

.wiki-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.wiki-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.wiki-card:hover {
  border-color: #1e4f9c;
  box-shadow: 0 4px 16px rgba(30, 79, 156, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-category {
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

.wiki-card:hover .card-link {
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
