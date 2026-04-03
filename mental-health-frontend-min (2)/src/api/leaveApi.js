import request from './request.js'

/** 咨询师提交请假申请（待管理员/心理中心审批） */
export function submitLeave(data) {
  return request.post('/api/leave/apply', data)
}

export function getLeaveList(params) {
  return request.get('/api/leave/list', { params })
}

export function getLeaveApprovalList(params) {
  return request.get('/api/leave/approval/list', { params })
}

export function approveLeave(data) {
  return request.post('/api/leave/approve', data)
}

export function rejectLeave(data) {
  return request.post('/api/leave/reject', data)
}

export function cancelLeave(data) {
  return request.post('/api/leave/cancel', data)
}
