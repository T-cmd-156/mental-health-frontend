import request from './request.js'
// 导入学生端模拟数据
import * as studentMock from '../mock/student.ts'
import { getCounselors, getPeriods } from './mock.ts'

import type { Appointment, AppointmentStatus } from '../types/appointment'
import { createAppointmentForStudent, getAppointmentById } from '../mock/appointment.ts'

// 开发环境使用模拟数据，生产环境使用真实接口
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
const MOCK_SCHEDULE_KEY = 'MOCK_SCHEDULE'

function makeScheduleId(item: { date: string; time: string; counselorId: string }) {
  return `${item.date}_${item.time}_${item.counselorId}`
}

function readMockSchedules() {
  try {
    const raw = localStorage.getItem(MOCK_SCHEDULE_KEY)
    const list = raw ? JSON.parse(raw) : []
    if (!Array.isArray(list)) return []
    return list.map((item: any) => ({
      ...item,
      id: item.id || makeScheduleId(item),
      status: item.status || 'enabled',
      maxAppointments: item.maxAppointments || 1,
    }))
  } catch (_) {
    return []
  }
}

function writeMockSchedules(list: any[]) {
  localStorage.setItem(MOCK_SCHEDULE_KEY, JSON.stringify(list))
}

// 学生创建预约
export function createAppointmentAsync(data: {
  studentId: string
  counselorId: string
  consultantName: string
  date: string
  create_time: string
  end_time: string
}) {
  return createAppointmentForStudent(data)
}

// 重新导出 createAppointmentForStudentAsync 以支持一键续约
export function createAppointmentForStudentAsync(data: {
  studentId: string
  counselorId: string
  counselorName: string
  appointmentDate: string
  create_time: string
  update_time: string
}) {
  if (isDev) {
    return studentMock.createAppointmentForStudent(data)
  }
  return request.post('/api/appointment/submit', data)
}

// 咨询师创建预约
export function consultantSetSlot(data: {
  counselorId: string
  date: string
  time: string
}) {
  if (isDev) {
    return Promise.resolve({ code: 200, data: { success: true } })
  }
  // 文档中无独立排班创建接口，先统一走预约提交通道
  return request.post('/api/appointment/submit', data)
}

export function getConsultantListAsync() {
  if (isDev) {
    return Promise.resolve({ code: 200, data: getCounselors() })
  }
  return request.get('/api/consultant/list')
}

export function getScheduleListAsync(params: { week: string }) {
  if (isDev) {
    const all = readMockSchedules()
    if (!params?.week) return Promise.resolve({ code: 200, data: all })
    const weekDate = new Date(params.week)
    if (Number.isNaN(weekDate.getTime())) return Promise.resolve({ code: 200, data: all })
    const day = weekDate.getDay() || 7
    const monday = new Date(weekDate)
    monday.setDate(weekDate.getDate() - day + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const inWeek = all.filter((item: any) => {
      const d = new Date(item.date)
      return !Number.isNaN(d.getTime()) && d >= monday && d <= sunday
    })
    return Promise.resolve({ code: 200, data: inWeek })
  }
  return request.get('/api/schedule/list', { params })
}

export function createScheduleAsync(data: {
  counselorId: string
  date: string
  time: string
}) {
  if (isDev) {
    const list = readMockSchedules()
    const found = getCounselors().find((c) => c.id === data.counselorId)
    const newItem = {
      id: makeScheduleId(data),
      counselorId: data.counselorId,
      counselorName: found?.name || data.counselorId,
      date: data.date,
      time: data.time,
      status: 'enabled',
      maxAppointments: 1,
    }
    list.push(newItem)
    writeMockSchedules(list)
    return Promise.resolve({ code: 200, data: newItem })
  }
  return request.post('/api/appointment/submit', data)
}

export function updateScheduleAsync(data: {
  id: string
  date?: string
  time?: string
  status?: string
}) {
  if (isDev) {
    const list = readMockSchedules()
    const idx = list.findIndex((i: any) => i.id === data.id)
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        date: data.date ?? list[idx].date,
        time: data.time ?? list[idx].time,
        status: data.status ?? list[idx].status,
      }
      writeMockSchedules(list)
    }
    return Promise.resolve({ code: 200, data: idx >= 0 ? list[idx] : null })
  }
  return request.put('/api/schedule/update', data)
}

export function deleteScheduleAsync(id: string) {
  if (isDev) {
    const list = readMockSchedules().filter((i: any) => i.id !== id)
    writeMockSchedules(list)
    return Promise.resolve({ code: 200 })
  }
  return request.delete(`/api/schedule/delete?id=${id}`)
}

export function getAppointmentSlotsAsync(date: string) {
  if (isDev) {
    const daySlots = readMockSchedules()
      .filter((i: any) => i.date === date)
      .map((i: any) => i.time)
    const data = daySlots.length ? Array.from(new Set(daySlots)) : getPeriods()
    return Promise.resolve({ code: 200, data })
  }
  return request.get('/api/schedule/list', { params: { date } })
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
  if (status === 'cancelled') return request.post('/api/appointment/cancel', { id, ...payload })
  if (status === 'confirmed') return request.post('/api/appointment/confirm', { id, ...payload })
  if (status === 'rejected') return request.post('/api/appointment/reject', { id, ...payload })
  if (status === 'no_show') return request.post('/api/appointment/mark-no-show', { id, ...payload })
  return request.post('/api/appointment/submit', { id, status, ...payload })
}

// 查询学生预约列表
export function getMyAppointmentsAsync(studentId: string) {
  if (isDev) {
    return studentMock.getAppointmentsByStudent(studentId)
  }
  return request.get('/api/appointment/my-list', { params: { studentId } })
}

// 咨询师：查询全部预约
export function getCounselorAppointmentsAsync(counselorId: string) {
  if (isDev) {
    const dbStr = localStorage.getItem('MOCK_DB') || '{}'
    const db = JSON.parse(dbStr)
    const appointments = db.appointments || []

    // 用新的字段名筛选
    const filtered = appointments.filter(a => a.counselorId === counselorId)

        console.log('MOCK_DB', db)
    console.log('counselorId', counselorId)
    console.log('filtered appointments', filtered)
    return Promise.resolve({ code: 200, data: filtered })
  }
  return request.get('/api/appointment/my-list', { params: { counselorId } })
}

// 获取可预约时间
export function getAvailableSlots(date: string) {
  if (isDev) {
    return studentMock.getAvailableSlots(date)
  }
  return request.get('/api/schedule/list', { params: { date } })
}

// 获取可预约日期
export function getAvailableDates(start: string, days = 10) {
  if (isDev) {
    return studentMock.getAvailableDates(start, days)
  }
  return request.get('/api/schedule/list', { params: { start, days } })
}

// 通用：通过id获取单条预约
export function getAppointmentByIdAsync(id: string) {
  return getAppointmentById(id)
}
