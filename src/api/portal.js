import request from './request'

// 通知公告
export const getNotices = async () => {
  return [
    { id: 1, title: '关于开放本学期心理咨询预约的通知' },
    { id: 2, title: '心理健康月活动安排' }
  ]
}


// 心理百科
export const getWiki = async () => {
  return [{
    id: 1, title: '认识焦虑情绪' },
  { id: 2, title: '如何进行压力管理' 
  }]
}

export const getArticles = async () => {
  return [ 
    { id: 1, title: '给自己一段温柔时光' },
    { id: 2, title: '与情绪和解' }

/* return request.get('/api/wiki') */

  ]
}
