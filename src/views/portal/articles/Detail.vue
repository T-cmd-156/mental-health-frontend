<template>
  <div class="article-detail">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span>></span>
        <router-link to="/articles">心理美文</router-link>
        <span>></span>
        <span>{{ article.title }}</span>
      </div>

      <div class="content">
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta">
          <span class="author">作者：{{ article.author }}</span>
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
  author: '',
  date: '',
  content: ''
})

const articles = {
  1: {
    title: '给自己一段温柔时光',
    author: '心灵驿站',
    date: '2024-01-20',
    content: '<p>在这个快节奏的时代，我们总是忙于追逐，却忘记了停下来，给自己一段温柔时光。</p><p>温柔，是对自己的慈悲。当我们疲惫时，允许自己休息；当我们犯错时，学会原谅自己；当我们迷茫时，给自己一些时间思考。</p><p>给自己一段温柔时光，泡一杯热茶，读一本好书，听一首轻音乐，或者只是静静地坐着，感受内心的平静。</p><p>温柔不是软弱，而是一种力量，一种与自己和解的力量。当我们学会温柔地对待自己，才能更好地爱这个世界。</p><p>从今天开始，给自己一段温柔时光，让心灵得到滋养，让生命更加丰盈。</p>'
  },
  2: {
    title: '与情绪和解',
    author: '心路',
    date: '2024-01-18',
    content: '<p>情绪是我们内心的信使，每一种情绪都有它的意义。</p><p>我们常常试图压抑负面情绪，以为这样就能变得强大。但事实上，压抑情绪只会让它们在内心积累，最终以更强烈的方式爆发。</p><p>与情绪和解，意味着接纳自己的所有情绪，无论是快乐还是悲伤，愤怒还是恐惧。每一种情绪都是正常的，都是我们人性的一部分。</p><p>当你感到悲伤时，允许自己哭泣；当你感到愤怒时，找到健康的方式表达；当你感到恐惧时，正视它而不是逃避。</p><p>与情绪和解，不是要消除负面情绪，而是学会与它们共处，让它们成为我们成长的助力。</p>'
  },
  3: {
    title: '心灵的栖息地',
    author: '静心',
    date: '2024-01-15',
    content: '<p>每个人的心灵都需要一个栖息地，一个可以安放疲惫灵魂的地方。</p><p>这个栖息地可以是一间安静的书房，可以是一片开满鲜花的花园，可以是一本引人入胜的书，也可以是一段悠扬的音乐。</p><p>在这个栖息地里，我们可以暂时远离外界的喧嚣，与自己对话，倾听内心的声音。</p><p>心灵的栖息地，是我们力量的源泉。当我们在这里得到滋养和恢复，就能更有勇气面对生活的挑战。</p><p>请为自己的心灵找到一个栖息地，常常回去看看，让它保持鲜活和健康。</p>'
  },
  4: {
    title: '倾听内心的声音',
    author: '心语',
    date: '2024-01-12',
    content: '<p>我们的内心深处，总有一个声音在说话。它是我们真实的渴望，是我们直觉的指引。</p><p>然而，在纷繁复杂的世界中，我们常常忽略这个声音，被外界的期待和评价所左右。</p><p>倾听内心的声音，需要我们静下心来，排除外界的干扰。在安静中，我们才能听到那个真实的自己。</p><p>内心的声音可能不会告诉你如何成功，但它会告诉你什么是真正让你快乐的；它可能不会告诉你别人期待你成为什么样的人，但它会告诉你你想成为什么样的人。</p><p>学会倾听内心的声音，跟随它的指引，你会发现生活变得更加清晰和有意义。</p>'
  }
})

onMounted(() => {
  article.value = articles[articleId] || articles[1]
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
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
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #1e4f9c;
  text-align: center;
}

.meta {
  text-align: center;
  margin-bottom: 30px;
  color: #999;
  font-size: 14px;
}

.meta span {
  margin: 0 15px;
}

.article-content {
  line-height: 2;
  color: #555;
  font-size: 16px;
  text-align: justify;
}

.article-content p {
  margin-bottom: 25px;
  text-indent: 2em;
}
</style>
