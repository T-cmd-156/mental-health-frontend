import request from './request.js'
import { isApiSuccess } from './helpers.js'
// 导入学生端模拟数据
import * as studentMock from '../mock/student.ts'
import { getCounselors, getPeriods } from './mock.ts'
import { padTimeFragment, unwrapPageResult } from './psychPlatformAppointment.js'
import { useAppointmentMock } from './appointmentEnv'

import type { Appointment, AppointmentStatus } from '../types/appointment'
import { createAppointmentForStudent, getAppointmentById } from '../mock/appointment.ts'

/** 仅 VITE_USE_MOCK_APPOINTMENT=true 时为 true；默认联调后端 */
const appointmentMock = useAppointmentMock()
const MOCK_SCHEDULE_KEY = 'MOCK_SCHEDULE'

/** 将 /api/appointment/detail 的 VO 转成页面常用的 date / create_time / status */
export function normalizeAppointmentFromApi(d: any) {
  if (!d || typeof d !== 'object') return d
  const s = d.status
  const sv = String(s ?? '').toUpperCase()
  let status = s
  if (sv === 'PENDING' || s === '待处理' || s === '待确认') status = 'draft'
  else if (sv === 'CONFIRMED' || s === '已确认') status = 'confirmed'
  else if (sv === 'CANCELLED' || s === '已取消') status = 'cancelled'
  else if (sv === 'REJECTED' || s === '已拒绝') status = 'closed'
  else if (sv === 'COMPLETED' || s === '已完成') status = 'completed'
  else if (sv === 'NO_SHOW' || s === '爽约') status = 'no_show'

  return {
    ...d,
    date: d.appointmentDate ?? d.date,
    create_time: d.appointmentTime ?? d.create_time,
    end_time: d.end_time ?? d.appointmentTime,
    status,
  }
}

async function refetchAppointmentAfterMutation(id: string, res: any) {
  if (!res || !isApiSuccess(res) || !id) return res
  try {
    const detail = await request.get('/api/appointment/detail', { params: { id } })
    if (isApiSuccess(detail) && detail.data) {
      return { ...res, data: normalizeAppointmentFromApi(detail.data) }
    }
  } catch (_) {
    /* ignore */
  }
  return res
}

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
  if (appointmentMock) {
    return createAppointmentForStudent(data)
  }
  const sid = (data as any).scheduleId
  if (!sid) {
    return Promise.reject(
      new Error('未传 scheduleId：请从选时页提交或对接 POST /api/appointment/submit'),
    )
  }
  return request.post('/api/appointment/submit', {
    scheduleId: sid,
    appointmentType: 'INDIVIDUAL',
    consultationMode: 'OFFLINE',
    location: '',
    isUrgent: 0,
    notes: '',
  })
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
  if (appointmentMock) {
    return studentMock.createAppointmentForStudent(data)
  }
  const body: Record<string, unknown> = {
    scheduleId: (data as any).scheduleId,
    appointmentType: (data as any).appointmentType || 'INDIVIDUAL',
    consultationMode: (data as any).consultationMode || 'OFFLINE',
    location: (data as any).location || '',
    isUrgent: (data as any).isUrgent ?? 0,
    notes: (data as any).notes || '',
  }
  return request.post('/api/appointment/submit', body)
}

// 咨询师创建预约
export function consultantSetSlot(data: {
  counselorId: string
  date: string
  time: string
}) {
  if (appointmentMock) {
    return Promise.resolve({ code: 200, data: { success: true } })
  }
  // 真实排班请对接 POST /api/schedule/create（ScheduleCreateDTO），此处 body 与后端不一致时可能 400
  return request.post('/api/appointment/create', data)
}

export async function getConsultantListAsync() {
  if (appointmentMock) {
    return Promise.resolve({ code: 200, data: getCounselors() })
  }
  const res: any = await request.get('/api/consultant/list', {
    params: { page: 1, pageSize: 500 },
  })
  const { records } = unwrapPageResult(res)
  return { ...res, data: records }
}

export async function getScheduleListAsync(params: { week: string }) {
  if (appointmentMock) {
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
  const res: any = await request.get('/api/schedule/list', {
    params: { page: 1, pageSize: 500, ...params },
  })
  const { records } = unwrapPageResult(res)
  return { ...res, data: records }
}

export function createScheduleAsync(data: {
  counselorId: string
  date: string
  time: string
}) {
  if (appointmentMock) {
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
  return request.post('/api/appointment/create', data)
}

export function updateScheduleAsync(data: {
  id: string
  date?: string
  time?: string
  status?: string
}) {
  if (appointmentMock) {
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
  if (appointmentMock) {
    const list = readMockSchedules().filter((i: any) => i.id !== id)
    writeMockSchedules(list)
    return Promise.resolve({ code: 200 })
  }
  return request.delete(`/api/schedule/delete?id=${id}`)
}

export async function getAppointmentSlotsAsync(date: string) {
  if (appointmentMock) {
    const daySlots = readMockSchedules()
      .filter((i: any) => i.date === date)
      .map((i: any) => i.time)
    const data = daySlots.length ? Array.from(new Set(daySlots)) : getPeriods()
    return Promise.resolve({ code: 200, data })
  }
  const res: any = await request.get('/api/schedule/list', {
    params: { page: 1, pageSize: 200, date },
  })
  const { records } = unwrapPageResult(res)
  const times = records.map((r: any) =>
    padTimeFragment(r.startTime ?? r.start_time),
  )
  const data = Array.from(new Set(times.filter(Boolean)))
  return { ...res, data: data.length ? data : getPeriods() }
}

// 更新预约状态（API 模式下成功后重新拉详情，避免 data 仅为「确认成功」字符串）
export async function updateAppointmentStatusAsync(
  id: string,
  status: AppointmentStatus,
  payload?: Partial<Appointment>,
) {
  if (appointmentMock) {
    return studentMock.updateAppointmentStatus(id, status, payload)
  }
  let res: any
  if (status === 'cancelled') {
    res = await request.post('/api/appointment/cancel', {
      id,
      reason: (payload as any)?.reason || (payload as any)?.cancellationReason || '用户取消',
      ...payload,
    })
  } else if (status === 'confirmed') {
    res = await request.post('/api/appointment/confirm', { id, ...payload })
  } else if (status === 'rejected') {
    res = await request.post('/api/appointment/reject', { id, ...payload })
  } else if (status === 'no_show') {
    res = await request.post('/api/appointment/mark-no-show', { id, ...payload })
  } else if (status === 'closed') {
    // 原前端用 closed 表示咨询师拒绝，对接后端 reject
    res = await request.post('/api/appointment/reject', {
      id,
      reason: (payload as any)?.reason || '咨询师拒绝',
      notes: (payload as any)?.notes,
    })
  } else {
    return Promise.reject(new Error(`updateAppointmentStatusAsync: 后端未映射状态 ${status}`))
  }
  return refetchAppointmentAfterMutation(id, res)
}

// 查询学生预约列表
export async function getMyAppointmentsAsync(studentId: string) {
  if (appointmentMock) {
    return studentMock.getAppointmentsByStudent(studentId)
  }
  const res = await request.get('/api/appointment/list', {
    params: { page: 1, pageSize: 100, userId: studentId },
  })
  const { records } = unwrapPageResult(res)
  return { ...res, data: records.map((r: any) => normalizeAppointmentFromApi(r)) }
}

// 咨询师：查询全部预约
export async function getCounselorAppointmentsAsync(counselorId: string) {
  if (appointmentMock) {
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
  const res = await request.get('/api/appointment/list', {
    params: { page: 1, pageSize: 200, counselorId },
  })
  const { records } = unwrapPageResult(res)
  return { ...res, data: records.map((r: any) => normalizeAppointmentFromApi(r)) }
}

// 获取可预约时间
export function getAvailableSlots(date: string) {
  if (appointmentMock) {
    return studentMock.getAvailableSlots(date)
  }
  return request.get('/api/schedule/list', { params: { date } })
}

// 获取可预约日期
export function getAvailableDates(start: string, days = 10) {
  if (appointmentMock) {
    return studentMock.getAvailableDates(start, days)
  }
  return request.get('/api/schedule/list', { params: { start, days } })
}

// 通用：通过 id 获取单条预约
export async function getAppointmentByIdAsync(id: string) {
  if (appointmentMock) {
    return getAppointmentById(id)
  }
  const res: any = await request.get('/api/appointment/detail', { params: { id } })
  if (isApiSuccess(res) && res.data) {
    return { ...res, data: normalizeAppointmentFromApi(res.data) }
  }
  return res
}
