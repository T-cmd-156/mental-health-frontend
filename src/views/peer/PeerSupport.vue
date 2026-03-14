<template>
  <div class="peer-support">
    <header class="page-header">
      <div class="header-decoration">
        <div class="deco-blob deco-blob-1"></div>
        <div class="deco-blob deco-blob-2"></div>
        <div class="deco-blob deco-blob-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">
          <el-icon><Link /></el-icon>
        </div>
        <h1 class="page-title">朋辈互助</h1>
        <p class="page-subtitle">同学之间相互支持，温暖彼此，共同成长</p>
        <div class="header-features">
          <div class="feature-item">
            <el-icon><ChatDotRound /></el-icon>
            <span>倾听陪伴</span>
          </div>
          <div class="feature-item">
            <el-icon><Star /></el-icon>
            <span>经验分享</span>
          </div>
          <div class="feature-item">
            <el-icon><Sunny /></el-icon>
            <span>温暖支持</span>
          </div>
        </div>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar">
        <div class="sidebar-card intro-card">
          <div class="intro-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <h3 class="intro-title">什么是朋辈互助？</h3>
          <p class="intro-text">
            朋辈互助是同龄人之间相互帮助、分享经验的支持方式。通过倾听、理解和陪伴，帮助彼此度过困难时期。
          </p>
        </div>

        <div class="sidebar-card type-card">
          <h3 class="sidebar-title">
            <el-icon><Menu /></el-icon>
            服务类型
          </h3>
          <div class="type-list">
            <div 
              v-for="t in typeStats" 
              :key="t.name"
              class="type-item"
              :class="{ active: type === t.name }"
              :style="{ '--type-color': getTypeColor(t.name) }"
              @click="selectType(t.name)"
            >
              <span class="type-icon" :style="{ background: getTypeColor(t.name) }">
                <el-icon><component :is="getTypeIcon(t.name)" /></el-icon>
              </span>
              <span class="type-name">{{ t.name }}</span>
              <span class="type-count">{{ t.count }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card contact-card">
          <h3 class="sidebar-title">
            <el-icon><Phone /></el-icon>
            快速联系
          </h3>
          <div class="contact-info">
            <p class="contact-text">如需紧急帮助，请联系：</p>
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>心理热线：400-XXX-XXXX</span>
            </div>
            <div class="contact-item">
              <el-icon><Location /></el-icon>
              <span>心理中心：XX楼XXX室</span>
            </div>
          </div>
        </div>
      </aside>

      <div class="content-area">
        <div class="toolbar">
          <div class="toolbar-left">
            <el-input
              v-model="keyword"
              placeholder="搜索标题、摘要..."
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
          <div class="toolbar-right">
            <span class="result-text">共 {{ list.length }} 项</span>
          </div>
        </div>

        <div class="peer-cards">
          <div
            v-for="item in list"
            :key="item.id"
            class="peer-card"
            :style="{ '--card-color': getTypeColor(item.type) }"
            @click="goDetail(item.id)"
          >
            <div class="card-icon-wrap" :style="{ background: getTypeGradient(item.type) }">
              <el-icon class="card-icon"><component :is="getTypeIcon(item.type)" /></el-icon>
            </div>
            <div class="card-body">
              <div class="card-header">
                <span class="card-type" :style="{ color: getTypeColor(item.type), background: getTypeBg(item.type) }">
                  {{ item.type || '互助服务' }}
                </span>
                <span class="card-date">
                  <el-icon><Calendar /></el-icon>
                  {{ item.date }}
                </span>
              </div>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-summary">{{ item.summary }}</p>
              <div class="card-footer">
                <span class="view-detail">
                  查看详情
                  <el-icon><ArrowRight /></el-icon>
                </span>
              </div>
            </div>
            <div class="card-hover-line"></div>
          </div>
        </div>

        <div v-if="list.length === 0" class="empty-tip">
          <div class="empty-illustration">
            <el-icon class="empty-icon"><Link /></el-icon>
          </div>
          <p class="empty-text">暂无匹配的朋辈互助内容</p>
          <p class="empty-hint">换个关键词试试吧</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPeerList } from '@/api/portal'
import { 
  Search, ArrowRight, Document, Link, ChatDotRound, 
  Star, Sunny, UserFilled, Menu, Phone, Location, Calendar,
  Notebook, Clock, Bell, Message
} from '@element-plus/icons-vue'

const router = useRouter()
const keyword = ref('')
const type = ref('')
const list = ref([])
const allList = ref([])

const typeConfig = {
  '心理委员值班': { color: '#ec4899', icon: 'Clock' },
  '朋辈咨询': { color: '#8b5cf6', icon: 'ChatDotRound' },
  '互助知识': { color: '#3b82f6', icon: 'Notebook' },
  '经验分享': { color: '#10b981', icon: 'Star' },
  '志愿服务': { color: '#f59e0b', icon: 'Bell' },
  '话题讨论': { color: '#06b6d4', icon: 'Message' },
  'default': { color: '#ec4899', icon: 'Link' }
}

const types = computed(() => {
  const set = new Set(allList.value.map(item => item.type).filter(Boolean))
  return [...set].sort()
})

const typeStats = computed(() => {
  const map = {}
  allList.value.forEach(item => {
    const t = item.type || '其他'
    map[t] = (map[t] || 0) + 1
  })
  return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})

function getTypeColor(t) {
  return typeConfig[t]?.color || typeConfig['default'].color
}

function getTypeIcon(t) {
  return typeConfig[t]?.icon || typeConfig['default'].icon
}

function getTypeGradient(t) {
  const color = getTypeColor(t)
  return `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
}

function getTypeBg(t) {
  const color = getTypeColor(t)
  return `${color}15`
}

function selectType(t) {
  type.value = type.value === t ? '' : t
  loadList()
}

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
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%);
}

.page-header {
  position: relative;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%);
  color: white;
  padding: 50px 30px 60px;
  text-align: center;
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
  filter: blur(2px);
}

.deco-blob-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -80px;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
}

.deco-blob-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}

.deco-blob-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 20%;
  border-radius: 50%;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 36px;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: 4px;
}

.page-subtitle {
  font-size: 16px;
  margin: 0 0 30px 0;
  opacity: 0.95;
}

.header-features {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  font-size: 14px;
}

.feature-item .el-icon {
  font-size: 18px;
}

.main-layout {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: -30px auto 0;
  padding: 0 24px 40px;
  position: relative;
  z-index: 10;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06);
}

.intro-card {
  text-align: center;
  background: linear-gradient(135deg, white 0%, #fdf2f8 100%);
}

.intro-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
  color: white;
}

.intro-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.intro-text {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-title .el-icon {
  color: #ec4899;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-item:hover {
  background: #fdf2f8;
}

.type-item.active {
  background: color-mix(in srgb, var(--type-color) 10%, white);
}

.type-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.type-name {
  flex: 1;
  font-size: 14px;
  color: #334155;
}

.type-count {
  font-size: 12px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 10px;
  border-radius: 10px;
}

.contact-card {
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border: 1px solid #fbcfe8;
}

.contact-text {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  font-size: 14px;
  color: #be185d;
  border-bottom: 1px dashed #fbcfe8;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item .el-icon {
  color: #ec4899;
  font-size: 18px;
}

.content-area {
  flex: 1;
  min-width: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.toolbar-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.search-input {
  flex: 1;
  max-width: 320px;
}

.type-select {
  width: 140px;
}

.result-text {
  font-size: 14px;
  color: #64748b;
}

.peer-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.peer-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.peer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15);
}

.card-icon-wrap {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 44px;
  color: rgba(255, 255, 255, 0.9);
}

.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-type {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 500;
}

.card-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 auto 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.view-detail {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--card-color);
  font-weight: 500;
}

.peer-card:hover .view-detail {
  text-decoration: underline;
}

.card-hover-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}

.peer-card:hover .card-hover-line {
  transform: scaleX(1);
}

.empty-tip {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
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
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .sidebar-card {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 640px) {
  .page-header {
    padding: 40px 20px 50px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .header-features {
    gap: 12px;
  }
  
  .feature-item {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left {
    flex-direction: column;
  }
  
  .search-input {
    max-width: none;
  }
  
  .peer-cards {
    grid-template-columns: 1fr;
  }
  
  .sidebar-card {
    min-width: 100%;
  }
}
</style>
