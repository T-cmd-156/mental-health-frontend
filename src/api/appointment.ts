import {
  createAppointmentForStudent,
  updateAppointmentStatus,
  getAppointmentsByStudent,
  getAppointmentsByCounselor,
  getAppointmentById,
} from '../mock/appointment'

import type { Appointment, AppointmentStatus } from '../types/appointment'


// 学生创建预约
export function createAppointmentAsync(data: {
  student_id: string
  counselor_id: string
  consultant_name: string
  date: string
  start_time: string
  end_time: string
}) {
  return createAppointmentForStudent(data)
}

// 重新导出 createAppointmentForStudentAsync 以支持一键续约
export function createAppointmentForStudentAsync(data: {
  student_id: string
  counselor_id: string
  consultant_name: string
  date: string
  start_time: string
  end_time: string
}) {
  return createAppointmentForStudent(data)
}

// 咨询师创建预约
export function consultantSetSlot(data: {
  counselor_id: string
  date: string
  time: string
}) {
  return addScheduleSlot(data)
}

// 更新预约状态updateAppointmentStatusAsync
export function updateAppointmentStatusAsync(
  id: string,
  status: AppointmentStatus,
  payload?: Partial<Appointment>,
) {
  return updateAppointmentStatus(id, status, payload)
}

// 查询学生预约列表
export function getMyAppointmentsAsync(student_id: string) {
  return getAppointmentsByStudent(student_id)
}

// 咨询师：查询全部预约
export function getConsultantAppointmentsAsync(counselor_id: string) {
  return getAppointmentsByCounselor(counselor_id)
}

// 通用：通过id获取单条预约
export function getAppointmentByIdAsync(id: string) {
  return getAppointmentById(id)
}

function addScheduleSlot(data: { counselor_id: string; date: string; time: string }) {
  throw new Error('Function not implemented.')
}
