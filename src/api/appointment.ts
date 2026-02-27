import request from './request.js'
// 导入学生端模拟数据
import * as studentMock from '../mock/student.ts'

import type { Appointment, AppointmentStatus } from '../types/appointment'

// 开发环境使用模拟数据，生产环境使用真实接口
const isDev = process.env.NODE_ENV === 'development'

// 学生创建预约
export function createAppointmentAsync(data: {
  studentId: string
  counselorId: string
  counselorName: string
  appointmentDate: string
  appointmentTime: string
}) {
  if (isDev) {
    return studentMock.createAppointmentForStudent(data)
  }
  return request.post('/api/appointment/create', data)
}

// 咨询师创建预约
export function counselorSetSlot(data: {
  counselorId: string
  date: string
  time: string
}) {
  if (isDev) {
    return Promise.resolve({ code: 200, data: { success: true } })
  }
  return request.post('/api/appointment/slot', data)
}

// 更新预约状态updateAppointmentStatusAsync
export function updateAppointmentStatusAsync(
  id: string,
  status: AppointmentStatus,
  payload?: Partial<Appointment>,
) {
  if (isDev) {
    return studentMock.updateAppointmentStatus(id, status, payload)
  }
  return request.post('/api/appointment/update', { id, status, ...payload })
}

// 查询学生预约列表
export function getMyAppointmentsAsync(studentId: string) {
  if (isDev) {
    return studentMock.getAppointmentsByStudent(studentId)
  }
  return request.get('/api/appointment/my', { params: { studentId } })
}

// 咨询师：查询全部预约
export function getCounselorAppointmentsAsync(counselorId: string) {
  if (isDev) {
    return Promise.resolve({ code: 200, data: [] })
  }
  return request.get('/api/appointment/counselor', { params: { counselorId } })
}

// 获取可预约时间
export function getAvailableSlots(date: string) {
  if (isDev) {
    return studentMock.getAvailableSlots(date)
  }
  return request.get('/api/appointment/slots', { params: { date } })
}

// 获取可预约日期
export function getAvailableDates(start: string, days = 10) {
  if (isDev) {
    return studentMock.getAvailableDates(start, days)
  }
  return request.get('/api/appointment/dates', { params: { start, days } })
}

function addScheduleSlot(data: { counselorId: string; date: string; time: string }) {
  throw new Error('Function not implemented.')
}
