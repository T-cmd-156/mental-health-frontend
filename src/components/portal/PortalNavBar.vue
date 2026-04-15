<template>
  <div class="portal-nav-wrap">
    <header class="portal-nav">
      <div class="logo-area">
        <img src="@/assets/logo.png" alt="校徽" class="logo-img" />
        <span class="title">心理健康服务平台</span>
      </div>

      <nav class="nav-menu">
        <router-link
          to="/"
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'home' }"
        >
          首页
        </router-link>
        <router-link
          :to="wikiNavPath"
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'wiki' }"
        >
          心理百科
        </router-link>
        <router-link
          :to="articlesNavPath"
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'articles' }"
        >
          心理美文
        </router-link>
        <router-link
          to="/student/peer-support"
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'peer' }"
        >
          朋辈互助
        </router-link>
        <router-link
          to="/notices"
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'notices' }"
        >
          通知公告
        </router-link>
        <span
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'appointment' }"
          role="button"
          tabindex="0"
          @click="goAppointmentNav"
          @keydown.enter.prevent="goAppointmentNav"
        >
          在线预约
        </span>
      </nav>

      <div v-if="!endUserSession" class="actions">
        <button type="button" class="btn-login" @click="goLogin('admin')">管理登录</button>
        <button type="button" class="btn-login" @click="goLogin('user')">学生/家长登录</button>
      </div>
      <div v-else class="actions actions-enduser">
        <span class="end-tag">{{ endTagLabel }}</span>
        <router-link :to="endDashboardPath" class="portal-avatar-link" :title="`进入${endTagLabel}`">
          <span class="portal-avatar">{{ avatarInitial }}</span>
        </router-link>
        <span class="end-name">{{ endDisplayName }}</span>
        <button type="button" class="btn-logout-end" @click="logoutEndUser">退出</button>
      </div>
    </header>
    <div class="portal-nav-spacer" aria-hidden="true" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps({
  /** home | wiki | articles | peer | notices | appointment */
  activeKey: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()

/** 学生/家长已登录：仅认 UserLogin 写入的 User_token，避免 access_token/auth_token/anon 残留被当成已登录 */
const endUserSession = computed(() => {
  void route.fullPath
  const r = localStorage.getItem('User_role')
  const t = localStorage.getItem('User_token')
  if (!t || (r !== 'student' && r !== 'parent')) return false
  return true
})

const endTagLabel = computed(() => {
  void route.fullPath
  const r = localStorage.getItem('User_role')
  return r === 'parent' ? '家长端' : '学生端'
})

const endDisplayName = computed(() => {
  void route.fullPath
  return (
    localStorage.getItem('user_name') ||
    localStorage.getItem('User_name') ||
    (localStorage.getItem('User_role') === 'parent' ? '家长' : '同学')
  )
})

const endDashboardPath = computed(() => {
  void route.fullPath
  return localStorage.getItem('User_role') === 'parent'
    ? '/parent/dashboard'
    : '/student/dashboard'
})

const avatarInitial = computed(() => {
  const n = endDisplayName.value.trim()
  return n ? n.slice(0, 1) : '用'
})

/** 已登录学生/家长从门户顶栏进入时，直接进入端内页，避免误进门户页 */
const wikiNavPath = computed(() => {
  void route.fullPath
  if (!localStorage.getItem('User_token')) return '/wiki'
  const r = localStorage.getItem('User_role')
  if (r === 'student') return '/student/wiki'
  if (r === 'parent') return '/parent/wiki'
  return '/wiki'
})
const articlesNavPath = computed(() => {
  void route.fullPath
  if (!localStorage.getItem('User_token')) return '/articles'
  const r = localStorage.getItem('User_role')
  if (r === 'student') return '/student/articles'
  if (r === 'parent') return '/parent/articles'
  return '/articles'
})

function goLogin(type) {
  if (type === 'admin') router.push('/login/admin')
  else router.push('/login/user')
}

function goAppointment() {
  const token = localStorage.getItem('User_token')
  const role = localStorage.getItem('User_role')
  if (!token || (role !== 'student' && role !== 'parent')) {
    router.push({ path: '/login/user', query: { redirect: '/appointment/select' } })
    return
  }
  if (role === 'parent') {
    router.push('/parent/appointment')
  } else {
    router.push('/appointment/select')
  }
}

function goAppointmentNav() {
  goAppointment()
}

function logoutEndUser() {
  try {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('anon_token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('User_token')
    localStorage.removeItem('User_role')
    localStorage.removeItem('User_name')
    localStorage.removeItem('user_name')
  } catch (_) {}
  router.push('/')
}
</script>

<style scoped>
.portal-nav-wrap {
  position: relative;
}

.portal-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #a51c30;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  min-height: 56px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.portal-nav-spacer {
  height: 56px;
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
  border-radius: 4px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-item {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.active-nav {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn-login,
.btn-appoint {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-login {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.25);
}

.btn-appoint {
  background: #c9a227;
  color: white;
  box-shadow: 0 4px 15px rgba(201, 162, 39, 0.4);
}

.btn-appoint:hover {
  transform: translateY(-2px);
  background: #b8921f;
  box-shadow: 0 6px 20px rgba(201, 162, 39, 0.5);
}

.actions-enduser {
  align-items: center;
}

.end-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
}

.end-name {
  font-size: 14px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.portal-avatar-link {
  text-decoration: none;
}

.portal-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #a51c30;
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}

.portal-avatar-link:hover .portal-avatar {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-logout-end {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout-end:hover {
  background: rgba(255, 255, 255, 0.22);
}

@media (max-width: 960px) {
  .portal-nav {
    flex-wrap: wrap;
    padding: 10px 16px;
    gap: 8px;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: flex-start;
  }

  .title {
    font-size: 16px;
  }
}
</style>
