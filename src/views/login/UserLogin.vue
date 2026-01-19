<template>
  <div class="login-page">
    <div class="box">
      <h2>学生/家长登录</h2>

      <input v-model="form.username" placeholder="学号/手机号" />
      <input v-model="form.password" type="password" placeholder="密码" />

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
  password: ''
})

const login = () => {
  localStorage.setItem('role', 'student')
  router.push('/dashboard')
}
</script>
