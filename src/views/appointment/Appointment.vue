<script setup lang="ts">
import { ref, onMounted ,computed } from 'vue'
import {
  createAppointmentAsync,
  updateAppointmentStatusAsync,
} from '../../api/appointment'
import type { Appointment } from '../../types/appointment'

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

const visitForm = ref({
  reason: '',
  emergencyContact: '',
})

const scaleForm = ref({
  mood: '',
  stressLevel: 0,
})

const signFile = ref<File | null>(null)
const signError = ref('')

function handleFileChange(file: any) {
  signFile.value = file.raw
  signError.value = ''
}

//来访登记提交
async function submitVisitInfo() {
  console.log('👉 submitVisitInfo 被点击了')
  if (!appointment.value) return

  // 这里暂时不校验，先跑通流程
  const res = await updateAppointmentStatusAsync(
    appointment.value.id,
    'info_done',

    {
      visitInfo: { ...visitForm.value },
    }
  )

  if (res.code === 200) {
    appointment.value = { ...res.data }
    console.log('来访登记完成', res.data )
  }
}

//前测量表提交
async function submitScale() {
  if (!appointment.value) return
  console.log('🔥 重新计算 currentStep，status =', appointment.value?.status)

  const res = await updateAppointmentStatusAsync(
    appointment.value.id,
    'scale_done',
  {
    scaleResult: { ...scaleForm.value },
  }
)

  if (res.code === 200) {
    appointment.value ={ ...res.data }
    console.log('前测完成', res.data )
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
  // 这里先写死，后面再接真实用户 / 排班
  const studentId = 'student_001'
  const counselorId = 'C1'

  const res = await createAppointmentAsync({
    studentId,
    counselorId,
    appointmentDate: '2026-04-10',
    appointmentTime: '09:00-09:50',
  })

  if (res.code === 200) {
    appointment.value = { ...res.data }
    console.log('预约已创建（draft）', { ...res.data })
  }
})

</script>

<template>
  <!-- 来访登记 -->
  <div v-if="appointment && currentStep === 'info'" class="step-info">
    <h3>来访登记</h3>

    <el-form :model="visitForm" label-width="120px">
      <el-form-item label="来访原因">
        <el-input v-model="visitForm.reason" placeholder="请填写来访原因" />
      </el-form-item>

      <el-form-item label="紧急联系人">
        <el-input v-model="visitForm.emergencyContact" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitVisitInfo">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 前测量表 -->
  <div v-if="appointment && currentStep === 'scale'" class="step-scale">
    <h3>前测量表</h3>

    <el-form :model="scaleForm" label-width="120px">
      <el-form-item label="当前情绪">
        <el-input
          v-model="scaleForm.mood"
          placeholder="例如：焦虑 / 低落 / 平稳"
        />
      </el-form-item>

      <el-form-item label="压力程度">
        <el-rate v-model="scaleForm.stressLevel" :max="5" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitScale">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
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

