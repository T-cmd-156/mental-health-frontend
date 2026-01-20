import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080', // 之后换成后端
  timeout: 5000
})

// 请求拦截
request.interceptors.request.use(config => {
  return config
})

// 响应拦截
request.interceptors.response.use(
  res => res.data,
  err => {
    console.error('接口错误', err)
    return Promise.reject(err)
  }
)

export default request
