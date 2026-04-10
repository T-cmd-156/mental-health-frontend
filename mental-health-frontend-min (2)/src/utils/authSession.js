import { getJwtSubject } from './jwtPayload.js'

/**
 * 将 psychological_platform 登录 JWT 的 sub（用户主键 UUID）写入本地，
 * 供咨询记录、排班等接口的 counselorId 与后端 counselor_info.counselor_id 对齐。
 * @returns 是否成功写入（token 可解析出 sub）
 */
export function persistUserIdFromAccessToken(token) {
  const sub = getJwtSubject(token)
  if (!sub) return false
  try {
    localStorage.setItem('userId', sub)
    localStorage.setItem('user_id', sub)
    return true
  } catch {
    return false
  }
}
