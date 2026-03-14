import request from './request.js'
// 导入家长端模拟数据
import * as parentMock from '../mock/parent.ts'

// 开发环境使用模拟数据，生产环境使用真实接口
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

export function getParentCounselor(studentId) {
  if (isDev) {
    return parentMock.getParentCounselor(studentId)
  }
  return request.get('/api/center/archive/counselors', { params: { studentId } })
}

export function sendParentMessage(data) {
  if (isDev) {
    return parentMock.sendParentMessage(data)
  }
  return request.post('/api/message/send', data)
}

export function getParentMessages(params) {
  if (isDev) {
    return parentMock.getParentMessages(params)
  }
  return request.get('/api/message/list', { params })
}

export function getChildrenList() {
  if (isDev) {
    return parentMock.getChildrenList()
  }
  return request.get('/api/center/archive/students')
}

export function bindChild(data) {
  if (isDev) {
    return parentMock.bindChild(data)
  }
  return Promise.resolve({ code: 200, data: { ...data } })
}

export function unbindChild(childId) {
  if (isDev) {
    return parentMock.unbindChild(childId)
  }
  return Promise.resolve({ code: 200, data: { childId } })
}

export function getChildAssessments(studentId) {
  if (isDev) {
    return parentMock.getChildAssessments(studentId)
  }
  return request.get('/api/assessment/my-list', { params: { studentId } })
}

export function getChildAppointments(studentId) {
  if (isDev) {
    return parentMock.getChildAppointments(studentId)
  }
  return request.get('/api/appointment/my-list', { params: { studentId } })
}

export function getChildActivities(studentId) {
  if (isDev) {
    return parentMock.getChildActivities(studentId)
  }
  return request.get('/api/activity/my-list', { params: { studentId } })
}

export function getChildProfile(studentId) {
  if (isDev) {
    return parentMock.getChildProfile(studentId)
  }
  return request.get('/api/center/archive/student/detail', { params: { studentId } })
}
