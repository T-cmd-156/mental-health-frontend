<template>
  <div class="home">
    <PortalNavBar active-key="home" />

    <section class="hero-banner">
      <div class="hero-content">
        <div class="hero-badge">四川文理学院</div>
        <h1 class="hero-title">关注心理健康</h1>
        <h2 class="hero-subtitle">共创美好未来</h2>
        <p class="hero-desc">提供专业的心理健康服务与支持，守护每一位学子的心灵成长</p>
        <div class="hero-actions">
          <button class="hero-btn primary" @click="goAppointment">立即预约咨询</button>
          <router-link to="/wiki" class="hero-btn secondary">探索心理百科</router-link>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-number">{{ wiki.length || 50 }}+</span>
          <span class="stat-label">知识文章</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ activities.length || 20 }}+</span>
          <span class="stat-label">心理活动</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">24h</span>
          <span class="stat-label">在线服务</span>
        </div>
      </div>
    </section>

    <main class="main-content">
      <section class="quick-services">
        <div class="service-card" @click="goAppointment">
          <div class="service-icon purple">📅</div>
          <h4>预约咨询</h4>
          <p>专业心理咨询师一对一服务</p>
        </div>
        <router-link to="/wiki" class="service-card">
          <div class="service-icon green">📚</div>
          <h4>心理百科</h4>
          <p>丰富的心理健康知识库</p>
        </router-link>
        <router-link to="/articles" class="service-card">
          <div class="service-icon orange">📝</div>
          <h4>心理美文</h4>
          <p>温暖治愈的心灵文字</p>
        </router-link>
        <router-link to="/student/peer-support" class="service-card">
          <div class="service-icon pink">🤝</div>
          <h4>朋辈互助</h4>
          <p>同学间的温暖支持</p>
        </router-link>
      </section>

      <div class="content-grid">
        <section class="content-card">
          <div class="card-header orange">
            <h3>🎯 活动风采</h3>
            <span class="header-badge">校/院级心理活动</span>
          </div>
          <div class="card-body">
            <div v-for="item in activities.slice(0, 5)" :key="item.id" class="activity-item">
              <span class="activity-dot"></span>
              <span class="activity-title">{{ item.title }}</span>
              <span class="activity-date">{{ item.date }}</span>
            </div>
            <div v-if="activities.length === 0" class="empty-hint">暂无活动</div>
          </div>
        </section>

        <section class="content-card">
          <div class="card-header green">
            <h3>📖 心理百科</h3>
            <router-link to="/wiki" class="header-more">更多 →</router-link>
          </div>
          <div class="card-body">
            <div v-for="item in wiki.slice(0, 5)" :key="item.id" class="list-item" @click="goDetail('wiki', item.id)">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-arrow">→</span>
            </div>
            <div v-if="wiki.length === 0" class="empty-hint">暂无内容</div>
          </div>
        </section>

        <section class="content-card">
          <div class="card-header purple">
            <h3>✨ 心理美文</h3>
            <router-link to="/articles" class="header-more">更多 →</router-link>
          </div>
          <div class="card-body">
            <div v-for="item in articles.slice(0, 5)" :key="item.id" class="list-item" @click="goDetail('article', item.id)">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-arrow">→</span>
            </div>
            <div v-if="articles.length === 0" class="empty-hint">暂无内容</div>
          </div>
        </section>

        <section class="content-card">
          <div class="card-header pink">
            <h3>💝 朋辈互助</h3>
            <router-link to="/student/peer-support" class="header-more">更多 →</router-link>
          </div>
          <div class="card-body">
            <div class="peer-link" @click="goDetail('peer', 1)">
              <span class="peer-icon">🕐</span>
              <span>心理委员值班表</span>
            </div>
            <div class="peer-link" @click="goDetail('peer', 2)">
              <span class="peer-icon">💬</span>
              <span>朋辈咨询预约</span>
            </div>
            <div class="peer-link" @click="goDetail('peer', 3)">
              <span class="peer-icon">📋</span>
              <span>互助知识手册</span>
            </div>
          </div>
        </section>
      </div>

      <section class="notice-section">
        <div class="notice-header">
          <h3>📢 通知公告</h3>
          <router-link to="/notices" class="notice-more">查看全部 →</router-link>
        </div>
        <div class="notice-list">
          <div
            v-for="item in notices.slice(0, 6)"
            :key="item.id"
            class="notice-item"
            @click="goDetail('notice', item.id)"
          >
            <span v-if="item.isTop" class="notice-top">置顶</span>
            <span v-else class="notice-dot"></span>
            <span class="notice-text">{{ item.title }}</span>
            <span class="notice-date">{{ item.date }}</span>
          </div>
          <div v-if="notices.length === 0" class="empty-hint">暂无公告</div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo-area">
            <img src="@/assets/logo.png" alt="校徽" class="footer-logo" />
            <h4>四川文理学院心理健康服务平台</h4>
          </div>
          <p>关爱心理健康，守护美好未来</p>
        </div>
        <div class="footer-links">
          <router-link to="/wiki">心理百科</router-link>
          <router-link to="/articles">心理美文</router-link>
          <router-link to="/student/peer-support">朋辈互助</router-link>
          <router-link to="/notices">通知公告</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 四川文理学院心理健康中心 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PortalNavBar from '@/components/portal/PortalNavBar.vue'
import { getNotices, getWiki, getArticles, getActivities } from '../../api/portal'

const router = useRouter()

const notices = ref([])
const wiki = ref([])
const articles = ref([])
const activities = ref([])

onMounted(async () => {
  try {
    notices.value = await getNotices()
    wiki.value = await getWiki()
    articles.value = await getArticles()
    activities.value = await getActivities()
  } catch (e) {
    console.error('加载数据失败', e)
  }
})

const goAppointment = () => {
  const token = localStorage.getItem('User_token')
  const role = localStorage.getItem('User_role')
  if (!token || !role) {
    router.push({ path: '/login/user', query: { redirect: '/appointment/select' } })
  } else {
    router.push('/appointment/select')
  }
}

const goDetail = (type, id) => {
  const pathMap = { wiki: '/wiki', article: '/articles', peer: '/student/peer-support', notice: '/notices' }
  const base = pathMap[type]
  if (base) router.push(id ? `${base}/${id}` : base)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero-banner {
  background: url('/hero-bg.jpg') center/cover no-repeat;
  padding: 100px 40px;
  text-align: center;
  color: #333;
  position: relative;
  overflow: hidden;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.75);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, #a51c30, #c94a5a);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 8px;
  color: #1a1a2e;
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 600;
  color: #a51c30;
  margin: 0 0 20px;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hero-btn.primary {
  background: linear-gradient(135deg, #a51c30, #c94a5a);
  color: white;
  box-shadow: 0 8px 24px rgba(165, 28, 48, 0.35);
}

.hero-btn.secondary {
  background: white;
  color: #a51c30;
  border: 2px solid #a51c30;
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 24px;
  margin-top: 48px;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-card {
  background: white;
  padding: 20px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #a51c30;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.main-content {
  max-width: 1200px;
  margin: -40px auto 0;
  padding: 0 24px 60px;
  position: relative;
  z-index: 2;
}

.quick-services {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.service-card {
  background: white;
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(165, 28, 48, 0.12);
}

.service-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 14px;
}

.service-icon.purple {
  background: linear-gradient(135deg, #e9d5ff, #f3e8ff);
}
.service-icon.green {
  background: linear-gradient(135deg, #d1fae5, #ecfdf5);
}
.service-icon.orange {
  background: linear-gradient(135deg, #ffedd5, #fff7ed);
}
.service-icon.pink {
  background: linear-gradient(135deg, #fce7f3, #fdf2f8);
}

.service-card h4 {
  margin: 0 0 8px;
  font-size: 17px;
  color: #1e293b;
}

.service-card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.content-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.card-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.card-header.orange {
  background: linear-gradient(135deg, #ea580c, #f97316);
}
.card-header.green {
  background: linear-gradient(135deg, #059669, #10b981);
}
.card-header.purple {
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
}
.card-header.pink {
  background: linear-gradient(135deg, #db2777, #ec4899);
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.header-badge {
  font-size: 12px;
  opacity: 0.95;
}

.header-more {
  color: white;
  text-decoration: none;
  font-size: 13px;
  opacity: 0.95;
}

.card-body {
  padding: 16px 20px;
  min-height: 200px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: #fafafa;
}

.item-title {
  flex: 1;
  font-size: 14px;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-arrow {
  color: #94a3b8;
  margin-left: 8px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  flex-shrink: 0;
}

.activity-title {
  flex: 1;
  color: #334155;
}

.activity-date {
  font-size: 12px;
  color: #94a3b8;
}

.peer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #334155;
}

.peer-link:hover {
  background: #fdf2f8;
}

.peer-icon {
  font-size: 20px;
}

.empty-hint {
  text-align: center;
  color: #94a3b8;
  padding: 24px;
  font-size: 14px;
}

.notice-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.notice-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
}

.notice-more {
  color: #a51c30;
  text-decoration: none;
  font-size: 14px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.notice-item:hover {
  background: #f8fafc;
}

.notice-top {
  flex-shrink: 0;
  background: #fef3c7;
  color: #b45309;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 14px;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-date {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.site-footer {
  background: #1e293b;
  color: #94a3b8;
  padding: 40px 24px 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
}

.footer-logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  height: 44px;
  border-radius: 6px;
}

.footer-info h4 {
  margin: 0 0 8px;
  color: white;
  font-size: 16px;
}

.footer-info p {
  margin: 0;
  font-size: 13px;
}

.footer-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  max-width: 1200px;
  margin: 24px auto 0;
  padding-top: 20px;
  border-top: 1px solid #334155;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .quick-services {
    grid-template-columns: repeat(2, 1fr);
  }
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 28px;
  }
  .quick-services {
    grid-template-columns: 1fr;
  }
  .hero-stats {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
