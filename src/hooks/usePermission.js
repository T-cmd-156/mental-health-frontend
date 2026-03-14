import { computed } from 'vue'
import { ElMessage } from 'element-plus'

export function usePermission(allowRoles = []) {
  const role = localStorage.getItem('admin_role')

  const can = computed(() => {
    if (!allowRoles.length) return true
    return allowRoles.includes(role)
  })

  function guard() {
    if (!can.value) {
      ElMessage.error('你没有操作权限')
      return false
    }
    return true
  }

  return { can, guard }
}
