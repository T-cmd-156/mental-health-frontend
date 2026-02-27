<template>
  <div class="assessment-page">
    <h2>{{ assessment.title }}</h2>
    <p class="description">{{ assessment.description }}</p>
    <p class="info">预计时长：{{ assessment.duration }}分钟</p>
    
    <div class="progress-bar">
      <div class="progress" :style="{ width: (currentQuestionIndex / totalQuestions) * 100 + '%' }"></div>
    </div>
    <p class="progress-text">{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>

    <div class="question-container">
      <h3 class="question-text">{{ currentQuestion.text }}</h3>
      <div class="options">
        <div 
          v-for="(option, index) in currentQuestion.options" 
          :key="index"
          :class="['option', { selected: selectedOption === index }]"
          @click="selectOption(index)"
        >
          {{ option }}
        </div>
      </div>
    </div>

    <div class="navigation">
      <button 
        v-if="currentQuestionIndex > 0"
        class="nav-btn prev-btn"
        @click="prevQuestion"
      >
        上一题
      </button>
      <button 
        v-if="currentQuestionIndex < totalQuestions - 1"
        class="nav-btn next-btn"
        @click="nextQuestion"
      >
        下一题
      </button>
      <button 
        v-if="currentQuestionIndex === totalQuestions - 1"
        class="nav-btn submit-btn"
        @click="submitAssessment"
      >
        提交测评
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const assessmentId = route.params.id

const assessment = ref({
  title: '心理健康状况评估',
  description: '全面评估你的心理健康状况，包括情绪、压力、人际关系等方面',
  duration: 20,
  questions: [
    {
      text: '最近一周，你感到情绪低落的频率是？',
      options: ['几乎每天', '几天', '偶尔', '从不']
    },
    {
      text: '你是否经常感到紧张或焦虑？',
      options: ['非常经常', '经常', '偶尔', '从不']
    },
    {
      text: '你对未来的态度是？',
      options: ['非常乐观', '比较乐观', '比较悲观', '非常悲观']
    },
    {
      text: '你是否能够很好地处理生活中的压力？',
      options: ['完全可以', '大部分可以', '有些困难', '非常困难']
    },
    {
      text: '你与家人和朋友的关系如何？',
      options: ['非常融洽', '比较融洽', '有些问题', '非常紧张']
    }
  ]
})

const currentQuestionIndex = ref(0)
const selectedOptions = ref([])
const selectedOption = ref(null)

const totalQuestions = computed(() => assessment.value.questions.length)
const currentQuestion = computed(() => assessment.value.questions[currentQuestionIndex.value])

onMounted(() => {
  // 初始化选项数组
  selectedOptions.value = new Array(totalQuestions.value).fill(null)
})

const selectOption = (index) => {
  selectedOption.value = index
  selectedOptions.value[currentQuestionIndex.value] = index
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    selectedOption.value = selectedOptions.value[currentQuestionIndex.value]
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedOption.value = selectedOptions.value[currentQuestionIndex.value]
  }
}

const submitAssessment = () => {
  // 检查是否所有问题都已回答
  if (selectedOptions.value.includes(null)) {
    alert('请回答所有问题')
    return
  }
  
  // 模拟提交
  setTimeout(() => {
    router.push(`/student/assessment/${assessmentId}/result`)
  }, 500)
}
</script>

<style scoped>
.assessment-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.description {
  color: #555;
  margin: 10px 0 20px;
  line-height: 1.5;
}

.info {
  color: #666;
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 30px;
}

.question-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.question-text {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  line-height: 1.4;
}

.option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.option.selected {
  border-color: #667eea;
  background: #f0f5ff;
  color: #667eea;
  font-weight: 500;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.prev-btn:hover {
  background: #e9ecef;
}

.next-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.next-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
  transform: translateY(-1px);
}

.submit-btn {
  background: #28a745;
  color: white;
}

.submit-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .assessment-page {
    padding: 15px;
  }

  .question-container {
    padding: 20px;
  }

  .nav-btn {
    padding: 10px 20px;
  }
}
</style>
