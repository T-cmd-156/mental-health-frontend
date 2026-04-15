import request from './request.js'

export function getStatsOverview(params) {
  return request.get('/api/stats/overview', { params })
}

export function getStatisticsFunnel(params) {
  return request.get('/api/statistics/funnel', { params })
}

export function getStatisticsCollege(params) {
  return request.get('/api/statistics/college', { params })
}

export function getStatisticsTrend(params) {
  return request.get('/api/statistics/trend', { params })
}
