<template>
  <div class="login-page">
    <div class="box">
      <h2>四川文理学院 · 管理端登录</h2>

      <input v-model="form.username" placeholder="请输入账号" />
      <input v-model="form.password" type="password" placeholder="请输入密码" />

      <select v-model="form.role">
        <option value="center">心理中心</option>
        <option value="college">二级学院</option>
        <option value="leader">校领导</option>
        <option value="counselor">咨询师</option>
        <option value="instructor">辅导员</option>
      </select>

      <button @click="login">登录</button>
      
      <div class="footer">
        <p>© 四川文理学院心理健康服务平台</p>
      </div>
    </div>
    
    <!-- 左右导航按钮 -->
    <div class="nav-buttons">
      <button class="nav-btn prev-btn">‹</button>
      <button class="nav-btn next-btn">›</button>
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
  try {
    // 之后换成真实接口
    console.log('登录信息', form.value)

    // 模拟登录成功
    localStorage.setItem('role', form.value.role)

    // 补一个 token
    localStorage.setItem('token', 'admin_token_' + Date.now())
    alert('登录成功')

    router.push('/admin')
  } catch (err) {
    alert(err.msg || '登录失败')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/albackground.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.box {
  width: 380px;
  background: white;
  padding: 25px 20px;
  border-radius: 4px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.box h2 {
  text-align: center;
  color: white;
  background: #1a365d;
  padding: 15px;
  margin: -25px -20px 20px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'SimSun', serif;
  border-bottom: 2px solid #2c5282;
}

input, select {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 13px;
  transition: all 0.3s ease;
  background: #f9f9f9;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: #1a365d;
  box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
  background: white;
}

input:hover, select:hover {
  border-color: #1a365d;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #1a365d 50%),
    linear-gradient(135deg, #1a365d 50%, transparent 50%);
  background-position: calc(100% - 15px) calc(1em + 1px),
    calc(100% - 10px) calc(1em + 1px);
  background-size: 4px 4px, 4px 4px;
  background-repeat: no-repeat;
}

button {
  width: 100%;
  padding: 10px;
  background: #1a365d;
  color: white;
  border: none;
  border-radius: 2px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(26, 54, 93, 0.3);
}

button:hover {
  background: #2c5282;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 54, 93, 0.4);
}

button:active {
  transform: translateY(0);
}

/* 底部信息 */
.footer {
  margin-top: 15px;
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.footer p {
  color: #666;
  font-size: 11px;
  margin: 0;
}

/* 导航按钮 */
.nav-buttons {
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .box {
    width: 90%;
    max-width: 360px;
  }
  
  .nav-buttons {
    left: 10px;
    right: 10px;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
}
</style>