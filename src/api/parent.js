import request from './request.js'
// 导入家长端模拟数据
import * as parentMock from '../mock/parent.ts'

// 开发环境使用模拟数据，生产环境使用真实接口
const isDev = process.env.NODE_ENV === 'development'

export function getParentCounselor(studentId) {
  if (isDev) {
    return parentMock.getParentCounselor(studentId)
  }
  return request.get('/api/parent/counselor', { params: { studentId } })
}

export function sendParentMessage(data) {
  if (isDev) {
    return parentMock.sendParentMessage(data)
  }
  return request.post('/api/parent/message/send', data)
}

export function getParentMessages(params) {
  if (isDev) {
    return parentMock.getParentMessages(params)
  }
  return request.get('/api/parent/message/list', { params })
}

export function getChildrenList() {
  if (isDev) {
    return parentMock.getChildrenList()
  }
  return request.get('/api/parent/children')
}

export function bindChild(data) {
  if (isDev) {
    return parentMock.bindChild(data)
  }
  return request.post('/api/parent/children/bind', data)
}

export function unbindChild(childId) {
  if (isDev) {
    return parentMock.unbindChild(childId)
  }
  return request.post('/api/parent/children/unbind', { childId })
}

export function getChildAssessments(studentId) {
  if (isDev) {
    return parentMock.getChildAssessments(studentId)
  }
  return request.get('/api/parent/assessment', { params: { studentId } })
}

export function getChildAppointments(studentId) {
  if (isDev) {
    return parentMock.getChildAppointments(studentId)
  }
  return request.get('/api/parent/appointment', { params: { studentId } })
}

export function getChildActivities(studentId) {
  if (isDev) {
    return parentMock.getChildActivities(studentId)
  }
  return request.get('/api/parent/activity', { params: { studentId } })
}

export function getChildProfile(studentId) {
  if (isDev) {
    return parentMock.getChildProfile(studentId)
  }
  return request.get('/api/parent/profile', { params: { studentId } })
}
