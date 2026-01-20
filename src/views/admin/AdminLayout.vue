<template>
  <div class="admin">

    <!-- ===== 顶部 ===== -->
    <header class="top">

      <!-- 左上logo -->
      <div class="left">
        <img class="logo" src="../../assets/images/logo.png" />
        <span>心理健康管理后台</span>
      </div>

      <!-- 右上导航 -->
      <div class="right">
        <span class="nav">基础信息</span>
        <span class="nav">教育管理</span>
        <span class="nav">日常管理</span>
        <span class="nav">心理健康管理</span>
        <span class="nav">资助管理</span>

        <span class="user">
          登录用户：{{ userId }}
        </span>
      </div>
    </header>

    <!-- ===== 主体 ===== -->
    <div class="main">

      <!-- 左侧菜单 -->
<aside class="menu">

  <!-- 所有人可见 -->
  <div class="item" @click="go('time')">
    心理咨询时间规则
  </div>

  <!-- 只有管理员 -->
  <div class="item" 
       v-if="role === 'admin'"
       @click="go('counselor')">
    咨询师档案
  </div>

  <!-- 智能排班：心理中心 + 管理员 -->
  <div class="item" 
       v-if="role === 'center' || role === 'admin'"
       @click="go('schedule')">
    智能排班
  </div>

  <!-- 咨询师 -->
  <div class="item" 
       v-if="role === 'counselor'"
       @click="go('mySchedule')">
    我的排班
  </div>

</aside>


      <!-- 右侧工作区 -->
      <section class="content">
        <h3>欢迎进入管理员工作台</h3>
        <router-view />
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/// ===== 从登录信息读取 =====
const userId = ref(localStorage.getItem('userId'))
const role = ref(localStorage.getItem('role'))

// 跳转
const go = (page) => {
  router.push('/admin/' + page)
}
</script>

const role = ref(localStorage.getItem('role'))






<style scoped>
.admin {
  height: 100vh;
}

/* ===== 顶部 ===== */
.top {
  height: 60px;
  background: #1e4f9c;
  color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.nav {
  margin-right: 15px;
  cursor: pointer;
}

.user {
  margin-left: 20px;
}

/* ===== 主体 ===== */
.main {
  display: flex;
  height: calc(100vh - 60px);
}

/* 左侧菜单 */
.menu {
  width: 220px;
  background: #f0f4fb;
  padding: 10px;
}

.item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.item:hover {
  background: #1e4f9c;
  color: white;
}

/* 右侧 */
.content {
  flex: 1;
  padding: 20px;
}
</style>
