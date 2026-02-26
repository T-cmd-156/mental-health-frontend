// 消息中心 API（后续对接后端）
// 分类：system-系统, appointment-预约, crisis-危机, assessment-测评, activity-活动

const mockMessages = [
  { id: '1', type: 'crisis', title: '【危机】待处理危机上报', content: '学生张三需紧急评估', isRead: false, createdAt: '2025-02-25T09:00:00', link: '/admin/crisis', priority: true },
  { id: '2', type: 'appointment', title: '新预约待确认', content: '学生李四预约了 2月26日 14:00-15:00', isRead: false, createdAt: '2025-02-25T10:30:00', link: '/admin/appointments', priority: false },
  { id: '3', type: 'appointment', title: '预约已确认', content: '学生王五的预约已确认，请按时咨询', isRead: true, createdAt: '2025-02-24T16:00:00', link: '/admin/appointments', priority: false },
  { id: '4', type: 'system', title: '系统通知', content: '本周五系统维护 22:00-24:00', isRead: true, createdAt: '2025-02-23T08:00:00', link: null, priority: false },
  { id: '5', type: 'assessment', title: '测评预警', content: '1 名学生测评结果需关注', isRead: false, createdAt: '2025-02-25T08:00:00', link: '/admin/assessment', priority: true }
]

export async function getMessageList(params = {}) {
  const { type, isRead } = params
  let list = [...mockMessages]
  if (type) list = list.filter(m => m.type === type)
  if (typeof isRead === 'boolean') list = list.filter(m => m.isRead === isRead)
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return Promise.resolve({ code: 200, data: list })
}

export async function getUnreadCount() {
  const count = mockMessages.filter(m => !m.isRead).length
  return Promise.resolve({ code: 200, data: count })
}

export async function markAsRead(id) {
  const message = mockMessages.find(m => m.id === id)
  if (message) message.isRead = true
  return Promise.resolve({ code: 200 })
}

export async function markAllAsRead() {
  mockMessages.forEach(m => { m.isRead = true })
  return Promise.resolve({ code: 200 })
}

export const messageTypes = [
  { value: '', label: '全部' },
  { value: 'crisis', label: '危机' },
  { value: 'appointment', label: '预约' },
  { value: 'assessment', label: '测评' },
  { value: 'system', label: '系统' },
  { value: 'activity', label: '活动' }
]
