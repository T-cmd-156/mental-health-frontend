<template>
  <div class="notice-detail">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span>></span>
        <router-link to="/notices">通知公告</router-link>
        <span>></span>
        <span>{{ notice.title }}</span>
      </div>

      <div class="content">
        <h1 class="title">{{ notice.title }}</h1>
        <div class="meta">
          <span class="date">发布时间：{{ notice.date }}</span>
          <span class="source">来源：{{ notice.source }}</span>
        </div>
        <div class="divider"></div>
        <div class="notice-content">
          <p v-html="notice.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const noticeId = route.params.id

const notice = ref({
  title: '',
  date: '',
  source: '',
  content: ''
})

const notices = {
  1: {
    title: '关于开放本学期心理咨询预约的通知',
    date: '2024-02-20',
    source: '心理健康教育中心',
    content: '<p>各位同学：</p><p>新学期伊始，为了更好地服务广大同学的心理健康需求，我校心理健康教育中心将开放本学期心理咨询预约服务。现将有关事项通知如下：</p><h3>一、预约时间</h3><p>2024年2月26日起，每周一至周五 8:30-17:30</p><h3>二、预约方式</h3><p>1. 线上预约：通过学校心理健康服务平台进行预约</p><p>2. 电话预约：0591-12345678</p><p>3. 现场预约：学生活动中心301室</p><h3>三、注意事项</h3><p>1. 首次预约请携带学生证</p><p>2. 请提前10分钟到达咨询室</p><p>3. 如需取消预约，请提前24小时通知</p><p>4. 遵守咨询室相关规定</p><h3>四、咨询地点</h3><p>学生活动中心3楼心理咨询室</p><p>欢迎有需要的同学积极预约，我们将竭诚为您服务！</p><p>心理健康教育中心</p><p>2024年2月20日</p>'
  },
  2: {
    title: '心理健康月活动安排',
    date: '2024-03-01',
    source: '心理健康教育中心',
    content: '<p>各位同学：</p><p>为进一步加强我校心理健康教育工作，提高学生心理健康水平，学校决定于3月开展心理健康月系列活动。现将活动安排通知如下：</p><h3>一、活动主题</h3><p>"阳光心灵，健康成长"</p><h3>二、活动时间</h3><p>2024年3月1日 - 3月31日</p><h3>三、活动内容</h3><p>1. 心理健康讲座（3月5日 19:00 学术报告厅）</p><p>2. 心理电影赏析（3月12日 19:00 学生活动中心）</p><p>3. 心理健康知识竞赛（3月19日 14:00 图书馆报告厅）</p><p>4. 团体心理辅导（3月26日 15:00 心理咨询中心）</p><p>5. 心理健康宣传展览（整个3月 校园主干道）</p><h3>四、参与方式</h3><p>请关注学校官网和微信公众号通知，按时报名参加。</p><p>希望全体同学积极参与，共同营造健康向上的心理氛围！</p><p>心理健康教育中心</p><p>2024年3月1日</p>'
  },
  3: {
    title: '心理委员培训通知',
    date: '2024-02-28',
    source: '心理健康教育中心',
    content: '<p>各学院心理委员：</p><p>为提高心理委员的专业素养和工作能力，更好地开展班级心理健康工作，学校决定举办心理委员培训。现将有关事项通知如下：</p><h3>一、培训对象</h3><p>全体班级心理委员</p><h3>二、培训时间</h3><p>2024年3月8日 14:30-17:00</p><h3>三、培训地点</h3><p>学生活动中心201会议室</p><h3>四、培训内容</h3><p>1. 心理健康基础知识</p><p>2. 心理问题识别与应对</p><p>3. 朋辈辅导技巧</p><p>4. 危机干预流程</p><h3>五、注意事项</h3><p>1. 请提前15分钟到场签到</p><p>2. 携带笔记本和笔</p><p>3. 培训结束后需提交心得体会</p><p>请各位心理委员准时参加，认真学习，提高自身工作能力。</p><p>心理健康教育中心</p><p>2024年2月28日</p>'
  },
  4: {
    title: '寒假心理咨询服务安排',
    date: '2024-01-15',
    source: '心理健康教育中心',
    content: '<p>各位同学：</p><p>寒假期间，为保障同学们的心理健康需求，心理健康教育中心将提供心理咨询服务。现将服务安排通知如下：</p><h3>一、服务时间</h3><p>2024年1月20日 - 2月25日</p><p>每周二、周四 9:00-11:30，14:30-17:00</p><h3>二、服务方式</h3><p>1. 线上咨询：通过腾讯会议进行视频咨询</p><p>2. 电话咨询：0591-12345678</p><h3>三、预约方式</h3><p>请提前1天通过以下方式预约：</p><p>1. 电话预约：0591-12345678</p><p>2. 邮箱预约：psy@university.edu.cn</p><h3>四、注意事项</h3><p>1. 请提前准备好咨询相关问题</p><p>2. 线上咨询请确保网络畅通</p><p>3. 遵守咨询时间，按时参加</p><p>如有紧急情况，请随时联系我们。祝同学们寒假愉快！</p><p>心理健康教育中心</p><p>2024年1月15日</p>'
  }
})

onMounted(() => {
  notice.value = notices[noticeId] || notices[1]
})
</script>

<style scoped>
.notice-detail {
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
  border-bottom: 3px solid #1e4f9c;
  text-align: center;
}

.meta {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.meta span {
  margin: 0 20px;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin-bottom: 30px;
}

.notice-content {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.notice-content p {
  margin-bottom: 20px;
  text-indent: 2em;
}

.notice-content h3 {
  color: #1e4f9c;
  margin: 25px 0 15px 0;
  font-size: 18px;
}
</style>
