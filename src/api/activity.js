import request from './request.js'
// 导入学生端模拟数据
import * as studentMock from '../mock/student.ts'

// 开发环境使用模拟数据，生产环境使用真实接口
const isDev = process.env.NODE_ENV === 'development'

export function getActivityList(params) {
  if (isDev) {
    return studentMock.getActivityList(params)
  }
  return request.get('/api/activity/list', { params })
}

export function getActivityDetail(id) {
  if (isDev) {
    return studentMock.getActivityDetail(id)
  }
  return request.get(`/api/activity/detail?id=${id}`)
}

export function joinActivity(data) {
  if (isDev) {
    return studentMock.joinActivity(data)
  }
  return request.post('/api/activity/join', data)
}

export function cancelActivityRegistration(data) {
  if (isDev) {
    return studentMock.cancelActivityRegistration(data)
  }
  return request.post('/api/activity/cancel', data)
}

export function checkinActivity(data) {
  if (isDev) {
    return studentMock.checkinActivity(data)
  }
  return request.post('/api/activity/checkin', data)
}

export function getMyActivities(params) {
  if (isDev) {
    return studentMock.getMyActivities(params)
  }
  return request.get('/api/activity/my', { params })
}
