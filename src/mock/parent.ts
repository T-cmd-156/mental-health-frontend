import { db } from './db'

// 家长端相关模拟数据

// 获取子女列表
export function getChildrenList() {
  const mockChildren = [
    {
      id: '1',
      name: '张三',
      studentId: '2024001',
      gender: 1,
      age: 19,
      class: '计算机科学与技术1班',
      college: '计算机学院',
      contact: '13800138000'
    },
    {
      id: '2',
      name: '李四',
      studentId: '2024002',
      gender: 0,
      age: 18,
      class: '软件工程2班',
      college: '计算机学院',
      contact: '13800138001'
    }
  ]
  
  return Promise.resolve({
    code: 200,
    data: mockChildren
  })
}

// 按学生查辅导员
export function getParentCounselor(studentId) {
  const mockCounselor = {
    id: '1',
    name: '王辅导员',
    title: '计算机学院辅导员',
    phone: '13800138002',
    email: 'wang@example.com',
    office: '行政楼301',
    workingHours: '周一至周五 8:30-17:30',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20counselor%20portrait&image_size=square'
  }
  
  return Promise.resolve({
    code: 200,
    data: mockCounselor
  })
}

// 发送留言
export function sendParentMessage(data) {
  return Promise.resolve({
    code: 200,
    data: { messageId: 'msg_' + Date.now() }
  })
}

// 我的留言记录
export function getParentMessages(params) {
  const mockMessages = [
    {
      id: '1',
      childId: '1',
      subject: '关于孩子最近的学习情况',
      content: '老师您好，我想了解一下孩子最近在学校的学习情况，是否有什么需要家长配合的地方？',
      urgency: 'medium',
      sendTime: '2026-02-20 14:30',
      status: '已回复',
      reply: {
        content: '家长您好，孩子最近学习态度认真，成绩稳定，希望继续保持。',
        replyTime: '2026-02-20 16:00'
      }
    },
    {
      id: '2',
      childId: '1',
      subject: '孩子的心理健康问题',
      content: '老师您好，孩子最近回家后情绪比较低落，请问在学校是否有类似情况？',
      urgency: 'high',
      sendTime: '2026-02-15 10:00',
      status: '已回复',
      reply: {
        content: '家长您好，我已经注意到孩子的情绪变化，建议带孩子到心理健康中心进行咨询。',
        replyTime: '2026-02-15 11:00'
      }
    },
    {
      id: '3',
      childId: '2',
      subject: '关于孩子的社团活动',
      content: '老师您好，孩子想参加学校的社团活动，请问有哪些推荐的社团？',
      urgency: 'low',
      sendTime: '2026-02-22 09:00',
      status: '未回复'
    }
  ]
  
  return Promise.resolve({
    code: 200,
    data: mockMessages
  })
}

// 获取子女测评情况
export function getChildAssessments(studentId) {
  const mockAssessments = [
    {
      id: '1',
      childId: '1',
      title: '心理健康状况评估',
      date: '2026-02-20',
      score: 75,
      level: 'normal',
      duration: 15,
      status: '已完成'
    },
    {
      id: '2',
      childId: '1',
      title: '抑郁倾向测评',
      date: '2026-01-15',
      score: 60,
      level: 'normal',
      duration: 10,
      status: '已完成'
    },
    {
      id: '3',
      childId: '1',
      title: '焦虑倾向测评',
      date: '2026-03-01',
      score: 0,
      level: '',
      duration: 0,
      status: '待完成'
    }
  ]
  
  return Promise.resolve({
    code: 200,
    data: mockAssessments
  })
}

// 获取子女预约咨询
export function getChildAppointments(studentId) {
  const mockAppointments = [
    {
      id: '1',
      childId: '1',
      counselor: '张老师',
      date: '2026-02-26',
      time: '09:00-10:00',
      method: '线下咨询',
      status: '已确认',
      createdAt: '2026-02-20 14:30'
    },
    {
      id: '2',
      childId: '1',
      counselor: '李老师',
      date: '2026-02-20',
      time: '14:00-15:00',
      method: '线上咨询',
      status: '已完成',
      createdAt: '2026-02-18 10:00'
    },
    {
      id: '3',
      childId: '1',
      counselor: '王老师',
      date: '2026-02-15',
      time: '16:00-17:00',
      method: '线下咨询',
      status: '已取消',
      createdAt: '2026-02-10 09:00'
    }
  ]
  
  return Promise.resolve({
    code: 200,
    data: mockAppointments
  })
}

// 获取子女活动记录
export function getChildActivities(studentId) {
  const mockActivities = [
    {
      id: '1',
      childId: '1',
      title: '情绪管理工作坊',
      time: '2026-03-10 14:00-16:00',
      location: '心理健康中心活动室',
      status: '已报名',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mental%20health%20workshop%20activity&image_size=landscape_4_3'
    },
    {
      id: '2',
      childId: '1',
      title: '正念冥想体验',
      time: '2026-02-20 16:00-17:00',
      location: '瑜伽室',
      status: '已完成',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mindfulness%20meditation%20activity&image_size=landscape_4_3'
    },
    {
      id: '3',
      childId: '1',
      title: '压力管理讲座',
      time: '2026-02-15 15:00-17:00',
      location: '学术报告厅',
      status: '已完成',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stress%20management%20lecture&image_size=landscape_4_3'
    }
  ]
  
  return Promise.resolve({
    code: 200,
    data: mockActivities
  })
}

// 获取子女成长档案
export function getChildProfile(studentId) {
  const mockProfile = {
    name: '张三',
    studentId: '2024001',
    gender: 1,
    age: 19,
    class: '计算机科学与技术1班',
    college: '计算机学院',
    contact: '13800138000',
    assessments: [
      {
        id: '1',
        title: '心理健康状况评估',
        date: '2026-02-20',
        score: 75,
        level: 'normal'
      },
      {
        id: '2',
        title: '抑郁倾向测评',
        date: '2026-01-15',
        score: 60,
        level: 'normal'
      }
    ],
    consultations: [
      {
        id: '1',
        counselor: '张老师',
        date: '2026-02-26',
        duration: 50,
        method: '线下咨询'
      },
      {
        id: '2',
        counselor: '李老师',
        date: '2026-02-20',
        duration: 60,
        method: '线上咨询'
      }
    ],
    activities: [
      {
        id: '1',
        title: '情绪管理工作坊',
        date: '2026-03-10',
        location: '心理健康中心活动室',
        status: '已报名'
      },
      {
        id: '2',
        title: '正念冥想体验',
        date: '2026-02-20',
        location: '瑜伽室',
        status: '已完成'
      }
    ],
    evaluations: [
      {
        id: '1',
        evaluator: '王辅导员',
        date: '2026-02-10',
        content: '该生学习态度认真，积极参与班级活动，与同学相处融洽，希望继续保持。'
      }
    ]
  }
  
  return Promise.resolve({
    code: 200,
    data: mockProfile
  })
}

// 绑定子女
export function bindChild(data) {
  return Promise.resolve({
    code: 200,
    message: '绑定成功'
  })
}

// 解绑子女
export function unbindChild(childId) {
  return Promise.resolve({
    code: 200,
    message: '解绑成功'
  })
}
