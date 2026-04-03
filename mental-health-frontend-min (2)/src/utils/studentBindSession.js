/**
 * 家长-学生绑定接口里的 studentId 与库表 parent_student_relation.student_id 一致，
 * 通常为 JWT subject（user.user_id）。登录页在 psychological_platform 模式下会写入 userId。
 */
export function getStudentBindUserId() {
  if (typeof localStorage === 'undefined') return ''
  const uid = localStorage.getItem('userId')
  if (uid) return uid
  return localStorage.getItem('studentId') || ''
}
