<template>
  <div class="wiki-detail">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span>></span>
        <router-link to="/wiki">心理百科</router-link>
        <span>></span>
        <span>{{ article.title }}</span>
      </div>

      <div class="content">
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta">
          <span class="date">{{ article.date }}</span>
        </div>
        <div class="article-content">
          <p v-html="article.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const articleId = route.params.id

const article = ref({
  title: '',
  date: '',
  content: ''
})

const articles = {
  1: {
    title: '认识焦虑情绪',
    date: '2024-01-15',
    content: '<p>焦虑是一种常见的情绪体验，表现为内心的不安、紧张和担忧。</p><p>适度的焦虑可以提高警觉性和应对能力，但过度焦虑则会影响日常生活。</p><p>常见的焦虑症状包括：</p><ul><li>持续的紧张和不安</li><li>难以集中注意力</li><li>睡眠问题</li><li>肌肉紧张</li><li>心跳加速</li></ul><p>如果您感到焦虑情绪影响了正常生活，建议寻求专业心理咨询帮助。</p>'
  },
  2: {
    title: '如何进行压力管理',
    date: '2024-01-10',
    content: '<p>压力管理是保持心理健康的重要技能。</p><p>有效的压力管理方法包括：</p><ul><li>时间管理：合理安排任务优先级</li><li>运动锻炼：释放内啡肽，改善心情</li><li>放松技巧：深呼吸、冥想、渐进性肌肉松弛</li><li>社交支持：与朋友和家人沟通</li><li>兴趣爱好：培养放松身心的爱好</li></ul><p>找到适合自己的压力管理方法，保持身心健康。</p>'
  },
  3: {
    title: '情绪调节的有效方法',
    date: '2024-01-08',
    content: '<p>情绪调节是指个体对自己情绪的感知、体验、表达和调节过程。</p><p>有效的情绪调节方法：</p><ul><li>情绪觉察：意识到自己的情绪状态</li><li>认知重构：改变消极的思维方式</li><li>情绪表达：适当地表达情绪</li><li>问题解决：积极解决引发情绪的问题</li><li>寻求支持：向他人寻求帮助</li></ul><p>学会情绪调节，让自己更加从容地面对生活中的挑战。</p>'
  },
  4: {
    title: '保持心理健康的小技巧',
    date: '2024-01-05',
    content: '<p>保持心理健康需要日常的关注和维护。</p><p>以下是一些实用的小技巧：</p><ul><li>保持规律的作息时间</li><li>均衡饮食，适度运动</li><li>培养积极的心态</li><li>建立良好的人际关系</li><li>学会放松和减压</li><li>定期自我反思</li><li>寻求专业帮助</li></ul><p>关注心理健康，享受美好生活。</p>'
  }
})

onMounted(() => {
  article.value = articles[articleId] || articles[1]
})
</script>

<style scoped>
.wiki-detail {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #1e4f9c;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  margin: 0 10px;
}

.content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #1e4f9c;
}

.meta {
  margin-bottom: 30px;
  color: #999;
  font-size: 14px;
}

.article-content {
  line-height: 1.8;
  color: #555;
  font-size: 16px;
}

.article-content p {
  margin-bottom: 20px;
}

.article-content ul {
  padding-left: 30px;
  margin-bottom: 20px;
}

.article-content li {
  margin-bottom: 10px;
}
</style>
