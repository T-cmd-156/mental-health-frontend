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
        <option value="tutor">辅导员</option>
        <option value="admin">管理员</option>
      </select>

      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '../../api/mock'

const router = useRouter()

localStorage.removeItem('admin_token')
localStorage.removeItem('admin_role')

const form = ref({
  username: '',
  password: '',
  role: 'center'
})

const ROLE_MAP = {
  center: '心理中心',
  counselor: '咨询师',
  tutor: '辅导员',
  leader: '校领导',
  college: '二级学院',
  admin: '管理员'
}


const login = async () => {
  try {
    const res = await adminLogin(form.value)
    console.log('接口原始返回 res = ', res)

    const user = res.data
    console.log('res.data = ', user)
    if (!user) {
      alert('账号或密码错误')
      return
    }

    // 保存登录信息
    localStorage.setItem('user_id', user.id)         // 用于筛选预约
    localStorage.setItem('user_token', user.username)
    localStorage.setItem('user_role', user.role)
    localStorage.setItem('user_name', user.name)

    console.log('存进去后的 user_id =', localStorage.getItem('user_id'))
console.log('存进去后的 user_name =', localStorage.getItem('user_name'))
    // 补一个 token
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
