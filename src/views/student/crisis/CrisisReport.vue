<template>
  <div class="crisis-report">
    <h2>危机上报</h2>
    <p class="description">如果您或身边的同学遇到心理危机，请及时上报，我们将尽快提供帮助。</p>

    <div class="report-form">
      <div class="form-group">
        <label>上报类型：</label>
        <select v-model="form.reportType">
          <option value="self">本人危机</option>
          <option value="other">他人危机</option>
        </select>
      </div>

      <div class="form-group">
        <label>危机程度：</label>
        <div class="severity-options">
          <div 
            v-for="severity in severities" 
            :key="severity.value"
            :class="['severity-option', { selected: form.severity === severity.value }]"
            @click="form.severity = severity.value"
          >
            <span class="severity-label">{{ severity.label }}</span>
            <span class="severity-desc">{{ severity.desc }}</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>危机描述：</label>
        <textarea 
          v-model="form.description" 
          placeholder="请详细描述危机情况，包括发生时间、地点、具体表现等" 
          rows="5"
        ></textarea>
      </div>

      <div class="form-group" v-if="form.reportType === 'other'">
        <label>涉及人员信息：</label>
        <div class="sub-form">
          <div class="sub-form-group">
            <label>姓名：</label>
            <input v-model="form.otherInfo.name" placeholder="请输入姓名" />
          </div>
          <div class="sub-form-group">
            <label>学号：</label>
            <input v-model="form.otherInfo.studentId" placeholder="请输入学号" />
          </div>
          <div class="sub-form-group">
            <label>联系方式：</label>
            <input v-model="form.otherInfo.contact" placeholder="请输入联系方式" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>联系人信息：</label>
        <div class="sub-form">
          <div class="sub-form-group">
            <label>姓名：</label>
            <input v-model="form.contactInfo.name" placeholder="请输入您的姓名" />
          </div>
          <div class="sub-form-group">
            <label>联系方式：</label>
            <input v-model="form.contactInfo.phone" placeholder="请输入您的联系方式" />
          </div>
          <div class="sub-form-group">
            <label>邮箱：</label>
            <input v-model="form.contactInfo.email" placeholder="请输入您的邮箱" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>是否紧急：</label>
        <div class="emergency-options">
          <label class="radio-label">
            <input type="radio" v-model="form.emergency" value="true" />
            <span class="radio-text">紧急</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="form.emergency" value="false" />
            <span class="radio-text">非紧急</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button class="submit-btn" @click="submitReport" :disabled="!isFormValid">
          提交上报
        </button>
        <button class="reset-btn" @click="resetForm">
          重置
        </button>
      </div>
    </div>

    <div class="tips">
      <h3>温馨提示</h3>
      <ul>
        <li>请如实填写上报信息，以便我们及时提供帮助</li>
        <li>紧急情况请直接拨打心理危机干预热线：400-161-9995</li>
        <li>我们会对上报信息严格保密</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const form = ref({
  reportType: 'self',
  severity: '',
  description: '',
  otherInfo: {
    name: '',
    studentId: '',
    contact: ''
  },
  contactInfo: {
    name: '',
    phone: '',
    email: ''
  },
  emergency: 'false'
})

const severities = [
  {
    value: 'low',
    label: '轻度',
    desc: '情绪波动，能正常学习生活'
  },
  {
    value: 'medium',
    label: '中度',
    desc: '情绪困扰明显，影响学习生活'
  },
  {
    value: 'high',
    label: '重度',
    desc: '出现自伤或伤人倾向'
  }
]

const isFormValid = computed(() => {
  return form.value.severity && 
         form.value.description && 
         form.value.contactInfo.name && 
         form.value.contactInfo.phone && 
         (form.value.reportType === 'self' || 
          (form.value.otherInfo.name && form.value.otherInfo.studentId))
})

const submitReport = () => {
  if (!isFormValid.value) {
    alert('请填写完整的上报信息')
    return
  }
  
  // 模拟提交
  setTimeout(() => {
    alert('上报成功！我们将尽快与您联系')
    resetForm()
  }, 1000)
}

const resetForm = () => {
  form.value = {
    reportType: 'self',
    severity: '',
    description: '',
    otherInfo: {
      name: '',
      studentId: '',
      contact: ''
    },
    contactInfo: {
      name: '',
      phone: '',
      email: ''
    },
    emergency: 'false'
  }
}
</script>

<style scoped>
.crisis-report {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.description {
  color: #555;
  margin: 10px 0 30px;
  line-height: 1.5;
}

.report-form {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.severity-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.severity-option {
  flex: 1;
  min-width: 200px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.severity-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.severity-option.selected {
  border-color: #667eea;
  background: #f0f5ff;
}

.severity-label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.severity-desc {
  font-size: 0.9rem;
  color: #666;
}

.sub-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.sub-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sub-form-group label {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.emergency-options {
  display: flex;
  gap: 30px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-text {
  font-size: 14px;
  color: #333;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.submit-btn, .reset-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.reset-btn:hover {
  background: #e9ecef;
}

.tips {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #667eea;
}

.tips h3 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.1rem;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  color: #555;
  line-height: 1.5;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .crisis-report {
    padding: 15px;
  }

  .report-form {
    padding: 20px;
  }

  .severity-options {
    flex-direction: column;
  }

  .severity-option {
    min-width: auto;
  }

  .sub-form {
    grid-template-columns: 1fr;
  }

  .emergency-options {
    flex-direction: column;
    gap: 15px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn, .reset-btn {
    width: 100%;
  }
}
</style>
