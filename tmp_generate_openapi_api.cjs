const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const openapiPath = path.join(root, 'Default module.openapi.json');
const outPath = path.join(root, 'src', 'api', 'openapi.js');
const doc = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

const methodWeight = { get: 0, post: 1, put: 2, delete: 3, patch: 4 };
const ops = [];
for (const [p, methods] of Object.entries(doc.paths || {})) {
  for (const [m, info] of Object.entries(methods || {})) {
    if (!['get', 'post', 'put', 'delete', 'patch'].includes(m)) continue;
    const operationId = info.operationId || `${m}_${p.replace(/[^a-zA-Z0-9]+/g, '_')}`;
    ops.push({ path: p, method: m, operationId, summary: info.summary || '', tag: (info.tags && info.tags[0]) || 'openapi' });
  }
}
ops.sort((a, b) => (a.tag !== b.tag ? a.tag.localeCompare(b.tag, 'zh-CN') : (a.path !== b.path ? a.path.localeCompare(b.path, 'en') : (methodWeight[a.method] ?? 9) - (methodWeight[b.method] ?? 9))));

const toCamel = (str) => str.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase()) || 'callApi';
const used = new Set();
const unique = (n) => { let name = n; let i = 2; while (used.has(name)) { name = `${n}${i++}`; } used.add(name); return name; };
const fns = ops.map(op => ({ ...op, name: unique(toCamel(op.operationId)) }));

let code = "import request from './request'\n\n";
code += "// Auto-generated API entry points from Default module.openapi.json\n\n";
let currentTag = '';
for (const fn of fns) {
  if (fn.tag !== currentTag) {
    currentTag = fn.tag;
    code += `// ${currentTag}\n`;
  }
  const sum = String(fn.summary).replace(/\*/g, '');
  code += `// ${fn.method.toUpperCase()} ${fn.path} - ${sum}\n`;
  code += `export function ${fn.name}(params = {}, data, config = {}) {\n`;
  code += `  return request({\n`;
  code += `    url: '${fn.path}',\n`;
  code += `    method: '${fn.method}',\n`;
  if (fn.method === 'get' || fn.method === 'delete') code += `    params,\n`;
  else code += `    data: data ?? params,\n`;
  code += `    ...config\n`;
  code += `  })\n`;
  code += `}\n\n`;
}
code += `export const openApiEndpointCount = ${fns.length}\n`;

fs.writeFileSync(outPath, code, 'utf8');
console.log(`Regenerated ${outPath} with ${fns.length} literal-url wrappers.`);
