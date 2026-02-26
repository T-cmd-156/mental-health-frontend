<template>
  <div class="login-page">
    <div class="box">
      <h2>咨询师登录</h2>
      <p class="hint">使用账号密码登录，或使用开发者快捷登录查看功能。</p>
      <input v-model="form.username" placeholder="账号" />
      <input v-model="form.password" type="password" placeholder="密码" />
      <button @click="login">登录</button>
      <div class="dev-tip">
        <span class="dev-label">开发者</span>
        <button type="button" class="dev-btn" @click="devLogin">快捷登录（dev_counselor / dev123）</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '../../api/mock'

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const devLogin = () => {
  form.value.username = 'dev_counselor'
  form.value.password = 'dev123'
  login()
}

const login = async () => {
  if (!form.value.username || !form.value.password) {
    alert('请输入账号和密码')
    return
  }
  try {
    const res = await adminLogin({
      username: form.value.username,
      password: form.value.password,
      role: 'counselor'
    })
    const user = res.data
    if (!user) {
      alert('账号或密码错误')
      return
    }
    localStorage.setItem('user_id', user.id)
    localStorage.setItem('user_token', user.username)
    localStorage.setItem('user_role', user.role)
    localStorage.setItem('user_name', user.name)
    localStorage.setItem('admin_token', user.role + Date.now())
    localStorage.setItem('admin_role', user.role)
    alert('登录成功')
    router.push('/admin')
  } catch (err) {
    alert(err.message || '登录失败')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
}

.box {
  width: 380px;
  background: white;
  padding: 25px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.box h2 {
  text-align: center;
  color: white;
  background: #1a365d;
  padding: 15px;
  margin: -25px -20px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
}

.hint {
  font-size: 12px;
  color: #666;
  margin: -8px 0 12px 0;
}

input {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #1a365d;
}

button {
  width: 100%;
  padding: 10px;
  background: #1a365d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #2c5282;
}

.dev-tip {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
  text-align: center;
}

.dev-label {
  font-size: 12px;
  color: #999;
  margin-right: 8px;
}

.dev-btn {
  width: auto !important;
  padding: 6px 12px !important;
  margin-top: 0 !important;
  font-size: 12px !important;
  background: #6b7280 !important;
  color: white !important;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dev-btn:hover {
  background: #4b5563 !important;
}
</style>
