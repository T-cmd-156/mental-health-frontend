<template>
  <div class="contact-counselor">
    <h2>联系辅导员</h2>
    
    <!-- 子女切换器 -->
    <div class="child-selector">
      <label>选择子女：</label>
      <select v-model="selectedChild" @change="switchChild">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.studentId }})
        </option>
      </select>
    </div>

    <!-- 辅导员信息 -->
    <div class="counselor-info">
      <h3>辅导员信息</h3>
      <div class="info-card">
        <div class="counselor-details">
          <div class="avatar">
            <img :src="currentCounselor.avatar" :alt="currentCounselor.name" />
          </div>
          <div class="details">
            <h4>{{ currentCounselor.name }}</h4>
            <p class="title">{{ currentCounselor.title }}</p>
            <div class="contact-info">
              <p><span class="label">电话：</span>{{ currentCounselor.phone }}</p>
              <p><span class="label">邮箱：</span>{{ currentCounselor.email }}</p>
              <p><span class="label">办公室：</span>{{ currentCounselor.office }}</p>
              <p><span class="label">工作时间：</span>{{ currentCounselor.workingHours }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 留言表单 -->
    <div class="message-form">
      <h3>发送留言</h3>
      <form @submit.prevent="sendMessage">
        <div class="form-group">
          <label>主题：</label>
          <input v-model="message.subject" placeholder="请输入留言主题" required />
        </div>
        <div class="form-group">
          <label>内容：</label>
          <textarea v-model="message.content" placeholder="请输入留言内容" rows="5" required></textarea>
        </div>
        <div class="form-group">
          <label>紧急程度：</label>
          <select v-model="message.urgency" required>
            <option value="">请选择紧急程度</option>
            <option value="low">一般</option>
            <option value="medium">中等</option>
            <option value="high">紧急</option>
          </select>
        </div>
        <button type="submit" class="send-btn">发送留言</button>
      </form>
    </div>

    <!-- 留言记录 -->
    <div class="message-records">
      <h3>留言记录</h3>
      <div v-if="currentMessages.length === 0" class="empty-state">
        <p>暂无留言记录</p>
      </div>
      <div v-else class="messages-list">
        <div v-for="msg in currentMessages" :key="msg.id" class="message-item">
          <div class="message-header">
            <h4>{{ msg.subject }}</h4>
            <span :class="['urgency', msg.urgency]">{{ getUrgencyText(msg.urgency) }}</span>
          </div>
          <div class="message-body">
            <p class="content">{{ msg.content }}</p>
            <div class="message-meta">
              <span class="send-time">发送时间：{{ msg.sendTime }}</span>
              <span class="status" :class="msg.status">{{ msg.status }}</span>
            </div>
            <div v-if="msg.reply" class="reply">
              <h5>辅导员回复：</h5>
              <p>{{ msg.reply.content }}</p>
              <span class="reply-time">回复时间：{{ msg.reply.replyTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedChild = ref('1')

// 模拟子女数据
const children = ref([
  {
    id: '1',
    name: '张三',
    studentId: '2024001'
  },
  {
    id: '2',
    name: '李四',
    studentId: '2024002'
  }
])

// 模拟辅导员数据
const counselors = ref([
  {
    id: '1',
    childId: '1',
    name: '王辅导员',
    title: '计算机学院辅导员',
    phone: '13800138002',
    email: 'wang@example.com',
    office: '行政楼301',
    workingHours: '周一至周五 8:30-17:30',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20counselor%20portrait&image_size=square'
  },
  {
    id: '2',
    childId: '2',
    name: '李辅导员',
    title: '计算机学院辅导员',
    phone: '13800138003',
    email: 'li@example.com',
    office: '行政楼302',
    workingHours: '周一至周五 8:30-17:30',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20counselor%20portrait&image_size=square'
  }
])

// 模拟留言数据
const messages = ref([
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
])

const message = ref({
  subject: '',
  content: '',
  urgency: ''
})

const currentCounselor = computed(() => {
  return counselors.value.find(counselor => counselor.childId === selectedChild.value) || counselors.value[0]
})

const currentMessages = computed(() => {
  return messages.value.filter(msg => msg.childId === selectedChild.value)
})

const switchChild = () => {
  // 切换子女逻辑
  console.log('切换到子女：', selectedChild.value)
}

const getUrgencyText = (urgency) => {
  const urgencyMap = {
    low: '一般',
    medium: '中等',
    high: '紧急'
  }
  return urgencyMap[urgency] || urgency
}

const sendMessage = () => {
  // 模拟发送留言
  const newMessage = {
    id: (messages.value.length + 1).toString(),
    childId: selectedChild.value,
    ...message.value,
    sendTime: new Date().toLocaleString('zh-CN'),
    status: '未回复'
  }
  messages.value.unshift(newMessage)
  
  // 重置表单
  message.value = {
    subject: '',
    content: '',
    urgency: ''
  }
  
  alert('留言发送成功')
}
</script>

<style scoped>
.contact-counselor {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 子女切换器 */
.child-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.child-selector label {
  font-weight: 500;
  color: #333;
  font-size: 1rem;
}

.child-selector select {
  flex: 1;
  max-width: 400px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.counselor-info {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.counselor-info h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.counselor-details {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  flex: 1;
}

.details h4 {
  margin: 0 0 5px;
  color: #333;
  font-size: 1.1rem;
}

.title {
  margin: 0 0 15px;
  color: #666;
  font-size: 0.9rem;
}

.contact-info p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95rem;
}

.contact-info .label {
  font-weight: 500;
  color: #666;
}

.message-form {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.message-form h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
  transform: translateY(-2px);
}

.message-records {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.message-records h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.message-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.message-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.urgency {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
}

.urgency.low {
  background: #28a745;
}

.urgency.medium {
  background: #ffc107;
  color: #333;
}

.urgency.high {
  background: #dc3545;
}

.message-body .content {
  margin: 0 0 15px;
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: #666;
}

.status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.已回复 {
  background: #d4edda;
  color: #155724;
}

.status.未回复 {
  background: #fff3cd;
  color: #856404;
}

.reply {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.reply h5 {
  margin: 0 0 10px;
  color: #333;
  font-size: 1rem;
}

.reply p {
  margin: 0 0 10px;
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
}

.reply-time {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .contact-counselor {
    padding: 15px;
  }

  .child-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .child-selector select {
    max-width: none;
  }

  .counselor-info,
  .message-form,
  .message-records {
    padding: 20px;
  }

  .counselor-details {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .message-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
