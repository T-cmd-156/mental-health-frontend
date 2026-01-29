// src/types/appointment.ts

// 预约状态枚举
export type AppointmentStatus =
  | 'draft'            // 草稿（刚创建）
  | 'info_done'        // 来访登记完成
  | 'scale_done'       // 前测量表完成
  | 'sign_done'        // 知情同意书已签署
  | 'completed'        // 整个预约完成
  | 'form_completed'   // 已完成来访登记 & 前测
  | 'consent_signed'   // 已签署知情同意书
  | 'submitted'        // 已提交
  | 'confirmed'        // 已确认
  | 'cancelled'        // 已取消

// 单条预约数据结构
export interface Appointment {
  id: string                 // 预约id
  studentId: string          // 学生id
  counselorId: string        // 咨询师id
  appointmentDate: string    // 预约日期
  appointmentTime: string    // 时间段

  status: AppointmentStatus  // 当前状态

  create_time: string        // 创建时间
  update_time: string        // 最近更新时间

    visitInfo?: {
    reason: string
    emergencyContact: string
  }

  scaleResult?: {
    mood: string
    stressLevel: number
  }

  signAt?: string
}


