import request from './request.js'

export function getNoticeList(params) {
  return request.get('/api/notice/list', { params })
}

export function getNoticeDetail(params) {
  return request.get('/api/notice/detail', { params })
}
