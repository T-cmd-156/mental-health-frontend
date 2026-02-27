import {
  getRecordsByConsultant,
  getRecordsByStudent,
  createRecord,
  updateRecord,
  getRecordById,
  autosaveRecord,
} from '../mock/record'
import type { AppointmentRecord, RecordStatus } from '../types/record'

export function getRecordsByConsultantAsync(counselor_id: string) {
  return getRecordsByConsultant(counselor_id)
}

export function getRecordsByStudentAsync(student_id: string) {
  return getRecordsByStudent(student_id)
}

export function createRecordAsync(data: Partial<AppointmentRecord>) {
  return createRecord(data)
}

export function updateRecordAsync(id: string, status: RecordStatus, payload?: Partial<AppointmentRecord>) {
  return updateRecord(id, status, payload)
}

export function getRecordByIdAsync(id: string) {
  return getRecordById(id)
}

export function autosaveRecordAsync(id: string | null, payload: Partial<AppointmentRecord>) {
  // @ts-ignore
  return autosaveRecord(id, payload)
}
