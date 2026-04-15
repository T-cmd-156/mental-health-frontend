import { getJwtSubject } from './jwtPayload.js'
import { getStoredAccessToken } from '../request.js'
import { fetchCounselorDetail } from '../api/consultApi.js'
import { isApiSuccess } from '../api/helpers.js'

let _cachedCounselorRowId = ''
let _cachedForJwtSub = ''


export function getCounselorIdForScheduleFilter() {
  if (typeof localStorage === 'undefined') return ''
  const token = getStoredAccessToken()
  const sub = token ? getJwtSubject(token) : ''
  if (sub) return sub
  return (
    localStorage.getItem('userId') ||
    localStorage.getItem('user_id') ||
    localStorage.getItem('counselorId') ||
    ''
  )
}

/** 与 getCounselorIdForScheduleFilter 相同（历史命名） */
export function getCounselorUserId() {
  return getCounselorIdForScheduleFilter()
}

/**
 * 解析与 consultation_case.counselor_id、counselor_info.counselor_id 一致的咨询师主键。
 * 调用 psychological_platform GET /api/consulate/detail?counselorId=（ConsulateMapper 按 counselor_id 查），
 * 以响应体 CounselorDetailVO.counselorId 为准并写入本地，避免误传账号名或错误缓存导致个案列表 WHERE cc.counselor_id=? 无数据。
 *
 * @param {string} [optionalHint] 优先使用的候选 ID（一般为 JWT sub 或 getCounselorIdForScheduleFilter()）
 * @returns {Promise<string>}
 */
export async function resolveCounselorRowIdForCaseQueries(optionalHint) {
  const token = getStoredAccessToken()
  const sub = token ? getJwtSubject(token) : ''
  const fromLs =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('userId') ||
        localStorage.getItem('user_id') ||
        localStorage.getItem('counselorId') ||
        ''
      : ''
  const hint =
    (optionalHint != null && String(optionalHint).trim()) ||
    sub ||
    fromLs
  if (!hint) return ''

  const cacheKey = sub || hint
  if (_cachedCounselorRowId && _cachedForJwtSub === cacheKey) {
    return _cachedCounselorRowId
  }

  try {
    const res = await fetchCounselorDetail(hint)
    if (isApiSuccess(res) && res.data?.counselorId != null) {
      const cid = String(res.data.counselorId).trim()
      if (cid) {
        _cachedCounselorRowId = cid
        _cachedForJwtSub = cacheKey
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('counselorId', cid)
          }
        } catch (_) {
          /* ignore */
        }
        return cid
      }
    }
  } catch (_) {
    /* 咨询师扩展表无记录等情况：回退 hint */
  }

  _cachedCounselorRowId = hint
  _cachedForJwtSub = cacheKey
  return hint
}

export function clearCounselorRowIdResolverCache() {
  _cachedCounselorRowId = ''
  _cachedForJwtSub = ''
}
