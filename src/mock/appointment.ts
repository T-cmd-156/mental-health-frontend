import type { Appointment, AppointmentStatus } from '../types/appointment'

// ===== 假数据库 =====
const appointmentDB: Appointment[] = []

// ===== 工具函数 =====
function now() {
  return new Date().toISOString()
}

function generateId() {
  return 'apt_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
}

// 创建预约（学生点“开始预约”）
export function createAppointment(data: {
  studentId: string
  counselorId: string
  appointmentDate: string
  appointmentTime: string
}) {
  const appointment: Appointment = {
    id: generateId(),
    studentId: data.studentId,
    counselorId: data.counselorId,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,

    status: 'draft',          // 刚创建为 draft
    create_time: now(),
    update_time: now(),
  }

  appointmentDB.push(appointment)

  return Promise.resolve({
    code: 200,
    data: { ...appointment },
  })
}

// 更新预约状态（填表 / 签字 / 提交）
export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  payload?: Partial<Appointment>,
) {
  const appointment = appointmentDB.find(a => a.id === id)

  if (!appointment) {
      return Promise.reject({
      code: 404,
      msg: '预约不存在',
    })
  }

  appointment.status = status
  appointment.update_time = now()

    if (payload) {
    Object.assign(appointment, payload)
  }

  return Promise.resolve({
    code: 200,
    data: appointment,
  })
}

// 查询学生的预约列表
export function getAppointmentsByStudent(studentId: string) {
  const list = appointmentDB.filter(a => a.studentId === studentId)

  return Promise.resolve({
    code: 200,
    data: list,
  })
}
