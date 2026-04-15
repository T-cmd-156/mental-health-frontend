import request from './request.js'
import { isApiSuccess } from './helpers.js'
import {
  getCounselorIdForScheduleFilter,
  resolveCounselorRowIdForCaseQueries,
} from '../utils/counselorSession.js'
import type { Case } from '../types/case'

function formatCaseStatusLabel(code: string | undefined) {
  const st = String(code ?? '').toUpperCase()
  if (st === 'CLOSED') return '已结案'
  if (st === 'SUSPENDED') return '暂停'
  if (st === 'ONGOING') return '进行中'
  return code ? String(code) : '—'
}

function formatDateTime(ct: unknown): string {
  if (ct == null) return ''
  if (typeof ct === 'string') return ct.replace('T', ' ').slice(0, 19)
  return String(ct)
}

/** 对齐后端 CaseVO + 列表页常用别名字段 */
export function normalizeCaseListItem(vo: any) {
  if (!vo || typeof vo !== 'object') return vo
  const st = String(vo.status ?? '').toUpperCase()
  return {
    ...vo,
    student_name: vo.studentName ?? vo.student_name,
    student_id: vo.studentId ?? vo.student_id,
    counselor_id: vo.counselorId ?? vo.counselor_id,
    counselor_name: vo.counselorName ?? vo.counselor_name,
    case_title: vo.caseTitle ?? vo.case_title,
    description: vo.description ?? vo.caseDescription ?? '',
    created_at: formatDateTime(vo.createTime ?? vo.created_at),
    update_time: formatDateTime(vo.updateTime ?? vo.updated_at),
    start_date: vo.startDate ?? vo.start_date,
    close_date: vo.closeDate ?? vo.close_date,
    problem_type: vo.problemType ?? vo.problem_type,
    total_sessions: vo.totalSessions ?? vo.total_sessions,
    status: vo.status,
    status_label: formatCaseStatusLabel(vo.status),
    progress: vo.progress ?? '',
  }
}

function unwrapPageRecords(res: any): any[] {
  if (!res || typeof res !== 'object') return []
  const data = res.data
  if (data == null) return []
  const records =
    data.records ??
    data.list ??
    data.items ??
    data.rows
  if (Array.isArray(records)) return records
  if (Array.isArray(data)) return data
  return []
}

export type CaseListParams = {
  counselorId?: string
  /** 与 counselorId 一并传递，对齐 PageQueryDTO.userId（CaseListQueryDTO 继承链） */
  userId?: string
  studentId?: string
  caseStatus?: string
  problemType?: string
  page?: number
  pageSize?: number
}

/** GET /api/case/list → R<PageResult>，参数对齐 CaseListQueryDTO / PageQueryDTO */
export async function fetchCaseListFromApi(params?: CaseListParams) {
  const p = params ?? {}
  const q: Record<string, string | number> = {
    page: p.page ?? 1,
    pageSize: p.pageSize ?? 200,
  }
  if (p.counselorId) {
    const cid = String(p.counselorId).trim()
    q.counselorId = cid
    /** 父类 PageQueryDTO.userId：部分场景下与 counselorId 同源，便于 Spring 绑定到期望字段 */
    q.userId = (p.userId != null && String(p.userId).trim()) ? String(p.userId).trim() : cid
  }
  if (p.studentId) q.studentId = String(p.studentId).trim()
  if (p.caseStatus) q.caseStatus = String(p.caseStatus).trim()
  if (p.problemType) q.problemType = String(p.problemType).trim()

  const res: any = await request.get('/api/case/list', { params: q })
  const raw = unwrapPageRecords(res)
  const list = raw.map((row) => normalizeCaseListItem(row))
  return {
    ...res,
    data: list,
    total: res?.data?.total,
  }
}

/**
 * 管理端个案列表：咨询师仅查本人（传 counselorId）；中心/管理员不传则查全部。
 * counselorId 经 resolveCounselorRowIdForCaseQueries 与 counselor_info 对齐。
 */
export async function fetchCases(): Promise<any[]> {
  const role =
    (typeof localStorage !== 'undefined' && localStorage.getItem('user_role')) ||
    ''
  const r = String(role).toLowerCase()
  let counselorId = ''
  if (r === 'counselor') {
    counselorId = await resolveCounselorRowIdForCaseQueries(
      getCounselorIdForScheduleFilter(),
    )
    if (!counselorId) {
      return []
    }
  }
  const res = await fetchCaseListFromApi({
    ...(counselorId ? { counselorId } : {}),
    page: 1,
    pageSize: 200,
  })
  if (!isApiSuccess(res)) {
    throw new Error(res?.msg || res?.message || '加载个案失败')
  }
  return res.data as any[]
}

export async function fetchCaseDetail(id: string) {
  const res: any = await request.get('/api/case/detail', { params: { id } })
  if (!isApiSuccess(res) || res.data == null) {
    throw new Error(res?.msg || res?.message || '个案不存在')
  }
  return normalizeCaseListItem(res.data)
}

/** GET /api/case/stats */
export async function fetchCaseStats(): Promise<any[]> {
  const role =
    (typeof localStorage !== 'undefined' && localStorage.getItem('user_role')) ||
    ''
  const r = String(role).toLowerCase()
  let counselorId = ''
  if (r === 'counselor') {
    counselorId = await resolveCounselorRowIdForCaseQueries(
      getCounselorIdForScheduleFilter(),
    )
  }
  const res: any = await request.get('/api/case/stats', {
    params: counselorId ? { counselorId } : {},
  })
  if (!isApiSuccess(res)) return []
  const list = Array.isArray(res.data) ? res.data : []
  return list.map((row: any) => ({
    status: formatCaseStatusLabel(row.status),
    count: Number(row.count) || 0,
    status_code: row.status,
  }))
}

/** 咨询师工作台等：按咨询师拉列表，返回形态兼容原 mock `{ code, data }` */
export function getCasesByConsultantAsync(counselorId?: string) {
  const hint =
    counselorId != null && String(counselorId).trim()
      ? counselorId
      : getCounselorIdForScheduleFilter()
  return (async () => {
    const id = await resolveCounselorRowIdForCaseQueries(hint)
    if (!id) {
      return { code: 200, data: [], msg: 'ok' }
    }
    const res = await fetchCaseListFromApi({
      counselorId: id,
      page: 1,
      pageSize: 200,
    })
    return {
      code: res.code,
      data: res.data,
      msg: res.msg,
    }
  })()
}

export async function getCaseDetailAsync(id: string) {
  const data = await fetchCaseDetail(id)
  return { code: 200, data }
}

export async function createCaseAsync(data: Partial<Case> & Record<string, any>) {
  const counselorId = await resolveCounselorRowIdForCaseQueries(
    data.counselorId ??
      data.counselor_id ??
      getCounselorIdForScheduleFilter(),
  )
  const body = {
    studentId: data.studentId ?? data.student_id,
    counselorId,
    caseTitle: data.caseTitle ?? data.case_title ?? '新建个案',
    problemType: data.problemType ?? data.problem_type ?? '',
    caseDescription:
      data.caseDescription ?? data.description ?? '',
    startDate: data.startDate ?? data.start_date ?? '',
  }
  if (!body.studentId) {
    return Promise.reject(new Error('学生ID不能为空'))
  }
  if (!body.counselorId) {
    return Promise.reject(new Error('咨询师ID不能为空'))
  }
  return request.post('/api/case/create', body)
}

export async function updateCaseAsync(
  id: string,
  payload: Partial<Case> & Record<string, any>,
) {
  const body: Record<string, unknown> = {
    caseId: id,
    caseTitle: payload.caseTitle ?? payload.case_title,
    caseStatus: payload.caseStatus ?? payload.status,
    problemType: payload.problemType ?? payload.problem_type,
    caseDescription:
      payload.caseDescription ?? payload.description,
    closeDate: payload.closeDate ?? payload.close_date,
  }
  Object.keys(body).forEach((k) => {
    if (body[k] === undefined) delete body[k]
  })
  return request.put('/api/case/update', body)
}
