import request from './request.js'
import { getAdminStudentList, getAdminStudentDetail } from './adminApi.js'
import { fetchConsultantList } from './psychPlatformAppointment.js'

/** 文档 11.3 建议路径；若后端仍用档案接口可二选一实现 */
export function getStudentList(params) {
  return request.get('/api/student/list', { params })
}

/** 心理中心-学生档案列表：对齐后端 GET /api/admin/student/list（ArchiveController 未实现 /center/archive/students） */
export function getArchiveStudents(params) {
  return getAdminStudentList(params)
}

/** 心理中心-咨询师列表：对齐 GET /api/consultant/list */
export function getArchiveCounselors(params) {
  return fetchConsultantList(params)
}

/**
 * 学生档案详情：对接 GET /api/admin/student/detail?studentId=
 * 带 section 的分段查询（测评/咨询/危机等）后端未统一实现时，由调用方 catch 使用演示数据。
 */
export function getArchiveStudentDetail(params = {}) {
  if (params.section) {
    return Promise.reject(new Error('分段档案接口未实现'))
  }
  const sid = params.studentId || params.id
  if (!sid) {
    return Promise.reject(new Error('缺少 studentId'))
  }
  return getAdminStudentDetail(sid)
}

/** 长程咨询审批列表 — 后端 ConsultationApprovalController GET /api/center/approval/consultation/list */
export function getCenterApprovalList(params = {}) {
  const p = { ...params }
  if (p.status != null && p.approvalStatus == null) {
    p.approvalStatus = p.status
    delete p.status
  }
  return request.get('/api/center/approval/consultation/list', { params: p })
}
