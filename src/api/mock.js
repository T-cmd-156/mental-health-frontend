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

// ===== 模拟数据 =====

// 学期信息
export function getSemester() {
  return {
    start: '2026-03-01',
    end: '2026-07-10',
  };
}

// 咨询师数据
export function getCounselors() {
  return [
    { id: 'C1', name: '张老师' },
    { id: 'C2', name: '李老师' },
    { id: 'C3', name: '王老师' },
    { id: 'C4', name: '赵老师' },
    { id: 'C5', name: '钱老师' },
    { id: 'C6', name: '罗老师' },
    { id: 'C7', name: '穆老师' },
    { id: 'C8', name: '何老师' },
    { id: 'C9', name: '周老师' },
    { id: 'C10', name: '冯老师' },
  ];
}

// 节假日数据
export function getHolidays() {
  return ['2026-04-05', '2026-05-01', '2026-06-10'];
}

// 时间段数据
export function getPeriods() {
  return [
    '09:00-09:50',
    '09:50-10:40',
    '10:40-11:30',
    '11:30-12:20',
    '15:00-15:50',
    '15:50-16:40',
    '16:40-17:30',
  ];
}

// 一周的日期数据
export function getWeek() {
  return ['周一', '周二', '周三', '周四', '周五'];
}