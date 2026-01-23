import { useRouter } from 'vue-router'

export function useHomeActions() {
  const router = useRouter()

  const goLogin = (type) => {
    if (type === 'admin') {
      router.push('/login/admin')
    } else {
      router.push('/login/user')
    }
  }

  const goAppointment = () => {
    router.push('/appointment')
  }

  const goDetail = (type, id) => {
    console.log(`查看${type}详情，ID: ${id}`)
    const routeMap = {
      'wiki': '/wiki',
      'article': '/articles',
      'peer': '/peer-support',
      'notice': '/notices'
    }
    const baseRoute = routeMap[type] || '/'
    router.push(`${baseRoute}/${id}`)
  }

  return {
    goLogin,
    goAppointment,
    goDetail
  }
}
