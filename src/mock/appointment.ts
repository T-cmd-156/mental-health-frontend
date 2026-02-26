import { clearSchedule, fetchSchedule, generateFromTemplate, getWeekTemplate  } from './schedule'
import type { Appointment, AppointmentStatus } from '../types/appointment'
import { db } from './db'


const schedule = getWeekTemplate()
// ===== 工具函数 =====
function now() {
  return new Date().toISOString()
}

function generateId() {
  return 'apt_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
}

// 创建预约（学生点“开始预约”）
export function createAppointmentForStudent(data: {
  studentId: string
  counselorId: string
  counselorName: string
  appointmentDate: string
  appointmentTime: string
}) {


  const appointment: Appointment = {
    id: generateId(),
    studentId: data.studentId,
    counselorId: data.counselorId,
    counselorName: data.counselorName,  // 张老师
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,

    status: 'draft',          // 刚创建为 draft
    create_time: now(),
    update_time: now(),
    timeline: [
    { status: 'draft', time: now() }
  ]

  }

db.pushAppointment(appointment)
console.log('已写入db:', db.appointments.map(a => a.id))//调试

  return Promise.resolve({
    code: 200,
    data: { ...appointment },
  })
}

// 更新预约状态（填表 / 签字 / 提交）
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  payload?: Partial<Appointment>,
) {
  const ok = db.updateAppointment(id, a => {
    a.status = status
    a.update_time = now()

    a.timeline.push({
      status,
      time: now(),
    })

    if (payload) {
      Object.assign(a, payload)
    }
  })

  if (!ok) {
    console.error('db里有:', db.appointments.map(a => a.id))
    console.error('要找的:', id)
    return Promise.reject({
      code: 404,
      message: '预约不存在',
    })
  }

  const appointment = db.appointments.find(a => a.id === id)!

  if (status === 'confirmed') {
    await clearSchedule(
      appointment.appointmentDate,
      appointment.appointmentTime
    )
  }

  return Promise.resolve({
    code: 200,
    data: appointment,
  })
}


// ===== 咨询师端：查询自己的预约 =====
export function getAppointmentsByCounselor(counselorId: string) {
  const list = db.appointments.filter(a => a.counselorId === counselorId)
  return Promise.resolve({
    code: 200,
    data: list
  })
}

// 查询学生的预约列表
export function getAppointmentsByStudent(studentId: string) {
  const list = db.appointments.filter(a => a.studentId === studentId)

  return Promise.resolve({
    code: 200,
    data: list,
  })
}

function toDay(d: string | Date) {
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  return dt.toISOString().slice(0, 10)
}

// 学生端：获取某天可预约时间
export async function getAvailableSlots(date: string) {
  const schedule = generateFromTemplate()

   console.log('所有排班条数:', schedule.length)
  // 已被预约的时间
  const target = toDay(date)
  const used = db.appointments
    .filter((a: Appointment) => toDay(a.appointmentDate) === target)
    .map(a => a.appointmentTime)

  console.log('示例排班日期:', schedule[0]?.date, typeof schedule[0]?.date)
  console.log('转化后:', toDay(schedule[0]?.date))

  const result = schedule.filter((s: { date: string | Date; time: string, counselorId: string, counselorName: string }) => {
    return toDay(s.date) === target && !used.includes(s.time)
  })

  console.log('匹配日期:', target, '命中条数:', result.length)
  return result
}

// 返回未来 N 天内，有排班的日期
export async function getAvailableDates(start: string, days = 10) {
  const schedule = generateFromTemplate() // 全学期排班

  const startDay = new Date(start)
  const endDay = new Date(start)
  endDay.setDate(endDay.getDate() + days)

  const set = new Set<string>()

  schedule.forEach(s => {
    const d = new Date(s.date)
    if (d >= startDay && d <= endDay) {
      set.add(s.date)
    }
  })

  return Array.from(set).sort()
}




