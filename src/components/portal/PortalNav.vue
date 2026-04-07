<template>
  <header class="portal-header">
    <div class="logo-area" @click="goHome">
      <img src="@/assets/logo.png" alt="校徽" class="logo-img" />
      <span class="title">心理健康服务平台</span>
    </div>

    <nav class="nav-menu">
      <router-link to="/" class="nav-item" :class="{ 'active-nav': route.path === '/' }">首页</router-link>
      <router-link to="/wiki" class="nav-item" active-class="active-nav">心理百科</router-link>
      <router-link to="/articles" class="nav-item" active-class="active-nav">心理美文</router-link>
      <router-link to="/peer-support" class="nav-item" active-class="active-nav">朋辈互助</router-link>
      <router-link to="/notices" class="nav-item" active-class="active-nav">通知公告</router-link>
      <button type="button" class="nav-item nav-btn" :class="{ 'active-nav': isAppointmentActive }" @click="goAppointment">
        在线预约
      </button>
      <router-link
        v-if="hasUserToken"
        :to="messageCenterPath"
        class="nav-item"
        active-class="active-nav"
      >
        消息
      </router-link>
      <router-link
        v-if="isStudent"
        to="/student/dashboard"
        class="nav-item"
        active-class="active-nav"
      >
        学生中心
      </router-link>
      <router-link
        v-if="isParent"
        to="/parent/dashboard"
        class="nav-item"
        :class="{ 'active-nav': isParentAreaActive }"
      >
        家长中心
      </router-link>
    </nav>

    <div class="actions">
      <button class="btn-login" @click="goLogin('admin')">管理登录</button>
      <button v-if="!hasUserToken" class="btn-login" @click="goLogin('user')">学生/家长登录</button>
      <button v-else class="btn-login" @click="logoutUser">退出</button>
      <button class="btn-appoint" @click="goAppointment">在线预约</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const hasUserToken = computed(() => !!localStorage.getItem('User_token'))
const isStudent = computed(() => localStorage.getItem('User_role') === 'student')
const isParent = computed(() => localStorage.getItem('User_role') === 'parent')

const messageCenterPath = computed(() =>
  isParent.value ? '/parent/message' : '/message'
)

const isParentAreaActive = computed(() => route.path.startsWith('/parent'))

const isAppointmentActive = computed(() => {
  const p = route.path
  return (
    p.startsWith('/appointment') ||
    p.startsWith('/my-appointment') ||
    p.startsWith('/parent/appointment')
  )
})

function goHome() {
  router.push('/')
}

function goLogin(type) {
  router.push(type === 'admin' ? '/login/admin' : '/login/user')
}

function goAppointment() {
  const token = localStorage.getItem('User_token')
  const role = localStorage.getItem('User_role')
  if (!token || !role) {
    router.push({ path: '/login/user', query: { redirect: '/appointment/select' } })
  } else {
    router.push('/appointment/select')
  }
}

function logoutUser() {
  localStorage.removeItem('User_token')
  localStorage.removeItem('User_role')
  localStorage.removeItem('User_name')
  localStorage.removeItem('studentId')
  localStorage.removeItem('student_college_id')
  localStorage.removeItem('user_avatar')
  router.push('/')
}
</script>

<style scoped>
.portal-header {
  background: #a51c30;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
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
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.nav-item {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.nav-btn {
  line-height: inherit;
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

@media (max-width: 1100px) {
  .portal-header {
    flex-direction: column;
    padding: 15px;
    gap: 12px;
  }
}
</style>
