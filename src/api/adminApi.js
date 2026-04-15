import request from './request.js'

/** 管理端学生分页 — 后端 AdminStudentController GET /api/admin/student/list */
export function getAdminStudentList(params = {}) {
  return request.get('/api/admin/student/list', {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      keyword: params.keyword,
      collegeId: params.collegeId,
      classId: params.classId,
      grade: params.grade,
    },
  })
}

/** GET /api/admin/student/detail?studentId= */
export function getAdminStudentDetail(studentId) {
  return request.get('/api/admin/student/detail', {
    params: { studentId },
  })
}

/** GET /api/admin/user/list — PageQueryDTO：page、pageSize、keyWords、status 等 */
export function getAdminUserList(params = {}) {
  return request.get('/api/admin/user/list', {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      keyWords: params.keyWords,
      status: params.status,
    },
  })
}

/** 管理端统计（系统管理员 / 大屏）— AdminStatsController */
export function getAdminStatsOverview(range) {
  return request.get('/api/admin/stats/overview', {
    params: range != null && range !== '' ? { range } : {},
  })
}
