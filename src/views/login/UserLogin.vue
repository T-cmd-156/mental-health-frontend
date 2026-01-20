<template>
  <div class="login-page">
    <!-- 顶部学校信息 -->
    <div class="school-header">
      <h1 class="school-name">四川文理学院</h1>
      <h2 class="school-english">Sichuan University of Arts and Science</h2>
      <div class="platform-name">心理健康服务</div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="card-header">
        <h3>欢迎使用心理健康服务平台</h3>
        <p class="subtitle">请选择身份登录</p>
      </div>

      <!-- 身份选择 -->
      <div class="identity-select">
        <div 
          class="identity-option"
          :class="{ 'active': identity === 'student' }"
          @click="identity = 'student'"
        >
          <div class="identity-text">
            <div class="identity-title">学生</div>
            <div class="identity-desc">在校学生</div>
          </div>
        </div>
        <div 
          class="identity-option"
          :class="{ 'active': identity === 'parent' }"
          @click="identity = 'parent'"
        >
          <div class="identity-text">
            <div class="identity-title">家长</div>
            <div class="identity-desc">学生家长</div>
          </div>
        </div>
      </div>

      <!-- 登录表单 -->
      <div class="login-form">
        <div class="form-group">
          <label for="username">
            <span v-if="identity === 'student'">学号</span>
            <span v-else>手机号</span>
          </label>
          <input
            id="username"
            v-model="form.username"
            :placeholder="identity === 'student' ? '请输入学号' : '请输入手机号'"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">
            密码
          </label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="form-input"
            />
            <button 
              class="toggle-password"
              @click="showPassword = !showPassword"
              type="button"
            >
              {{ showPassword ? '显示' : '隐藏' }}
            </button>
          </div>
        </div>

        <!-- 登录按钮 -->
        <button 
          class="login-btn"
          @click="login"
          :disabled="!form.username || !form.password"
        >
          登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const identity = ref('student')
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const login = () => {
  if (!form.username || !form.password) {
    alert('请输入账号和密码')
    return
  }

  // 模拟登录逻辑
  console.log('登录信息：', {
    identity: identity.value,
    ...form
  })

  // 保存登录信息到本地存储
  localStorage.setItem('role', identity.value === 'student' ? 'student' : 'parent')
  localStorage.setItem('username', form.username)
  
  // 跳转到仪表盘
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  /* 图片背景 - 请将图片放在public目录下，并更新路径 */
  background-image: url('../../assets/images/background.jpg'); /* 或者使用相对路径: url('./background.jpg') */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 垂直居中 */
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
}



.login-page > * {
  position: relative;
  z-index: 1;
}

.school-header {
  text-align: center;
  color: rgb(21, 20, 71);
  margin-bottom: 30px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.school-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.school-english {
  font-size: 1.2rem;
  font-weight: normal;
  margin-bottom: 15px;
  opacity: 0.95;
}

.platform-name {
  font-size: 1.1rem;
  background: rgba(19, 15, 47, 0.25);
  padding: 8px 20px;
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 10, 108, 0.2);
}

.login-card {
  background: rgb(241, 242, 247);
  border-radius: 15px;
  box-shadow: 0 20px 60px rgb(57, 77, 83);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(23, 14, 114, 0.3);
}

.card-header {
  padding: 30px 30px 20px;
  text-align: center;
  border-bottom: 1px solid #071c3d;
}

.card-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
}

.identity-select {
  display: flex;
  padding: 20px 30px;
  gap: 15px;
  border-bottom: 1px solid #130c4b;
}

.identity-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 2px solid #150c49;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.identity-option:hover {
  border-color: #667eea;
  background: #0d164b;
}

.identity-option.active {
  border-color: #667eea;
  background: #f0f5ff;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.identity-text {
  text-align: center;
}

.identity-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  font-size: 1.1rem;
}

.identity-desc {
  font-size: 0.85rem;
  color: #666;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.password-input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
  color: #666;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.toggle-password:hover {
  background-color: #e9e9e9;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #19134d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .login-page {
    padding: 10px;
  }
  
  .school-name {
    font-size: 2rem;
  }
  
  .school-english {
    font-size: 1rem;
  }
  
  .platform-name {
    font-size: 0.9rem;
  }
  
  .login-card {
    border-radius: 10px;
  }
  
  .card-header,
  .identity-select,
  .login-form {
    padding: 20px;
  }
  
  .identity-select {
    flex-direction: column;
  }
}

/* 如果图片加载失败，使用渐变背景作为回退 */
@supports not (background-image: url('/background.jpg')) {
  .login-page {
    background: linear-gradient(135deg, #374aa1ff 0%, #0f0b37 100%);
  }
  
  .login-page::before {
    display: none;
  }
}
</style>