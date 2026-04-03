import request from './request.js'
import * as studentMock from '../mock/student.ts'

/** 设为 true 时走本地 mock（仅开发调 UI）；默认走真实接口 */
const useMockStudentAssessment =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.VITE_USE_MOCK_STUDENT_ASSESSMENT === 'true'

export function getMyAssessments(params) {
  if (useMockStudentAssessment) {
    return studentMock.getMyAssessments(params)
  }
  return request.get('/api/assessment/my-list', { params })
}

/**
 * 获取测评题目骨架：优先量表详情，失败则尝试 detail 查询参数
 */
export async function getAssessmentDetail(id) {
  if (useMockStudentAssessment) {
    return studentMock.getAssessmentDetail(id)
  }
  try {
    return await request.get(`/api/assessment/scales/${encodeURIComponent(id)}`)
  } catch (_) {
    return request.get('/api/assessment/detail', { params: { id } })
  }
}

export function startAssessment(data) {
  if (useMockStudentAssessment) {
    return studentMock.startAssessment(data)
  }
  return request.post('/api/assessment/start', data)
}

export function submitAssessment(data) {
  if (useMockStudentAssessment) {
    return studentMock.submitAssessment(data)
  }
  return request.post('/api/assessment/submit', data)
}

export function getAssessmentResult(id) {
  if (useMockStudentAssessment) {
    return studentMock.getAssessmentResult(id)
  }
  return request.get('/api/assessment/result', { params: { id } })
}

export function getSurveyList(params) {
  return Promise.resolve([])
}

export function getWarningList(params) {
  return Promise.resolve([])
}

export function getIndividualReports(params) {
  return Promise.resolve([])
}

export function getOverallReports(params) {
  return Promise.resolve([])
}

export function getAnalysisList(params) {
  return Promise.resolve([])
}

export function getStatList(params) {
  return Promise.resolve([])
}
