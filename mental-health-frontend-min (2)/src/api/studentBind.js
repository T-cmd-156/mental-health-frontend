import request from './request.js'

/**
 * 统一解析 GET /api/bind/status/{studentId} 的 data（数字、字符串或 { status } 等）
 * @returns {number|null}
 */
export function normalizeBindStatus(data) {
  if (data == null) return null
  if (typeof data === 'number' && !Number.isNaN(data)) return data
  if (typeof data === 'boolean') return data ? 1 : 0
  if (typeof data === 'string') {
    const n = Number(String(data).trim())
    return Number.isNaN(n) ? null : n
  }
  if (typeof data === 'object') {
    const nested = data.data
    if (nested != null && typeof nested === 'object') {
      const inner = normalizeBindStatus(nested)
      if (inner != null) return inner
    }
    if (nested != null && typeof nested !== 'object') {
      const nn = Number(nested)
      if (!Number.isNaN(nn)) return nn
    }
    const v =
      data.status ?? data.bindStatus ?? data.state ?? data.code ?? data.value
    if (v == null) return null
    const n = Number(v)
    return Number.isNaN(n) ? null : n
  }
  return null
}

/** GET /api/bind/status/{studentId} → 0 待确认 1 已绑定 2 已拒绝 */
export function getBindStatus(studentId) {
  const id = encodeURIComponent(String(studentId || '').trim())
  return request.get(`/api/bind/status/${id}`)
}

/**
 * POST /api/bind/confirm/{studentId}
 * studentId 仅放在路径中；使用空 JSON 体 + application/json，避免部分 Spring Security / 防火墙对「无 Content-Type 的 POST」直接 403。
 */
export function confirmStudentBind(studentId) {
  const id = encodeURIComponent(String(studentId || '').trim())
  return request.post(`/api/bind/confirm/${id}`, {})
}

/** POST /api/bind/reject/{studentId} — 同上 */
export function rejectStudentBind(studentId) {
  const id = encodeURIComponent(String(studentId || '').trim())
  return request.post(`/api/bind/reject/${id}`, {})
}
