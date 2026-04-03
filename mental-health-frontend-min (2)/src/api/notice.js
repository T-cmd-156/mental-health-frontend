import request from './request.js'

/** 与 portal 一致：默认 `/cms`（Vite 重写为 `/api/cms`）；直连 Spring 时设 `VITE_CMS_API_PREFIX=/api/cms` */
const CMS_API_PREFIX =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_CMS_API_PREFIX) ||
  '/cms'

/** GET /cms/notices → 后端 CmsController `/api/cms/notices`（PageResult：records、total） */
export function getNoticeList(params) {
  return request.get(`${CMS_API_PREFIX}/notices`, { params })
}

export function getNoticeDetail(params) {
  return request.get('/api/notice/detail', { params })
}
