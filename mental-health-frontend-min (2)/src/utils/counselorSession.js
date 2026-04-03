/** 与 psychological_platform JWT subject 一致：优先 userId（统一登录解析），其次历史键 user_id */
export function getCounselorUserId() {
  if (typeof localStorage === 'undefined') return ''
  return (
    localStorage.getItem('userId') ||
    localStorage.getItem('user_id') ||
    localStorage.getItem('counselorId') ||
    ''
  )
}
