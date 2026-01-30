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
  console.log('👉 submitVisitInfo 被点击了')
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
  console.log('🔥 重新计算 currentStep，status =', appointment.value?.status)

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

  <!-- 前测量表 -->
<!-- 前测量表 -->
<div v-if="appointment && currentStep === 'scale'" class="step-scale">
  <h3>前测量表</h3>

  <!-- 量表列表 -->
<div v-if="!activeScale">
  <template v-for="s in scaleConfig" :key="s.id">
    <el-card
      v-if="s.enabled"
      style="margin-bottom:12px"
    >
      <div style="display:flex;justify-content:space-between">
        <span>{{ s.title }}</span>

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
    <h4>正在填写：{{ activeScale }}</h4>

    <el-input
      v-model="scaleForm[activeScale]"
      placeholder="这里后续可以替换成真实题目"
    />

    <el-button type="primary" @click="submitScale">
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

