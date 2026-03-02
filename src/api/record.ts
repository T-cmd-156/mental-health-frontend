import {
  getRecordsByConsultant,
  getRecordsByStudent,
  createRecord,
  updateRecord,
  getRecordById,
  autosaveRecord,
} from '../mock/record'
import type { AppointmentRecord, RecordStatus } from '../types/record'

export function getRecordsByConsultantAsync(counselorId: string) {
  return getRecordsByConsultant(counselorId)
}

export function getRecordsByStudentAsync(studentId: string) {
  return getRecordsByStudent(studentId)
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
