import {
  createAppointmentForStudent,
  updateAppointmentStatus,
  getAppointmentsByStudent,
  getAppointmentsByCounselor,
} from '../mock/appointment'

import type { Appointment, AppointmentStatus } from '../types/appointment'


// 学生创建预约
export function createAppointmentAsync(data: {
  studentId: string
  counselorId: string
  counselorName: string
  appointmentDate: string
  appointmentTime: string
}) {
  return createAppointmentForStudent(data)
}

// 咨询师创建预约
export function counselorSetSlot(data: {
  counselorId: string
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
export function getMyAppointmentsAsync(studentId: string) {
  return getAppointmentsByStudent(studentId)
}

// 咨询师：查询全部预约
export function getCounselorAppointmentsAsync(counselorId: string) {
  return getAppointmentsByCounselor(counselorId)
}

function addScheduleSlot(data: { counselorId: string; date: string; time: string }) {
  throw new Error('Function not implemented.')
}
