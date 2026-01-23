<template>
  <div class="peer-detail">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span>></span>
        <router-link to="/peer-support">朋辈互助</router-link>
        <span>></span>
        <span>{{ item.title }}</span>
      </div>

      <div class="content">
        <h1 class="title">{{ item.title }}</h1>
        <div class="item-content">
          <template v-if="item.type === 'schedule'">
            <div class="schedule-table">
              <h3>心理委员值班安排表</h3>
              <table>
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>值班人员</th>
                    <th>地点</th>
                    <th>联系方式</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in item.schedule" :key="index">
                    <td>{{ row.time }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.location }}</td>
                    <td>{{ row.contact }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template v-else-if="item.type === 'appointment'">
            <div class="appointment-info">
              <h3>朋辈咨询预约说明</h3>
              <div class="info-section">
                <h4>一、服务对象</h4>
                <p>全体在校学生</p>
              </div>
              <div class="info-section">
                <h4>二、服务内容</h4>
                <ul>
                  <li>日常心理困扰倾听</li>
                  <li>学习压力调节</li>
                  <li>人际关系问题</li>
                  <li>情绪管理指导</li>
                </ul>
              </div>
              <div class="info-section">
                <h4>三、预约方式</h4>
                <p>1. 现场预约：学生活动中心301室</p>
                <p>2. 电话预约：0591-12345678</p>
                <p>3. 线上预约：通过心理健康服务平台</p>
              </div>
              <div class="info-section">
                <h4>四、服务时间</h4>
                <p>每周一至周五 19:00-21:00</p>
              </div>
              <div class="info-section">
                <h4>五、注意事项</h4>
                <ul>
                  <li>请提前预约，按时到达</li>
                  <li>遵守咨询室相关规定</li>
                  <li>朋辈咨询不能替代专业心理咨询</li>
                  <li>如有严重心理问题，请转介专业心理咨询</li>
                </ul>
              </div>
            </div>
          </template>

          <template v-else-if="item.type === 'manual'">
            <div class="manual-content">
              <h3>互助知识手册</h3>
              <div class="chapter">
                <h4>第一章 朋辈互助的概念</h4>
                <p>朋辈互助是指具有相同背景或由于某种原因使具有共同语言的人在一起分享信息、观念或行为技能，以实现教育或自助目标的一种教育或干预模式。</p>
              </div>
              <div class="chapter">
                <h4>第二章 倾听的技巧</h4>
                <p>1. 专注：给予对方全部的注意力</p>
                <p>2. 共情：站在对方的角度理解感受</p>
                <p>3. 不评判：不对对方的经历和感受做出评价</p>
                <p>4. 反馈：适当给予回应和确认</p>
              </div>
              <div class="chapter">
                <h4>第三章 常见心理问题识别</h4>
                <p>1. 情绪低落、兴趣减退</p>
                <p>2. 睡眠障碍、食欲变化</p>
                <p>3. 社交退缩、不愿与人交流</p>
                <p>4. 学习成绩明显下降</p>
                <p>5. 谈论死亡或自杀</p>
              </div>
              <div class="chapter">
                <h4>第四章 转介原则</h4>
                <p>当发现以下情况时，应及时转介给专业心理咨询师：</p>
                <ul>
                  <li>有自杀或自伤倾向</li>
                  <li>严重的情绪障碍</li>
                  <li>精神疾病症状</li>
                  <li>超出自己能力范围的问题</li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const itemId = route.params.id;
const item = ref({
 title: '',
 type: '',
 schedule: [],
 content: ''
});
const items = {
 1: {
 title: '心理委员值班表',
 type: 'schedule',
 schedule: [
 { time: '周一 19:00-21:00', name: '张三', location: '学生活动中心301', contact: '13800138001' },
 { time: '周二 19:00-21:00', name: '李四', location: '学生活动中心301', contact: '13800138002' },
 { time: '周三 19:00-21:00', name: '王五', location: '学生活动中心301', contact: '13800138003' },
 { time: '周四 19:00-21:00', name: '赵六', location: '学生活动中心301', contact: '13800138004' },
 { time: '周五 19:00-21:00', name: '钱七', location: '学生活动中心301', contact: '13800138005' }
 ]
 },
 2: {
 title: '朋辈咨询预约',
 type: 'appointment',
 content: ''
 },
 3: {
 title: '互助知识手册',
 type: 'manual',
 content: ''
 }
});
onMounted(() => {
 item.value = items[itemId] || items[1];
});
</script>

<style scoped>
.peer-detail {
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
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #1e4f9c;
  text-align: center;
}

.schedule-table h3 {
  color: #1e4f9c;
  margin-bottom: 20px;
  font-size: 18px;
}

.schedule-table table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  padding: 15px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.schedule-table th {
  background: #f5f7fa;
  font-weight: bold;
  color: #333;
}

.schedule-table tr:hover {
  background: #f8f9fa;
}

.appointment-info h3 {
  color: #1e4f9c;
  margin-bottom: 25px;
  font-size: 20px;
  text-align: center;
}

.info-section {
  margin-bottom: 25px;
}

.info-section h4 {
  color: #1e4f9c;
  margin-bottom: 10px;
  font-size: 16px;
}

.info-section p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 8px;
}

.info-section ul {
  padding-left: 25px;
}

.info-section li {
  line-height: 1.8;
  color: #555;
  margin-bottom: 8px;
}

.manual-content h3 {
  color: #1e4f9c;
  margin-bottom: 25px;
  font-size: 20px;
  text-align: center;
}

.chapter {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.chapter h4 {
  color: #1e4f9c;
  margin-bottom: 15px;
  font-size: 16px;
}

.chapter p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 10px;
}

.chapter ul {
  padding-left: 25px;
}

.chapter li {
  line-height: 1.8;
  color: #555;
  margin-bottom: 8px;
}
</style>
