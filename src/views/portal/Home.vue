<template>
  <div class="home">

    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo-area">
        <img class="logo" src="../../assets/images/logo.png" />
        <span class="title">心理健康服务平台</span>
      </div>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/#activities" class="nav-item">活动风采</router-link>
        <router-link to="/wiki" class="nav-item">心理百科</router-link>
        <router-link to="/articles" class="nav-item">心理美文</router-link>
        <router-link to="/peer-support" class="nav-item">朋辈互助</router-link>
        <router-link to="/notices" class="nav-item">通知公告</router-link>
      </nav>

      <div class="actions">
        <router-link v-if="isLoggedIn" to="/message" class="message-link" title="消息中心">
          消息 <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
        </router-link>
        <button class="login" @click="goLogin('admin')">管理者登录</button>
        <button class="login" @click="goLogin('user')">学生/家长登录</button>
        <button class="appoint" @click="goAppointment">在线预约</button>
        <router-link v-if="isStudent" to="/student/dashboard" class="login">学生工作台</router-link>
      </div>
    </header>
    

    <!-- 轮播图 - 活动风采 -->
    <section class="banner">
      <div class="banner-content">
        <h2 class="banner-title">关注心理健康 共创美好未来</h2>
        <p class="banner-subtitle">提供专业的心理健康服务与支持</p>
      </div>
      <img src="../../assets/images/activity.jpg" alt="活动风采" />
    </section>

    <!-- 主体内容 -->
      <main class="main-content">
      <!-- 活动风采 -->
      <div class="content-row" id="activities">
        <section class="card activity-card">
          <div class="card-header">
            <h3 class="card-title">活动风采</h3>
            <span class="card-more">校/院级心理活动</span>
          </div>
          <div class="card-body">
            <div v-for="item in activities" :key="item.id" class="item">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
          </div>
        </section>
      </div>
      <!-- 第一行：心理百科、心理美文、朋辈互助 -->
      <div class="content-row">


      <!-- 心理百科 -->
        <section class="card">
          <div class="card-header">
            <h3 class="card-title">心理百科</h3>
            <router-link to="/wiki" class="card-more">更多 ></router-link>
          </div>
          <div class="card-body">
            <div v-for="item in wiki" :key="item.id" class="item" @click="goDetail('wiki', item.id)">
              <span class="item-title">{{ item.title }}</span>
            </div>
          </div>
        </section>

      <!-- 心理美文 -->
              <section class="card">
          <div class="card-header">
            <h3 class="card-title">心理美文</h3>
            <router-link to="/articles" class="card-more">更多 ></router-link>
          </div>
          <div class="card-body">
            <div v-for="item in articles" :key="item.id" class="item" @click="goDetail('article', item.id)">
              <span class="item-title">{{ item.title }}</span>
            </div>
          </div>
        </section>


        <section class="card">
          <div class="card-header">
            <h3 class="card-title">朋辈互助</h3>
            <router-link to="/peer-support" class="card-more">更多 ></router-link>
          </div>
          <div class="card-body">
            <div class="item" @click="goDetail('peer', 1)">
              <span class="item-title">心理委员值班表</span>
            </div>
            <div class="item" @click="goDetail('peer', 2)">
              <span class="item-title">朋辈咨询预约</span>
            </div>
            <div class="item" @click="goDetail('peer', 3)">
              <span class="item-title">互助知识手册</span>
            </div>
          </div>
        </section>
      </div>

<!-- ===== 第二行：通知公告 ===== -->
      <div class="content-row">
        <section class="card notice-card">
          <div class="card-header">
            <h3 class="card-title">通知公告</h3>
            <router-link to="/notices" class="card-more">更多 ></router-link>
          </div>
          <div class="card-body">
            <div v-for="item in notices" :key="item.id" class="notice-item" @click="goDetail('notice', item.id)">
              <span class="notice-dot">●</span>
              <span class="notice-title">{{ item.title }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getNotices, getWiki, getArticles, getActivities } from '../../api/portal'
import { getUnreadCount } from '../../api/message'

const router = useRouter()
const unreadCount = ref(0)
const isLoggedIn = computed(() => {
  return !!(localStorage.getItem('User_token') || localStorage.getItem('admin_token'))
})
const isStudent = computed(() => {
  return localStorage.getItem('User_role') === 'student' || localStorage.getItem('User_token')
})
// 声明空数据
const notices = ref([])
const wiki = ref([])
const articles = ref([])
const activities = ref([])

onMounted(async () => {
  notices.value = await getNotices()
  wiki.value = await getWiki()
  articles.value = await getArticles()
  activities.value = await getActivities()
  if (isLoggedIn.value) {
    try {
      const res = await getUnreadCount()
      unreadCount.value = res.data || 0
    } catch (_) {}
  }
})


// 跳转
const goLogin = (type) => {
  router.push(type === 'admin' ? '/login/admin' : '/login/user')
}

// 学生预约前先登录
const goAppointment = () => {

  const token = localStorage.getItem('User_token')
  const role = localStorage.getItem('User_role')

  // 检查是否有 token 和 role
  if (!token || !role) {
    // 如果没有登录，跳转到登录页面
    router.push({
      path: '/login/user',
      query: { redirect: '/appointment/select' }
    })  // 根据需要跳转到用户登录页面
  } else {
    // 已登录，跳转到预约页面
    router.push('/appointment/select')
  }
}
// 详情页面跳转
const goDetail = (type, id) => {
  const pathMap = { wiki: '/wiki', article: '/articles', peer: '/peer-support', notice: '/notices' }
  const base = pathMap[type]
  if (base) router.push(id ? `${base}/${id}` : base)
}
</script>

<style>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* ===== 顶部导航 ===== */
.header {
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-area {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  margin-right: 15px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.title {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login {
  background: white;
  color: #1e4f9c;
}

.login:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.appoint {
  background: #ff9800;
  color: white;
}

.appoint:hover {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}
.message-link {
  color: white;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.message-link:hover { background: rgba(255,255,255,0.2); }
.unread-badge {
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* ===== 轮播图 ===== */
.banner {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.banner:hover img {
  transform: scale(1.05);
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  animation: fadeInUp 1s ease;
}

.banner-subtitle {
  font-size: 18px;
  animation: fadeInUp 1s ease 0.3s both;
}

/* ===== 主体内容 ===== */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.content-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

/* ===== 卡片样式 ===== */
.card {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.card-more {
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.card-more:hover {
  color: #ffd700;
}

.card-body {
  padding: 20px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.item:last-child {
  border-bottom: none;
}

.item:hover {
  background: #f8f9fa;
  padding-left: 10px;
}

.item-title {
  font-size: 14px;
  color: #333;
}

/* ===== 通知公告 ===== */
.notice-card {
  flex: 1;
}

.notice-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item:hover {
  background: #f8f9fa;
  padding-left: 10px;
}

.notice-dot {
  color: #1e4f9c;
  font-size: 10px;
  margin-right: 10px;
}

.notice-title {
  font-size: 14px;
  color: #333;
}
.activity-card { flex: 1; }
.item-date { font-size: 12px; color: #8c8c8c; }

/* ===== 动画 ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 响应式设计 ===== */
@media (max-width: 1200px) {
  .content-row {
    flex-direction: column;
  }
  
  .card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 15px;
    gap: 15px;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .banner-title {
    font-size: 24px;
  }
  
  .banner-subtitle {
    font-size: 14px;
  }
}

</style>
