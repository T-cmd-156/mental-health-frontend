<template>
  <el-card>
    <h2>测评访谈管理</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="心理普查" name="survey">
        <el-table :data="surveyList" style="width:100%">
          <el-table-column prop="id" label="普查编号" />
          <el-table-column prop="name" label="普查名称" />
          <el-table-column prop="date" label="时间" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="预警提醒" name="warning">
        <el-table :data="warningList" style="width:100%">
          <el-table-column prop="id" label="提醒编号" />
          <el-table-column prop="name" label="提醒内容" />
          <el-table-column prop="date" label="时间" />
          <el-table-column prop="level" label="等级" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="个体测评报告" name="individual">
        <el-table :data="individualReports" style="width:100%">
          <el-table-column prop="id" label="报告编号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="score" label="得分" />
          <el-table-column prop="result" label="结论" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="整体测评报告" name="overall">
        <el-table :data="overallReports" style="width:100%">
          <el-table-column prop="id" label="报告编号" />
          <el-table-column prop="group" label="群体" />
          <el-table-column prop="avgScore" label="平均分" />
          <el-table-column prop="result" label="结论" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="综合分析" name="analysis">
        <el-table :data="analysisList" style="width:100%">
          <el-table-column prop="id" label="分析编号" />
          <el-table-column prop="topic" label="分析主题" />
          <el-table-column prop="date" label="时间" />
          <el-table-column prop="summary" label="摘要" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="数据统计" name="stat">
        <el-table :data="statList" style="width:100%">
          <el-table-column prop="type" label="统计类型" />
          <el-table-column prop="count" label="数量" />
          <el-table-column prop="date" label="统计时间" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getSurveyList,
  getWarningList,
  getIndividualReports,
  getOverallReports,
  getAnalysisList,
  getStatList
} from '../../api/assessment'

const activeTab = ref('survey')
const surveyList = ref<{ id: string; name: string; date: string; status: string }[]>([])
const warningList = ref<{ id: string; name: string; date: string; level: string }[]>([])
const individualReports = ref<{ id: string; name: string; score: number; result: string }[]>([])
const overallReports = ref<{ id: string; group: string; avgScore: number; result: string }[]>([])
const analysisList = ref<{ id: string; topic: string; date: string; summary: string }[]>([])
const statList = ref<{ type: string; count: number; date: string }[]>([])

const loadData = async (tab: string) => {
  switch(tab) {
    case 'survey':
      surveyList.value = await getSurveyList();
      break;
    case 'warning':
      warningList.value = await getWarningList();
      break;
    case 'individual':
      individualReports.value = await getIndividualReports();
      break;
    case 'overall':
      overallReports.value = await getOverallReports();
      break;
    case 'analysis':
      analysisList.value = await getAnalysisList();
      break;
    case 'stat':
      statList.value = await getStatList();
      break;
  }
}

onMounted(() => {
  loadData(activeTab.value)
})

// tab切换时加载数据
const handleTabChange = (tab: string) => {
  loadData(tab)
}
</script>
