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

        <!-- 底部链接 -->
        <div class="form-footer">
          <button 
            class="footer-link forgot-password-btn"
            @click="showForgotPasswordModal = true"
          >
            忘记密码？
          </button>
          <button 
            class="footer-link register-btn"
            @click="showRegisterModal = true"
          >
            立即注册
          </button>
        </div>


      </div>
    </div>

    <!-- 忘记密码弹窗 -->
    <div v-if="showForgotPasswordModal" class="modal-overlay" @click.self="showForgotPasswordModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>忘记密码</h3>
          <button class="close-btn" @click="showForgotPasswordModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="forgot-username">
              <span v-if="identity === 'student'">学号</span>
              <span v-else>手机号</span>
            </label>
            <input
              id="forgot-username"
              v-model="forgotPasswordForm.username"
              :placeholder="identity === 'student' ? '请输入学号' : '请输入手机号'"
              type="text"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="forgot-email">邮箱</label>
            <input
              id="forgot-email"
              v-model="forgotPasswordForm.email"
              placeholder="请输入注册时的邮箱"
              type="email"
              class="form-input"
            />
          </div>
          <button 
            class="submit-btn"
            @click="submitForgotPassword"
            :disabled="!forgotPasswordForm.username || !forgotPasswordForm.email"
          >
            提交验证
          </button>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegisterModal" class="modal-overlay" @click.self="showRegisterModal = false">
      <div class="modal-content register-modal">
        <div class="modal-header">
          <h3>用户注册</h3>
          <button class="close-btn" @click="showRegisterModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label for="register-realname">真实姓名 <span class="required">*</span></label>
              <input
                id="register-realname"
                v-model="registerForm.real_name"
                placeholder="请输入真实姓名"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="register-gender">性别 <span class="required">*</span></label>
              <select
                id="register-gender"
                v-model="registerForm.gender"
                class="form-input select-input"
              >
                <option value="">请选择性别</option>
                <option value="0">女</option>
                <option value="1">男</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="register-username">
              <span v-if="identity === 'student'">学号 <span class="required">*</span></span>
              <span v-else>手机号 <span class="required">*</span></span>
            </label>
            <input
              id="register-username"
              v-model="registerForm.username"
              :placeholder="identity === 'student' ? '请输入学号' : '请输入手机号'"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="register-mobile">手机号码 <span class="required">*</span></label>
            <input
              id="register-mobile"
              v-model="registerForm.mobile"
              placeholder="请输入手机号码"
              type="tel"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="register-email">邮箱 <span class="required">*</span></label>
            <input
              id="register-email"
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              type="email"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="register-password">密码 <span class="required">*</span></label>
              <input
                id="register-password"
                v-model="registerForm.password"
                :type="showRegisterPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="register-confirm-password">确认密码 <span class="required">*</span></label>
              <input
                id="register-confirm-password"
                v-model="registerForm.confirm_password"
                :type="showRegisterPassword ? 'text' : 'password'"
                placeholder="请再次输入密码"
                class="form-input"
              />
            </div>
          </div>

          <div class="password-toggle">
            <label class="checkbox-label">
              <input type="checkbox" v-model="showRegisterPassword" />
              <span class="checkmark"></span>
              显示密码
            </label>
          </div>

          <button 
            class="submit-btn register-submit-btn"
            @click="submitRegister"
            :disabled="!isRegisterFormValid"
          >
            注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const identity = ref('student')
const showPassword = ref(false)
const showForgotPasswordModal = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const forgotPasswordForm = reactive({
  username: '',
  email: ''
})

const submitForgotPassword = () => {
  if (!forgotPasswordForm.username || !forgotPasswordForm.email) {
    alert('请输入学号/手机号和邮箱')
    return
  }

  console.log('忘记密码验证信息：', {
    identity: identity.value,
    ...forgotPasswordForm
  })

  alert('验证信息已提交，我们将通过邮件发送重置密码链接')
  showForgotPasswordModal.value = false
  
  // 清空表单
  forgotPasswordForm.username = ''
  forgotPasswordForm.email = ''
}

const showRegisterModal = ref(false)
const showRegisterPassword = ref(false)

const registerForm = reactive({
  real_name: '',
  gender: '',
  username: '',
  mobile: '',
  email: '',
  password: '',
  confirm_password: ''
})

const isRegisterFormValid = computed(() => {
  return registerForm.real_name && 
         registerForm.gender !== '' && 
         registerForm.username && 
         registerForm.mobile && 
         registerForm.email && 
         registerForm.password && 
         registerForm.confirm_password &&
         registerForm.password === registerForm.confirm_password
})

const validateMobile = (mobile) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(mobile)
}

const validateEmail = (email) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return reg.test(email)
}

const submitRegister = () => {
  if (!registerForm.real_name) {
    alert('请输入真实姓名')
    return
  }

  if (registerForm.gender === '') {
    alert('请选择性别')
    return
  }

  if (!registerForm.username) {
    alert(`请输入${identity.value === 'student' ? '学号' : '手机号'}`)
    return
  }

  if (!registerForm.mobile) {
    alert('请输入手机号码')
    return
  }

  if (!validateMobile(registerForm.mobile)) {
    alert('请输入正确的手机号码')
    return
  }

  if (!registerForm.email) {
    alert('请输入邮箱地址')
    return
  }

  if (!validateEmail(registerForm.email)) {
    alert('请输入正确的邮箱地址')
    return
  }

  if (!registerForm.password) {
    alert('请输入密码')
    return
  }

  if (registerForm.password.length < 6) {
    alert('密码长度至少为6位')
    return
  }

  if (registerForm.password !== registerForm.confirm_password) {
    alert('两次输入的密码不一致')
    return
  }

  const registerData = {
    role: identity.value === 'student' ? 'student' : 'parent',
    real_name: registerForm.real_name,
    gender: parseInt(registerForm.gender),
    username: registerForm.username,
    mobile: registerForm.mobile,
    email: registerForm.email,
    password: registerForm.password
  }

  console.log('注册信息：', registerData)

  // 将注册信息存储到localStorage
  let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  users.push(registerData)
  localStorage.setItem('registeredUsers', JSON.stringify(users))

  alert('注册成功！请登录')
  showRegisterModal.value = false
  
  // 清空表单
  registerForm.real_name = ''
  registerForm.gender = ''
  registerForm.username = ''
  registerForm.mobile = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirm_password = ''
  showRegisterPassword.value = false
}

// 测试账号
const TEST_ACCOUNTS = {
  student: {
    username: 'student',
    password: '123456',
  },
  parent: {
    username: '13800138001',
    password: '123456',
  }
}

const login = () => {
  if (!form.username || !form.password) {
    alert('请输入账号和密码')
    return
  }

  // 检查测试账号
  const testAccount = TEST_ACCOUNTS[identity.value]
  if (form.username === testAccount.username && form.password === testAccount.password) {
    // 模拟登录逻辑
    console.log('测试账号登录信息：', {
      identity: identity.value,
      ...form
    })

    // 保存登录信息到本地存储
    localStorage.setItem('student_id', testAccount.username)
    localStorage.setItem('User_token', 'student_' + Date.now())
    localStorage.setItem('User_role', identity.value)

    const redirectPath = router.currentRoute.value.query.redirect || (identity.value === 'parent' ? '/parent/dashboard' : '/student/dashboard')
    router.push(redirectPath)
    return
  }

  // 检查用户是否已注册
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  const user = users.find(u => u.username === form.username && u.role === (identity.value === 'student' ? 'student' : 'parent'))

  if (!user) {
    alert('账号未注册，请先注册')
    return
  }

  // 检查密码是否正确
  if (user.password !== form.password) {
    alert('密码错误')
    return
  }

  // 模拟登录逻辑
  console.log('登录信息：', {
    identity: identity.value,
    ...form
  })

  // 保存登录信息到本地存储
  const sid = user.username
  localStorage.setItem('student_id', sid)
  localStorage.setItem('User_token', 'student_' + Date.now())
  localStorage.setItem('User_role', identity.value)

  const redirectPath = router.currentRoute.value.query.redirect || (identity.value === 'parent' ? '/parent/dashboard' : '/student/dashboard')
  router.push(redirectPath)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  /* 图片背景 - 请将图片放在public目录下，并更新路径 */
  background-image: url('/background.jpg'); /* 或者使用相对路径: url('./background.jpg') */
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

.forgot-password {
  text-align: right;
  margin-top: 10px;
}

.forgot-password-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 0;
}

.forgot-password-btn:hover {
  color: #5568d3;
  text-decoration: underline;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 25px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 表单底部链接 */
.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.footer-link {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 0;
  transition: color 0.3s ease;
}

.forgot-password-btn {
  color: #667eea;
}

.forgot-password-btn:hover {
  color: #5568d3;
  text-decoration: underline;
}

.register-btn {
  color: #28a745;
}

.register-btn:hover {
  color: #218838;
  text-decoration: underline;
}

/* 注册弹窗样式 */
.register-modal {
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.required {
  color: #dc3545;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.password-toggle {
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.register-submit-btn {
  margin-top: 20px;
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

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .register-modal {
    max-width: 95%;
    margin: 10px;
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