<template>
  <div class="page-wrap">
    <div class="page-head">
      <div class="head-main">
        <h2>测评访谈管理</h2>
        <p class="page-desc">管理心理普查、预警提醒、个体与整体测评报告。</p>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="心理普查" name="survey">
          <el-table :data="surveyList" stripe style="width: 100%">
            <el-table-column prop="id" label="普查编号" width="120" />
            <el-table-column prop="name" label="普查名称" min-width="180" />
            <el-table-column prop="date" label="时间" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'primary'" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="预警提醒" name="warning">
          <el-table :data="warningList" stripe style="width: 100%">
            <el-table-column prop="id" label="提醒编号" width="120" />
            <el-table-column prop="name" label="提醒内容" min-width="200" />
            <el-table-column prop="date" label="时间" width="120" />
            <el-table-column prop="level" label="等级" width="100">
              <template #default="{ row }">
                <el-tag :type="getLevelType(row.level)" size="small">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="个体测评报告" name="individual">
          <el-table :data="individualReports" stripe style="width: 100%">
            <el-table-column prop="id" label="报告编号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="score" label="得分" width="80" />
            <el-table-column prop="result" label="结论" min-width="200" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="整体测评报告" name="overall">
          <el-table :data="overallReports" stripe style="width: 100%">
            <el-table-column prop="id" label="报告编号" width="120" />
            <el-table-column prop="group" label="群体" width="120" />
            <el-table-column prop="avgScore" label="平均分" width="100" />
            <el-table-column prop="result" label="结论" min-width="200" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="综合分析" name="analysis">
          <el-table :data="analysisList" stripe style="width: 100%">
            <el-table-column prop="id" label="分析编号" width="120" />
            <el-table-column prop="topic" label="分析主题" min-width="180" />
            <el-table-column prop="date" label="时间" width="120" />
            <el-table-column prop="summary" label="摘要" min-width="200" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据统计" name="stat">
          <el-table :data="statList" stripe style="width: 100%">
            <el-table-column prop="type" label="统计类型" width="140" />
            <el-table-column prop="count" label="数量" width="100" />
            <el-table-column prop="date" label="统计时间" width="160" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  getSurveyList,
  getWarningList,
  getIndividualReports,
  getOverallReports,
  getAnalysisList,
  getStatList,
} from '../../api/assessment'

const activeTab = ref('survey')
const surveyList = ref<{ id: string; name: string; date: string; status: string }[]>([])
const warningList = ref<{ id: string; name: string; date: string; level: string }[]>([])
const individualReports = ref<{ id: string; name: string; score: number; result: string }[]>([])
const overallReports = ref<{ id: string; group: string; avgScore: number; result: string }[]>([])
const analysisList = ref<{ id: string; topic: string; date: string; summary: string }[]>([])
const statList = ref<{ type: string; count: number; date: string }[]>([])

function getLevelType(level: string) {
  const map: Record<string, string> = {
    高: 'danger',
    中: 'warning',
    低: 'success',
  }
  return map[level] || 'info'
}

async function loadData(tab: string) {
  try {
    switch (tab) {
      case 'survey': {
        surveyList.value = (await getSurveyList()) as typeof surveyList.value
        break
      }
      case 'warning': {
        warningList.value = (await getWarningList()) as typeof warningList.value
        break
      }
      case 'individual': {
        individualReports.value = (await getIndividualReports()) as typeof individualReports.value
        break
      }
      case 'overall': {
        overallReports.value = (await getOverallReports()) as typeof overallReports.value
        break
      }
      case 'analysis': {
        analysisList.value = (await getAnalysisList()) as typeof analysisList.value
        break
      }
      case 'stat': {
        statList.value = (await getStatList()) as typeof statList.value
        break
      }
    }
  } catch (_) {
    if (tab === 'survey') surveyList.value = []
    if (tab === 'warning') warningList.value = []
    if (tab === 'individual') individualReports.value = []
    if (tab === 'overall') overallReports.value = []
    if (tab === 'analysis') analysisList.value = []
    if (tab === 'stat') statList.value = []
  }
}

watch(activeTab, (val) => loadData(val))
onMounted(() => loadData(activeTab.value))

</script>

<style scoped>
.page-wrap {
  max-width: 1000px;
  padding: 0;
}

.page-head {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border-radius: 14px;
  border: 1px solid #bae6fd;
}

.head-main h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.table-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}
</style>
