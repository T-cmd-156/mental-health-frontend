import request from './request'

/**
 * 查询学生与家长绑定状态（后端：GET /api/bind/status/{studentId}）
 * 约定：-1 表示未绑定，其余值由后端定义
 */
export function getStudentBindStatus(studentId) {
  return request.get(`/api/bind/status/${studentId}`)
}
