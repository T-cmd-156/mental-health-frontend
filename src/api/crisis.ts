// 列表、详情mock实现
export async function fetchCrises() {
  return [
    { id: 'crisis001', student_name: '王五', level: '高', status: '干预中' },
    { id: 'crisis002', student_name: '赵六', level: '中', status: '已结案' }
  ]
}

export async function fetchCrisisDetail(id: string) {
  return { id, student_name: '王五', level: '高', status: '干预中' }
}
import {
  getCrisesByConsultant,
  getCrisisDetail,
  createCrisis,
  updateCrisis,
} from '../mock/crisis'
import type { Crisis } from '../types/crisis'

export function getCrisesByConsultantAsync(counselor_id: string) {
  return getCrisesByConsultant(counselor_id)
}

export function getCrisisDetailAsync(id: string) {
  return getCrisisDetail(id)
}

export function createCrisisAsync(data: Partial<Crisis>) {
  return createCrisis(data as any)
}

export function updateCrisisAsync(id: string, payload: Partial<Crisis>) {
  return updateCrisis(id, payload)
}
