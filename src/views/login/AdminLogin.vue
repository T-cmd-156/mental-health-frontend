<template>
  <div class="login-page">
    <div class="box">
      <h2>管理端登录</h2>

      <input v-model="form.username" placeholder="账号" />
      <input v-model="form.password" type="password" placeholder="密码" />

      <select v-model="form.role">
        <option value="center">心理中心</option>
        <option value="college">二级学院</option>
        <option value="leader">校领导</option>
        <option value="counselor">咨询师</option>
        <option value="instructor">辅导员</option>
      </select>

      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  role: 'center'
})

const login = () => {
  // 之后换成真实接口
  console.log('登录信息', form.value)

  // 模拟登录成功
  localStorage.setItem('role', form.value.role)

  // 跳转不同门户
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  padding-top: 80px;
}

.box {
  width: 360px;
  background: white;
  padding: 20px;
  border-radius: 6px;
}

input, select {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
</style>
