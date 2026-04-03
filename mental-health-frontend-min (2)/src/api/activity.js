import request from './request.js'

/**
 * 团体活动 API（与 ActivityController /api/activity 对齐）。
 * 注意：以下均为 API，无独立后端 HTML 页：
 * - POST /api/activity/join — 入口：列表/详情、「/student/activity/join?activityId=」
 * - POST /api/activity/cancel — 入口：详情/我的活动、「/student/activity/cancel?activityId=」
 * - POST /api/activity/checkin — 入口：详情/我的活动、「/student/activity/checkin?activityId=」
 * 以上 mutation 请求参数为 Query「activityId」；响应为统一 R（msg/data），一般不回传 activityId（使用链接或入参中的 ID）。
 */

export function getActivityList(params) {
  return request.get('/api/activity/list', { params })
}

/** GET /api/activity/detail，参数 activityId（与后端 ActivityController 一致） */
export function getActivityDetail(activityId) {
  return request.get('/api/activity/detail', {
    params: { activityId },
  })
}

function activityIdParams(data) {
  if (data == null) return {}
  const activityId = typeof data === 'object' ? data.activityId ?? data.id : data
  return activityId ? { activityId } : {}
}

/** POST /api/activity/join，Query：activityId */
export function joinActivity(data) {
  return request.post('/api/activity/join', null, { params: activityIdParams(data) })
}

/** POST /api/activity/cancel */
export function cancelActivityRegistration(data) {
  return request.post('/api/activity/cancel', null, { params: activityIdParams(data) })
}

/** POST /api/activity/checkin */
export function checkinActivity(data) {
  return request.post('/api/activity/checkin', null, { params: activityIdParams(data) })
}

export function getMyActivities(params) {
  return request.get('/api/activity/my', { params })
}
