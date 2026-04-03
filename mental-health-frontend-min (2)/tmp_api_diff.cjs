const fs = require('fs');
const path = require('path');

const root = process.argv[2];
if (!root) {
  console.error('Usage: node tmp_api_diff.cjs <root>');
  process.exit(1);
}

const openapiPath = path.join(root, 'Default module.openapi.json');
const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

const docOps = [];
for (const [p, methods] of Object.entries(openapi.paths || {})) {
  for (const [m, op] of Object.entries(methods || {})) {
    docOps.push({
      method: m.toUpperCase(),
      path: p,
      tag: (op.tags && op.tags[0]) || '',
      summary: op.summary || ''
    });
  }
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(js|ts|vue)$/.test(name)) out.push(full);
  }
  return out;
}

const files = walk(path.join(root, 'src'));
const codeOps = [];

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const txt = fs.readFileSync(file, 'utf8');

  const reCall = /request\s*\.\s*(get|post|put|delete|patch)\s*\(\s*['\"](\/api\/[A-Za-z0-9_\-\/{\}\?=&\.]+)['\"]/g;
  let m;
  while ((m = reCall.exec(txt)) !== null) {
    codeOps.push({ method: m[1].toUpperCase(), path: m[2], file: rel });
  }

  const reObj = /request\s*\(\s*\{[\s\S]*?url\s*:\s*['\"](\/api\/[A-Za-z0-9_\-\/{\}\?=&\.]+)['\"][\s\S]*?method\s*:\s*['\"](get|post|put|delete|patch)['\"][\s\S]*?\}\s*\)/g;
  while ((m = reObj.exec(txt)) !== null) {
    codeOps.push({ method: m[2].toUpperCase(), path: m[1], file: rel });
  }

  const reFetch = /fetch\s*\(\s*['\"](\/api\/[A-Za-z0-9_\-\/{\}\?=&\.]+)['\"]/g;
  while ((m = reFetch.exec(txt)) !== null) {
    codeOps.push({ method: 'GET', path: m[1], file: rel });
  }
}

function normalizePath(p) {
  if (!p) return p;
  return p.replace(/\?.*$/, '').replace(/\/\d+(?=\/|$)/g, '/{id}');
}

const docSet = new Set(docOps.map((x) => `${x.method} ${x.path}`));
const docPathSet = new Set(docOps.map((x) => x.path));

const codeNorm = codeOps.map((x) => ({ ...x, normPath: normalizePath(x.path) }));
const codeSet = new Set(codeNorm.map((x) => `${x.method} ${x.normPath}`));

const missing = docOps.filter((x) => !codeSet.has(`${x.method} ${x.path}`));
const undocumented = [...codeSet]
  .filter((k) => {
    const i = k.indexOf(' ');
    const method = k.slice(0, i);
    const p = k.slice(i + 1);
    return !docSet.has(`${method} ${p}`) && !docPathSet.has(p);
  })
  .map((k) => {
    const i = k.indexOf(' ');
    return { method: k.slice(0, i), path: k.slice(i + 1) };
  })
  .sort((a, b) => (a.path + a.method).localeCompare(b.path + b.method));

const missingByTag = new Map();
for (const item of missing) {
  const key = item.tag || '未分组';
  if (!missingByTag.has(key)) missingByTag.set(key, []);
  missingByTag.get(key).push(item);
}

const lines = [];
lines.push('# API 对比报告');
lines.push('');
lines.push(`- 文档接口总数: ${docOps.length}`);
lines.push(`- 代码识别到接口总数(去重后): ${codeSet.size}`);
lines.push(`- 文档缺失接口数: ${missing.length}`);
lines.push(`- 代码中非文档接口数: ${undocumented.length}`);
lines.push('');
lines.push('## 文档缺失接口（按功能分组）');
lines.push('');
for (const [tag, list] of [...missingByTag.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`### ${tag} (${list.length})`);
  for (const it of list.sort((a, b) => (a.path + a.method).localeCompare(b.path + b.method))) {
    lines.push(`- [${it.method}] ${it.path} - ${it.summary || '未填写摘要'}`);
  }
  lines.push('');
}

lines.push('## 代码中非文档接口');
lines.push('');
for (const it of undocumented) {
  lines.push(`- [${it.method}] ${it.path}`);
}
lines.push('');

const outMd = path.join(root, 'api_diff_report.md');
fs.writeFileSync(outMd, lines.join('\n'), 'utf8');

const outJson = path.join(root, 'api_diff_report.json');
fs.writeFileSync(
  outJson,
  JSON.stringify(
    {
      docCount: docOps.length,
      codeCount: codeSet.size,
      missingCount: missing.length,
      undocumentedCount: undocumented.length,
      missing,
      undocumented
    },
    null,
    2
  ),
  'utf8'
);

console.log(`DOC=${docOps.length}; CODE=${codeSet.size}; MISSING=${missing.length}; EXTRA=${undocumented.length}`);
