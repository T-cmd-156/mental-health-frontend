import request from './request.js'
// 导入学生端模拟数据
import * as studentMock from '../mock/student.ts'

// 开发环境使用模拟数据，生产环境使用真实接口
const isDev = process.env.NODE_ENV === 'development'

export function getMyAssessments(params) {
  if (isDev) {
    return studentMock.getMyAssessments(params)
  }
  return request.get('/api/assessment/my', { params })
}

export function getAssessmentDetail(id) {
  if (isDev) {
    return studentMock.getAssessmentDetail(id)
  }
  return request.get(`/api/assessment/detail?id=${id}`)
}

export function startAssessment(data) {
  if (isDev) {
    return studentMock.startAssessment(data)
  }
  return request.post('/api/assessment/start', data)
}

export function submitAssessment(data) {
  if (isDev) {
    return studentMock.submitAssessment(data)
  }
  return request.post('/api/assessment/submit', data)
}

export function getAssessmentResult(id) {
  if (isDev) {
    return studentMock.getAssessmentResult(id)
  }
  return request.get(`/api/assessment/result?id=${id}`)
}
