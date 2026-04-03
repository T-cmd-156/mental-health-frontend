/**
 * 与《后端接口API文档》一致的列表/成功判断工具
 */

export function isApiSuccess(res) {
  if (!res || typeof res !== 'object') return false
  const c = res.code
  return c === 200 || c === 0 || res.success === true
}

/** 解析统一响应里的 data（列表或分页） */
export function unwrapListPayload(data) {
  if (data == null) return []
  if (Array.isArray(data)) return data
  return data.list ?? data.records ?? data.data ?? []
}

export function normalizeNoticeItem(row) {
  if (!row || typeof row !== 'object') return row
  return {
    ...row,
    summary: row.summary ?? row.description ?? row.content ?? '',
    date: row.date ?? row.publishTime ?? row.publishTimeStr ?? row.createdAt ?? '',
  }
}

export function mapSelfHelpToPortalItem(row) {
  if (!row || typeof row !== 'object') return row
  const pt = row.publishTime ?? row.createTime
  const date =
    pt == null
      ? row.date ?? ''
      : typeof pt === 'string'
        ? pt
        : Array.isArray(pt)
          ? pt.slice(0, 3).join('-')
          : String(pt)
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? row.description ?? '',
    category: row.category ?? row.sourceOrg ?? '',
    date,
  }
}

export function mapActivityToPortalItem(row) {
  if (!row || typeof row !== 'object') return row
  return {
    id: row.id,
    title: row.title,
    date: row.time ?? row.date ?? row.startTime ?? '',
  }
}
