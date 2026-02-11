import { fetchSchedule, updateSchedule } from '../mock/schedule'

export function getScheduleAsync() {
  return fetchSchedule()
}

export function updateScheduleAsync(data: { date: string; time: string; counselor_id: string; consultant_name: string }) {
  return updateSchedule(data)
}
