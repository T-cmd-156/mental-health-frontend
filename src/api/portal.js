import request from './request'

// 通知公告
export const getNotices = async () => {
  return [
  { id: 1, title: '关于开放本学期心理咨询预约的通知' },
  { id: 2, title: '心理健康月活动安排' },
  { id: 3, title: '心理委员培训通知' },
  { id: 4, title: '寒假心理咨询服务安排' }
]
}


// 心理百科
export const getWiki = async () => {
  return [
  { id: 1, title: '认识焦虑情绪' },
  { id: 2, title: '如何进行压力管理' },
  { id: 3, title: '情绪调节的有效方法' },
  { id: 4, title: '保持心理健康的小技巧' }
]
}

export const getArticles = async () => {
  return [
  { id: 1, title: '给自己一段温柔时光' },
  { id: 2, title: '与情绪和解' },
  { id: 3, title: '心灵的栖息地' },
  { id: 4, title: '倾听内心的声音' }
]
/* return request.get('/api/wiki') */


}
