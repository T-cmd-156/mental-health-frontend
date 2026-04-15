/**
 * 读取 OpenAPI 3 规范（支持 OPENAPI_PATH、独立行 // 注释），
 * 对规范中的路径逐一发起请求，可用咨询师 / 管理员 JWT，或无 Token 全量探测（便于连通性测试）。
 *
 * 用法：
 *   cd mental-health-frontend-min (2)
 *   node scripts/openapi-smoke-roles.mjs
 *
 * 环境变量：
 *   OPENAPI_PATH=openapi.json          ; 相对项目根或绝对路径；默认 openapi.json，其次尝试 ../openapi (3).json
 *   SMOKE_BASE_URL=http://localhost:8080
 *   SMOKE_TOKEN_COUNSELOR=...
 *   SMOKE_TOKEN_ADMIN=...
 *   未设置 SMOKE_TOKEN_* 时，自动以无 Token 方式每种方法请求一次（探测网络连通与 401 等）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function resolveOpenapiPath() {
  const envPath = process.env.OPENAPI_PATH
  if (envPath) {
    const abs = path.isAbsolute(envPath) ? envPath : path.join(root, envPath)
    if (fs.existsSync(abs)) return abs
    throw new Error(`OPENAPI_PATH 文件不存在: ${abs}`)
  }
  const candidates = [
    path.join(root, 'openapi.json'),
    path.join(root, '..', 'openapi (3).json'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return path.resolve(p)
  }
  throw new Error(`未找到 openapi.json，请将 openapi (3).json 复制为 ${path.join(root, 'openapi.json')} 或设置 OPENAPI_PATH`)
}

const openapiPath = resolveOpenapiPath()

const BASE =
  process.env.SMOKE_BASE_URL ||
  'http://localhost:8080'

const TOKENS = {
  COUNSELOR: process.env.SMOKE_TOKEN_COUNSELOR || '',
  ADMIN: process.env.SMOKE_TOKEN_ADMIN || '',
}

/** 无任何 JWT 时每接口探测一次（连通性）；若设置了 COUNSELOR/ADMIN 则不再重复 ANON */
const RUN_ANON = !TOKENS.COUNSELOR && !TOKENS.ADMIN

function stripJsonComments(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n')
}

function placeholderForSchema(param) {
  const s = param.schema || {}
  const t = s.type
  const fmt = s.format
  const name = (param.name || '').toLowerCase()
  if (param.in === 'path') {
    if (name.includes('studentid') || name.includes('id') || fmt === 'uuid')
      return '00000000-0000-0000-0000-000000000001'
    return '1'
  }
  if (t === 'integer' || t === 'number') {
    if (name.includes('page')) return 1
    if (name.includes('pagesize') || name.includes('size')) return 10
    return 1
  }
  if (t === 'boolean') return true
  return 'test'
}

function buildUrlAndQuery(pathKey, parameters = []) {
  let pth = pathKey
  const search = new URLSearchParams()
  for (const param of parameters) {
    if (param.in === 'path') {
      const v = encodeURIComponent(
        String(placeholderForSchema(param)),
      )
      pth = pth.replace(`{${param.name}}`, v)
    } else if (param.in === 'query') {
      const v = placeholderForSchema(param)
      if (param.required) search.set(param.name, String(v))
      else {
        // 可选：不传，减少噪声；部分列表接口无参也可 200
      }
    }
  }
  const names = new Set((parameters || []).map((p) => p.name))
  if (names.has('page') && !search.has('page')) search.set('page', '1')
  if (names.has('pageSize') && !search.has('pageSize')) search.set('pageSize', '20')
  const q = search.toString()
  return q ? `${pth}?${q}` : pth
}

function hasJsonBody(op) {
  const rb = op.requestBody?.content || {}
  return !!(rb['application/json'] || rb['*/*'])
}

async function tryRequest(method, urlPath, op, role, token, tagLabel) {
  const m = method.toUpperCase()
  const headers = {
    Accept: '*/*',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let body
  if (hasJsonBody(op) && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(m)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify({})
  }

  const url = `${BASE.replace(/\/$/, '')}${urlPath}`
  const init = { method: m, headers }
  if (body) init.body = body

  try {
    const res = await fetch(url, init)
    const buf = await res.arrayBuffer()
    const text = new TextDecoder().decode(buf)
    let snippet = text.slice(0, 120).replace(/\s+/g, ' ')
    if (!snippet && res.status === 200 && buf.byteLength > 0) snippet = `[binary ${buf.byteLength} bytes]`
    return {
      role,
      tags: tagLabel,
      method: m,
      path: urlPath,
      status: res.status,
      ok: res.ok,
      snippet,
    }
  } catch (e) {
    return {
      role,
      tags: tagLabel,
      method: m,
      path: urlPath,
      status: -1,
      ok: false,
      snippet: e?.message || String(e),
    }
  }
}

function isAcceptableFailure(r) {
  if (r.ok) return false
  const s = r.status
  /* 400 参数、404 占位 ID、401/403 未登录、415 类型、422 校验、网络错误 */
  return [400, 401, 403, 404, 415, 422, -1].includes(s)
}

async function main() {
  const raw = fs.readFileSync(openapiPath, 'utf8')
  const spec = JSON.parse(stripJsonComments(raw))
  const paths = spec.paths || {}

  console.log('OpenAPI:', openapiPath)
  console.log('info:', spec.info?.title, spec.info?.version)

  const rows = []
  for (const [pathKey, pathItem] of Object.entries(paths)) {
    for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
      const op = pathItem[method]
      if (!op) continue
      const params = op.parameters || []
      const urlPath = buildUrlAndQuery(pathKey, params)
      const tagLabel = (op.tags || []).join('|')

      if (TOKENS.COUNSELOR) {
        rows.push(await tryRequest(method, urlPath, op, 'COUNSELOR', TOKENS.COUNSELOR, tagLabel))
      }
      if (TOKENS.ADMIN) {
        rows.push(await tryRequest(method, urlPath, op, 'ADMIN', TOKENS.ADMIN, tagLabel))
      }
      if (RUN_ANON) {
        rows.push(await tryRequest(method, urlPath, op, 'ANON', '', tagLabel))
      }
    }
  }

  const bad = rows.filter((r) => isAcceptableFailure(r) === false && !r.ok)

  console.log('--- openapi smoke ---')
  console.log('BASE:', BASE)
  console.log('total requests:', rows.length)
  console.log('failed (not in acceptable list):', bad.length)
  for (const r of bad.slice(0, 100)) {
    console.log([r.role, r.method, r.status, r.path].join(' | '), '|', r.snippet)
  }
  if (bad.length > 100) console.log('... and', bad.length - 100, 'more')

  const out = path.join(root, 'tmp-openapi-smoke-results.json')
  fs.writeFileSync(out, JSON.stringify({ base: BASE, openapiPath, rows, badCount: bad.length }, null, 2), 'utf8')
  console.log('wrote', out)

  if (bad.length > 0) {
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
