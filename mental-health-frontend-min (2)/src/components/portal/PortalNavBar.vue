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
          to="/wiki"
          class="nav-item"
          :class="{ 'active-nav': activeKey === 'wiki' }"
        >
          心理百科
        </router-link>
        <router-link
          to="/articles"
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
      </nav>

      <div class="actions">
        <button type="button" class="btn-login" @click="goLogin('admin')">管理登录</button>
        <button type="button" class="btn-login" @click="goLogin('user')">学生/家长登录</button>
        <button type="button" class="btn-appoint" @click="goAppointment">在线预约</button>
      </div>
    </header>
    <div class="portal-nav-spacer" aria-hidden="true" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  /** home | wiki | articles | peer | notices | appointment */
  activeKey: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function goLogin(type) {
  if (type === 'admin') router.push('/login/admin')
  else router.push('/login/user')
}

function goAppointment() {
  router.push('/appointment/select')
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
