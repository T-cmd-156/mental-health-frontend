<template>
  <div class="peer-support-detail">
    <header class="page-header" :style="{ background: typeGradient }">
      <div class="header-decoration">
        <div class="deco-blob deco-blob-1"></div>
        <div class="deco-blob deco-blob-2"></div>
      </div>
      <div class="header-content">
        <router-link to="/peer-support" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </router-link>
        <div class="header-type" v-if="detail">
          <el-icon><Link /></el-icon>
          {{ detail.type || '朋辈互助' }}
        </div>
      </div>
    </header>

    <div class="page-content">
      <div v-if="loading" class="loading-wrap">
        <div class="loading-spinner">
          <el-icon class="is-loading"><Loading /></el-icon>
        </div>
        <span>正在加载内容...</span>
      </div>

      <template v-else-if="detail">
        <article class="detail-article">
          <div class="article-header">
            <div class="header-tags">
              <span class="type-tag" :style="{ background: typeGradient }">
                <el-icon><component :is="typeIcon" /></el-icon>
                {{ detail.type || '互助服务' }}
              </span>
            </div>
            <h1 class="article-title">{{ detail.title }}</h1>
            <div class="article-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>发布于 {{ detail.date }}</span>
              </div>
              <div class="meta-item">
                <el-icon><View /></el-icon>
                <span>{{ detail.views || 186 }} 次查看</span>
              </div>
            </div>
          </div>

          <div class="article-divider">
            <div class="divider-line"></div>
            <span class="divider-icon" :style="{ background: typeGradient }">
              <el-icon><Link /></el-icon>
            </span>
            <div class="divider-line"></div>
          </div>

          <div class="article-body" v-html="detail.content"></div>

          <div class="article-footer">
            <div class="footer-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>如有疑问，欢迎联系心理中心或心理委员咨询</span>
            </div>
          </div>
        </article>

        <div class="related-actions">
          <h3 class="actions-title">
            <el-icon><Flag /></el-icon>
            相关服务
          </h3>
          <div class="action-cards">
            <router-link to="/appointment/select" class="action-card">
              <div class="action-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="action-info">
                <h4>预约咨询</h4>
                <p>专业心理咨询服务</p>
              </div>
            </router-link>
            <router-link to="/wiki" class="action-card">
              <div class="action-icon" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%)">
                <el-icon><Reading /></el-icon>
              </div>
              <div class="action-info">
                <h4>心理百科</h4>
                <p>探索心理知识</p>
              </div>
            </router-link>
            <router-link to="/articles" class="action-card">
              <div class="action-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)">
                <el-icon><Document /></el-icon>
              </div>
              <div class="action-info">
                <h4>心理美文</h4>
                <p>温暖心灵文字</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <router-link to="/peer-support" class="nav-link" :style="{ background: typeGradient }">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回朋辈互助</span>
          </router-link>
        </div>
      </template>

      <div v-else class="empty-tip">
        <div class="empty-illustration">
          <el-icon class="empty-icon"><Link /></el-icon>
        </div>
        <p class="empty-text">未找到该内容</p>
        <router-link to="/peer-support" class="empty-link">
          <el-icon><ArrowLeft /></el-icon>
          返回朋辈互助列表
        </router-link>
      </div>
    </div>

    <div class="reading-progress" :style="{ width: readingProgress + '%', background: typeGradient }"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPeerDetail } from '@/api/portal'
import { 
  ArrowLeft, Loading, Calendar, View, Link, 
  InfoFilled, Flag, Reading, Document,
  Clock, ChatDotRound, Notebook, Star
} from '@element-plus/icons-vue'

const route = useRoute()
const loading = ref(true)
const detail = ref(null)
const readingProgress = ref(0)

const typeConfig = {
  '心理委员值班': { gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', icon: 'Clock' },
  '朋辈咨询': { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', icon: 'ChatDotRound' },
  '互助知识': { gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', icon: 'Notebook' },
  '经验分享': { gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', icon: 'Star' },
  'default': { gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', icon: 'Link' }
}

const typeGradient = computed(() => {
  if (!detail.value) {
    return typeConfig['default'].gradient
  }
  return typeConfig[detail.value.type]?.gradient || typeConfig['default'].gradient
})

const typeIcon = computed(() => {
  if (!detail.value) {
    return typeConfig['default'].icon
  }
  return typeConfig[detail.value.type]?.icon || typeConfig['default'].icon
})

function fetchDetail() {
  const id = route.params.id
  if (!id) {
    loading.value = false
    return
  }
  loading.value = true
  getPeerDetail(id).then(res => {
    detail.value = res || null
    loading.value = false
  }).catch(() => {
    detail.value = null
    loading.value = false
  })
}

function updateReadingProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => {
  fetchDetail()
  window.addEventListener('scroll', updateReadingProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

watch(() => route.params.id, fetchDetail)
</script>

<style scoped>
.peer-support-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%);
}

.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  z-index: 1000;
  transition: width 0.1s;
}

.page-header {
  position: relative;
  padding: 30px;
  color: white;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.deco-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-blob-1 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: -40px;
}

.deco-blob-2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  left: 10%;
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-4px);
}

.header-type {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.page-content {
  max-width: 900px;
  margin: -20px auto 0;
  padding: 0 24px 60px;
  position: relative;
  z-index: 10;
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.detail-article {
  background: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

.article-header {
  text-align: center;
  margin-bottom: 30px;
}

.header-tags {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}

.meta-item .el-icon {
  color: #ec4899;
}

.article-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 30px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #fce7f3, transparent);
}

.divider-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.article-body {
  font-size: 17px;
  line-height: 2;
  color: #334155;
}

.article-body :deep(p) {
  margin: 0 0 20px 0;
  text-indent: 2em;
}

.article-body :deep(h2),
.article-body :deep(h3) {
  margin: 32px 0 16px;
  color: #1e293b;
  font-weight: 600;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 16px 0;
  padding-left: 2em;
}

.article-body :deep(li) {
  margin: 8px 0;
}

.article-body :deep(strong) {
  color: #be185d;
}

.article-footer {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #fce7f3;
}

.footer-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-radius: 12px;
  font-size: 14px;
  color: #be185d;
}

.footer-tip .el-icon {
  font-size: 20px;
  color: #ec4899;
}

.related-actions {
  margin-top: 40px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

.actions-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions-title .el-icon {
  color: #ec4899;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid #f1f5f9;
}

.action-card:hover {
  background: #fdf2f8;
  border-color: #fbcfe8;
  transform: translateY(-2px);
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.action-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.action-info p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.nav-section {
  margin-top: 30px;
  text-align: center;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 30px;
  color: white;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
}

.nav-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.4);
}

.empty-tip {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

.empty-illustration {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 48px;
  color: #ec4899;
}

.empty-text {
  font-size: 18px;
  color: #334155;
  margin: 0 0 20px 0;
}

.empty-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.empty-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .detail-article {
    padding: 30px 20px;
  }
  
  .article-title {
    font-size: 24px;
  }
  
  .action-cards {
    grid-template-columns: 1fr;
  }
}
</style>
