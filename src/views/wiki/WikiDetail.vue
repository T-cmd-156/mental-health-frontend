<template>
  <div class="wiki-detail">
    <header class="page-header">
      <h1 class="page-title">四川文理学院 - 心理百科</h1>
      <p class="page-subtitle">探索心理健康知识，了解心理科学</p>
    </header>
    <div class="page-content">
      <div v-if="loading" class="loading-wrap">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <template v-else-if="detail">
        <div class="detail-toolbar">
          <router-link to="/wiki" class="back-link">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </router-link>
        </div>
        <article class="detail-article">
          <div class="article-meta">
            <span class="meta-category">{{ detail.category }}</span>
            <span class="meta-date">{{ detail.date }}</span>
          </div>
          <h1 class="article-title">{{ detail.title }}</h1>
          <div class="article-body" v-html="detail.content"></div>
        </article>
      </template>
      <div v-else class="empty-tip">
        <p>未找到该百科内容</p>
        <router-link to="/wiki" class="back-link">返回心理百科列表</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getWikiDetail } from '@/api/portal'
import { ArrowLeft, Loading } from '@element-plus/icons-vue'

const route = useRoute()
const loading = ref(true)
const detail = ref(null)

function fetchDetail() {
  const id = route.params.id
  if (!id) {
    loading.value = false
    return
  }
  loading.value = true
  getWikiDetail(id).then(res => {
    detail.value = res || null
    loading.value = false
  }).catch(() => {
    detail.value = null
    loading.value = false
  })
}

onMounted(fetchDetail)
watch(() => route.params.id, fetchDetail)
</script>

<style scoped>
.wiki-detail {
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

.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: #666;
}

.detail-toolbar {
  margin-bottom: 20px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1e4f9c;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-article {
  max-width: 720px;
  margin: 0 auto;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-category {
  font-size: 12px;
  color: #1e4f9c;
  background: #e8f4fd;
  padding: 2px 8px;
  border-radius: 4px;
}

.meta-date {
  font-size: 13px;
  color: #999;
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
  line-height: 1.4;
}

.article-body {
  font-size: 15px;
  line-height: 1.8;
  color: #444;
}

.article-body :deep(p) {
  margin: 0 0 12px 0;
}

.article-body :deep(strong) {
  color: #333;
}

.empty-tip {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-tip .back-link {
  margin-top: 12px;
  display: inline-flex;
}
</style>
