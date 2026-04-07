import axios from 'axios'

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

function buildDevFallback(err) {
  const method = (err?.config?.method || 'get').toLowerCase()
  const url = String(err?.config?.url || '')

  // In dev/offline mode, provide shape-safe defaults to keep pages renderable.
  if (method === 'get' && (url.includes('/list') || url.includes('/my-list'))) {
    return { code: 200, data: [] }
  }
  if (method === 'get' && url.includes('/detail')) {
    return { code: 200, data: {} }
  }
  if (method === 'get' && url.includes('/overview')) {
    return { code: 200, data: {} }
  }
  return { code: 200, data: null }
}

const request = axios.create({
  baseURL: 'http://127.0.0.1:5173', // 对接对方后端
  timeout: 5000
})

// 请求拦截
request.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('User_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截
request.interceptors.response.use(
  res => res.data,
  err => {
    if (isDev && err && err.code === 'ERR_NETWORK') {
      return Promise.resolve(buildDevFallback(err))
    }
    console.error('接口错误', err)
    return Promise.reject(err)
  }
)

export default request
