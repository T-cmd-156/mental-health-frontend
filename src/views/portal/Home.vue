<template>
  <div class="home">

    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo-area">
        <img class="logo" src="../../assets/images/logo.png" />
        <span class="title">心理健康服务平台</span>
      </div>

      <div class="actions">
        <button class="login" @click="goLogin('admin')">管理者登录</button>
        <button class="login" @click="goLogin('user')">学生/家长登录</button>
        <button class="appoint" @click="goAppointment">在线预约</button>
      </div>
    </header>
    

    <!-- 轮播图 - 活动风采 -->
    <section class="banner">
      <img src="../../assets/images/activity.jpg" alt="活动风采" />
    </section>

    <!-- 主体内容 -->
    <div class="row">



      <!-- 心理百科 -->
      <section class="card">
        <div class="card-title">心理百科</div>
        
        <div v-for="item in wiki" :key="item.id" class="item">
          {{ item.title }}
        </div>
      </section>

      <!-- 心理美文 -->
      <section class="card">
        <div class="card-title">心理美文</div>
        
        <div v-for="item in articles" :key="item.id" class="item">
          {{ item.title }}
        </div>
      </section>

      <section class="card">
        <div class="card-title">朋辈互助</div>
        <div class="item">心理委员值班表</div>
        <div class="item">朋辈咨询预约</div>
        <div class="item">互助知识手册</div>
      </section>

  </div>

<!-- ===== 第二行：通知公告 ===== -->
  <div class="row">
  <section class="card notice">
    <div class="card-title">通知公告</div>
    
    <div v-for="item in notices" :key="item.id" class="item">
      {{ item.title }}
    </div>
  </section>
</div>

</div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'

// 统一从 api 层取
import { getNotices, getWiki, getArticles } from '../../api/portal'

const router = useRouter()

// 声明空数据
const notices = ref([])
const wiki = ref([])
const articles = ref([])

// 页面加载 → 接口
onMounted(async () => {
  notices.value = await getNotices()
  wiki.value = await getWiki()
  articles.value = await getArticles()

})

// 跳转
const goLogin = (type) => {
  router.push(type === 'admin' ? '/login/admin' : '/login/user')
}

const goAppointment = () => {
  router.push('/admin/schedule')
}
</script>

<style>
.home {
  background: #f5f8fc;
}

/* ===== 蓝色头部 ===== */
.header {
  background: #1e4f9c;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

.actions button {
  margin-left: 10px;
}

.login {
  background: white;
  color: #1e4f9c;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
}

.appoint {
  background: #ff9800;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
}

.logo {
  height: 50px;
  margin-right: 10px;
}

/* ===== 两行布局 ===== */
.row {
  display: flex;
  gap: 16px;
  padding: 10px 20px;
}

/* ===== banner ===== */
.banner img {
   width: 100%;
  height: 380px;          
  object-fit: cover;    
  background: #f0f4fb; 
}

/* ===== 内容区 ===== */
.container {
  display: flex;
  gap: 15px;
  padding: 20px;

  flex-wrap: nowrap;  /*禁止换行*/
  width: 100%;
  box-sizing: border-box;
}

.card {
  flex: 1;
  background: white;
  border-radius: 6px;
  
}

/* 通知公告做宽 */
.notice {
  flex: 1;
}

.card-title {
  font-weight: bold;
  color: #1e4f9c;
  margin-bottom: 10px;
  border-left: 4px solid #1e4f9c;
  padding-left: 8px;
}

.item {
  padding: 6px 0;
  border-bottom: 1px dashed #ddd;
}

</style>
