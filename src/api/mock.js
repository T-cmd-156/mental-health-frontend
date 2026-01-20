// ===== 模拟管理员账号 =====
export const adminUsers = [
  {
    username: 'center',
    password: '123456',
    role: '心理中心'
  },
  {
    username: 'counselor',
    password: '123456',
    role: '咨询师'
  },
  {
    username: 'instructor',
    password: '123456',
    role: '辅导员'
  },
    {
    username: 'admin',
    password: '123',
    role: '管理员'
  }
]

// ===== 模拟登录接口 =====
export function adminLogin(data) {
  const user = adminUsers.find(
    u =>
      u.username === data.username &&
      u.password === data.password
  )

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user) {
        resolve({
          code: 200,
          data: {
            id: user.username,
            role: user.role,
            token: 'mock-token-123'
          }
        })
      } else {
        reject({
          code: 401,
          msg: '账号或密码错误'
        })
      }
    }, 500)
  })
}
