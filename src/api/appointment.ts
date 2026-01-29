import {
  createAppointment,
  updateAppointmentStatus,
  getAppointmentsByStudent,
} from '../mock/appointment'

import type { Appointment, AppointmentStatus } from '../types/appointment'

// 创建预约
export function createAppointmentAsync(data: {
  studentId: string
  counselorId: string
  appointmentDate: string
  appointmentTime: string
}) {
  return createAppointment(data)
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
