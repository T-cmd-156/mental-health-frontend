// src/api/assessment.ts
// 测评管理相关API（mock实现）
import { ref } from 'vue'

export function getSurveyList() {
  return Promise.resolve([
    { id: 's001', name: '2026心理普查', date: '2026-02-01', status: '已完成' },
    { id: 's002', name: '2025心理普查', date: '2025-02-01', status: '已完成' }
  ])
}

export function getWarningList() {
  return Promise.resolve([
    { id: 'w001', name: '高危人群提醒', date: '2026-02-10', level: '高' },
    { id: 'w002', name: '压力过大提醒', date: '2026-02-05', level: '中' }
  ])
}

export function getIndividualReports() {
  return Promise.resolve([
    { id: 'i001', name: '张三', score: 85, result: '心理健康' },
    { id: 'i002', name: '李四', score: 70, result: '压力较大' }
  ])
}

export function getOverallReports() {
  return Promise.resolve([
    { id: 'o001', group: '2026级', avgScore: 78, result: '整体健康' },
    { id: 'o002', group: '2025级', avgScore: 65, result: '压力偏高' }
  ])
}

export function getAnalysisList() {
  return Promise.resolve([
    { id: 'an001', topic: '年度心理分析', date: '2026-02-15', summary: '整体心理状况良好' },
    { id: 'an002', topic: '压力分析', date: '2026-02-10', summary: '部分学生压力较大' }
  ])
}

export function getStatList() {
  return Promise.resolve([
    { type: '测评总数', count: 1200, date: '2026-02-27' },
    { type: '高危人数', count: 50, date: '2026-02-27' }
  ])
}
