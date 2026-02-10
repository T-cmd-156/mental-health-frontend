import type { Appointment } from '../types/appointment'

const KEY = 'MOCK_DB'

// 内存中的唯一 db
const state = {
  appointments: [] as Appointment[],
}

// ===== 初始化：只在第一次加载时，从 localStorage 读 =====
const raw = localStorage.getItem(KEY)
if (raw) {
  try {
    const data = JSON.parse(raw)
    if (Array.isArray(data.appointments)) {
      state.appointments = data.appointments
    }
  } catch (e) {
    console.warn('mock db 解析失败，已重置', e)
  }
}

// ===== 同步方法 =====
function persist() {
  localStorage.setItem(KEY, JSON.stringify(state))
}

// ===== 对外暴露的 db =====
export const db = {
  get appointments() {
    return state.appointments
  },
  set appointments(list: Appointment[]) {
    state.appointments = list
    persist()
  },
  pushAppointment(a: Appointment) {
    state.appointments.push(a)
    persist()
  },
  updateAppointment(id: string, updater: (a: Appointment) => void) {
    const item = state.appointments.find(i => i.id === id)
  if (item) {
    updater(item)
    persist()
    return true
  }
  return false
}
}
