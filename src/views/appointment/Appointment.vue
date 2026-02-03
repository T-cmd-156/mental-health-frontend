<script setup lang="ts">
import { ref, onMounted ,computed, watch } from 'vue'
import {
  createAppointmentAsync,
  updateAppointmentStatusAsync,
} from '../../api/appointment'
import type { Appointment } from '../../types/appointment'
import { getVisitFormConfig, getScaleConfig, getConsentConfig } from '../../api/config'
import { useRoute } from 'vue-router'
import { getMyAppointmentsAsync } from '../../api/appointment'

const route = useRoute()

const currentStep = computed<'info' | 'scale' | 'sign' | 'done'>(()  => {
  if (!appointment.value) return 'info'

  switch (appointment.value.status) {
    case 'draft':
      return 'info'
    case 'info_done':
      return 'scale'
    case 'scale_done':
      return 'sign'
    case 'sign_done':
    case 'completed':
    //case 'submitted':
    //case 'confirmed':
      return 'done'
    default:
      return 'info'
  }
})

// 当前预约
const appointment = ref<Appointment | null>(null)

const scaleForm = ref<Record<string, any>>({})

const doneScales = ref<string[]>([]) // 已完成的量表 id
const activeScale = ref<string | null>(null) // 当前填写哪个

const signFile = ref<File | null>(null)
const signError = ref('')

const visitForm = ref<Record<string, any>>({})
const visitConfig = ref<any>(null)


const scaleConfig = ref<any[]>([])
const consentConfig = ref<any>(null)

function handleFileChange(file: any) {
  signFile.value = file.raw
  signError.value = ''
}

//来访登记提交
async function submitVisitInfo() {
  console.log(' submitVisitInfo 被点击了')
  if (!appointment.value) return

  // 这里暂时不校验，先跑通流程
  const res = await updateAppointmentStatusAsync(
    appointment.value.id,
    'info_done',

    {
      visitInfo: {
        ...visitForm.value,
        reason: '',
        emergencyContact: ''
      },
    }
  )

  if (res.code === 200) {
    appointment.value = { ...res.data }
    console.log('来访登记完成', res.data )
  }
}

//前测量表提交
async function submitScale() {
  if (!appointment.value || !activeScale.value ) return
<<<<<<< HEAD
  console.log('🔥 重新计算 currentStep，status =', appointment.value?.status)
=======
  console.log(' 重新计算 currentStep，status =', appointment.value?.status)
>>>>>>> dee70a2e002a1462eef511c3a36eedf461a9507d

    if (!doneScales.value.includes(activeScale.value)) {
    doneScales.value.push(activeScale.value)
  }

  activeScale.value = null

  // 如果全部量表都完成，才进入下一步
  const allDone = scaleConfig.value.every(
    s => !s.enabled || doneScales.value.includes(s.id)
  )

  if (allDone) {
    const res = await updateAppointmentStatusAsync(
      appointment.value.id,
      'scale_done',
      { scaleResult: {
        ...doneScales.value,
        mood: '',
        stressLevel: 0
      } }
    )

    if (res.code === 200) {
      appointment.value = { ...res.data }
    }
  }
}

//电子签名
async function submitSign() {
  if (!appointment.value) return

    if (!signFile.value) {
    signError.value = '请先上传已签署的知情同意书'
    return
  }
  const res = await updateAppointmentStatusAsync(
    appointment.value.id,
    'sign_done',
      {
      signAt: new Date().toISOString(),
    }
  )

  if (res.code === 200) {
    appointment.value = { ...res.data }
    console.log('签署完成', res.data )
  }
}

onMounted(async () => {
  const id = route.params.id as string
  const studentId = 'student_001' // 先写死，后面接登录态

  const res = await getMyAppointmentsAsync(studentId)
  const found = res.data.find(a => a.id === id)

  if (!found) {
    console.error('找不到预约', id)
    return
  }

  appointment.value = { ...found }
})


onMounted(async () => {
  visitConfig.value = (await getVisitFormConfig()).data
  scaleConfig.value = (await getScaleConfig()).data.filter(i => i.enabled)
  consentConfig.value = (await getConsentConfig()).data
})

watch(visitConfig, (cfg) => {
  if (!cfg) return
  cfg.fields.forEach((f: { key: string | number }) => {
    visitForm.value[f.key] = ''
  })
})

watch(scaleConfig, (list) => {
  list.forEach(s => {
    scaleForm.value[s.key] = s.type === 'rate' ? 0 : ''
  })
})

</script>

<template>
  <div v-if="!appointment">
    <el-empty description="暂无预约，请从预约列表进入" />
  </div>
  
  <!-- 来访登记 -->
  <div v-if="appointment && currentStep === 'info'" class="step-info">
    <h3>来访登记</h3>

    <el-form :model="visitForm" label-width="120px">
  <el-form-item
    v-for="f in visitConfig.fields"
    :key="f.key"
    :label="f.label"
    :required="f.required"
  >
    <el-input v-model="visitForm[f.key]" />
  </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitVisitInfo">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>

<<<<<<< HEAD
  
<!-- 前测量表 -->
=======
  <!-- 前测量表 -->
>>>>>>> dee70a2e002a1462eef511c3a36eedf461a9507d
<div v-if="appointment && currentStep === 'scale'" class="step-scale">
  <h3>前测量表</h3>

  <!-- 量表列表 -->
<div v-if="!activeScale">
  <template v-for="s in scaleConfig" :key="s.id">
    <el-card
      v-if="s.enabled"
      style="margin-bottom:12px"
    >
<<<<<<< HEAD
      <div style="display:flex;justify-content:space-between">
        <span>{{ s.title }}</span>
=======
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-weight:bold;font-size:16px">{{ s.title }}</span>
        </div>
>>>>>>> dee70a2e002a1462eef511c3a36eedf461a9507d

        <el-tag v-if="doneScales.includes(s.id)" type="success">
          已完成
        </el-tag>

        <el-button
          v-else
          size="small"
          type="primary"
          @click="activeScale = s.id"
        >
          开始填写
        </el-button>
      </div>
    </el-card>
  </template>
</div>

  <!-- 量表填写页（占位） -->
  <div v-else>
<<<<<<< HEAD
    <h4>正在填写：{{ activeScale }}</h4>
=======
    <div style="margin-bottom:20px">
      <el-button type="info" size="small" @click="activeScale = null">
        ← 返回量表列表
      </el-button>
    </div>

    <h4 style="margin-bottom:20px">正在填写：{{ activeScale }}</h4>
>>>>>>> dee70a2e002a1462eef511c3a36eedf461a9507d

    <el-input
      v-model="scaleForm[activeScale]"
      placeholder="这里后续可以替换成真实题目"
    />

<<<<<<< HEAD
    <el-button type="primary" @click="submitScale">
=======
    <el-button type="primary" @click="submitScale" style="width:100%">
>>>>>>> dee70a2e002a1462eef511c3a36eedf461a9507d
      提交该量表
    </el-button>
  </div>
</div>


    <!-- ③ 电子签名 -->
    <div v-if="appointment && currentStep === 'sign'" class="step-sign">
      <h3>知情同意书签署</h3>

  <p>
    请先下载并阅读知情同意书，手写签名后上传扫描件或照片。
  </p>

  <el-link type="primary" href="/consent.pdf" target="_blank">
    📄 下载知情同意书
  </el-link>

    <el-upload
      class="upload-demo"
      :auto-upload="false"
      :limit="1"
      accept=".pdf,.jpg,.png"
      :on-change="handleFileChange"
    >
    <el-button>选择签署文件</el-button>
    </el-upload>

    <p v-if="signFile">已选择文件：{{ signFile.name }}</p>
    <p v-if="signError" style="color:red">{{ signError }}</p>

    <el-button type="primary" @click="submitSign">
      提交并完成预约
    </el-button>
    
  </div>

    <!-- ④ 完成 -->
    <div v-if="appointment && currentStep === 'done'" class="step-done">
      <el-result
        icon="success"
        title="预约完成"
        sub-title="我们已收到你的预约，请按时到访。"
      />
  </div>
</template>

<style scoped>
.appointment-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%);
  padding: 20px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.appointment-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ===== 页面头部 ===== */
.page-header {
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  padding: 30px 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(30, 79, 156, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.page-subtitle {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
}

/* ===== 步骤指示器 ===== */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 25px 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(30, 79, 156, 0.4);
}

.step-label {
  font-size: 13px;
  color: #999;
  font-weight: 500;
  transition: all 0.3s ease;
}

.step-item.active .step-label {
  color: #1e4f9c;
  font-weight: bold;
}

.step-line {
  flex: 1;
  height: 3px;
  background: #e0e0e0;
  margin: 0 15px;
  transition: all 0.3s ease;
}

.step-line.active {
  background: linear-gradient(90deg, #1e4f9c 0%, #2d5fb4 100%);
}

/* ===== 步骤内容 ===== */
.step-info,
.step-scale,
.step-sign,
.step-done {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-header {
  text-align: center;
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
}

.step-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.step-title {
  font-size: 26px;
  font-weight: bold;
  color: #1e4f9c;
  margin: 0 0 8px 0;
}

.step-desc {
  font-size: 15px;
  color: #666;
  margin: 0;
}

/* ===== 表单样式 ===== */
.visit-form {
  max-width: 600px;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 28px;
}

.el-input {
  border-radius: 6px;
}

.el-input :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s ease;
}

.el-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #1e4f9c inset;
}

.el-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1e4f9c inset;
}

.submit-item {
  margin-top: 40px;
  text-align: center;
}

.submit-btn {
  padding: 14px 50px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  border: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(30, 79, 156, 0.4);
}

.submit-btn .arrow {
  transition: transform 0.3s ease;
}

.submit-btn:hover .arrow {
  transform: translateX(5px);
}

/* ===== 量表列表 ===== */
.scale-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.scale-card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
}

.scale-card:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.scale-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
}

.scale-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.scale-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: 12px;
}

.scale-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.scale-desc {
  font-size: 13px;
  color: #999;
}

.scale-action {
  display: flex;
  align-items: center;
}

.start-btn {
  padding: 10px 25px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ===== 量表填写 ===== */
.scale-form {
  max-width: 700px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 25px;
  padding: 10px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
}

.form-header {
  text-align: center;
  margin-bottom: 25px;
}

.form-header h4 {
  font-size: 20px;
  color: #1e4f9c;
  margin: 0;
}

.scale-input {
  margin-bottom: 25px;
}

.scale-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  font-size: 15px;
}

.scale-input :deep(.el-textarea__inner:focus) {
  border-color: #1e4f9c;
}

/* ===== 签署页面 ===== */
.sign-content {
  max-width: 700px;
  margin: 0 auto;
}

.sign-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f0f7ff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 4px solid #1e4f9c;
}

.info-icon {
  font-size: 24px;
  color: #1e4f9c;
  flex-shrink: 0;
  margin-top: 2px;
}

.sign-info p {
  margin: 0;
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

.download-section {
  text-align: center;
  margin-bottom: 30px;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.download-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(30, 79, 156, 0.4);
}

.upload-section {
  margin-bottom: 25px;
}

.upload-demo :deep(.el-upload-dragger) {
  border: 2px dashed #d0d7de;
  border-radius: 12px;
  background: #fafbfc;
  transition: all 0.3s ease;
  padding: 40px;
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: #1e4f9c;
  background: #f0f7ff;
}

.upload-demo :deep(.el-icon--upload) {
  font-size: 48px;
  color: #1e4f9c;
}

.el-upload__tip {
  margin-top: 12px;
  font-size: 13px;
  color: #999;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f9ff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #67c23a;
}

.file-info .el-icon {
  font-size: 20px;
  color: #67c23a;
}

.file-info span {
  font-size: 14px;
  color: #555;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef0f0;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #f56c6c;
}

.error-message .el-icon {
  font-size: 20px;
  color: #f56c6c;
}

.error-message span {
  font-size: 14px;
  color: #f56c6c;
}

/* ===== 完成页面 ===== */
.step-done {
  text-align: center;
  padding: 60px 40px;
}

.success-content {
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-icon {
  font-size: 80px;
  margin-bottom: 25px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.success-title {
  font-size: 32px;
  font-weight: bold;
  color: #1e4f9c;
  margin: 0 0 15px 0;
}

.success-desc {
  font-size: 16px;
  color: #666;
  margin: 0 0 35px 0;
}

.appointment-details {
  background: #f5f7fa;
  padding: 25px 35px;
  border-radius: 10px;
  margin-bottom: 35px;
  display: inline-block;
  min-width: 300px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #d0d7de;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 15px;
  color: #1e4f9c;
  font-weight: bold;
}

.back-home-btn {
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  border: none;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(30, 79, 156, 0.4);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .page-header {
    padding: 20px;
  }

  .page-title {
    font-size: 20px;
  }

  .steps-indicator {
    padding: 15px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .step-label {
    font-size: 11px;
  }

  .step-info,
  .step-scale,
  .step-sign,
  .step-done {
    padding: 25px 20px;
  }

  .scale-card-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .scale-info {
    flex-direction: column;
  }
}
</style>

