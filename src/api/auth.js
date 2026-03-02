// 之后这里对接后端
import request from './request'   // axios

// 管理端登录
export function adminLogin(data) {
  return request({
    url: '/api/auth/admin/login',
    method: 'post',
    data
  })
}

// 学生/家长登录
export function userLogin(data) {
  return request({
    url: '/api/auth/user/login',
    method: 'post',
    data
  })
}
