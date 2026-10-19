#!/usr/bin/env node
// Rebuilds index/*.csv from record frontmatter and reports broken ID links.
// Usage: node tools/build-index.mjs [--check]   (--check: report only, write nothing)
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const TYPES = {
  SW: { sheet: 'swipes', columns: ['id', 'state', 'platform', 'account', 'published', 'captured', 'views', 'saves', 'shares', 'slides', 'outlier', 'products', 'url', 'drive', 'title'] },
  BD: { sheet: null },
  H: { sheet: 'hooks', columns: ['id', 'status', 'swipes', 'source_views', 'source_captured', 'used_in', 'products', 'title'] },
  F: { sheet: 'formats', columns: ['id', 'name', 'status', 'swipes', 'results', 'products', 'canvas'] },
  B: { sheet: 'briefs', columns: ['id', 'product', 'status', 'format', 'hook', 'swipes', 'variation_of', 'title'] },
  D: { sheet: null },
  R: { sheet: 'results', columns: ['id', 'product', 'published', 'captured', 'age_days', 'views', 'saves', 'shares', 'comments', 'follows', 'clicks', 'format', 'hook', 'brief', 'draft', 'url'] },
};
const LINK_FIELDS = ['swipe', 'swipes', 'hook', 'format', 'brief', 'draft', 'used_in', 'results', 'variation_of'];
const EMPTY = new Set(['', 'unknown', 'none']);

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '_template' ? [] : walk(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].replace(/\s+#.*$/, '').trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((v) => v.trim()).filter(Boolean);
    }
    data[kv[1]] = value;
  }
  const title = text.slice(match[0].length).match(/^#\s+(.+)$/m);
  data.title = title ? title[1].replace(/^[A-Z]+(-[A-Z]+)?-\d+(-v\d+)?:\s*/, '') : '';
  return data;
}

const asList = (v) => (Array.isArray(v) ? v : v === undefined ? [] : [v]).filter((x) => !EMPTY.has(x));
const prefixOf = (id) => id.split('-')[0];

const problems = [];
const records = new Map();
const productCodes = new Map();

for (const dir of readdirSync(join(root, 'products'))) {
  const ctx = join(root, 'products', dir, 'context.md');
  if (dir === '_template' || !existsSync(ctx)) continue;
  const code = parseFrontmatter(readFileSync(ctx, 'utf8'))?.code;
  if (!code || code === 'XXXX') problems.push(`products/${dir}/context.md: set a product code`);
  else productCodes.set(dir, code);
}

for (const file of [...walk(join(root, 'library')), ...walk(join(root, 'products'))]) {
  const rel = relative(root, file);
  const data = parseFrontmatter(readFileSync(file, 'utf8'));
  if (!data?.id) continue;
  const { id } = data;
  if (!TYPES[prefixOf(id)]) { problems.push(`${rel}: unknown ID prefix in ${id}`); continue; }
  if (basename(file, '.md') !== id) problems.push(`${rel}: filename doesn't match id ${id}`);
  if (records.has(id)) problems.push(`${rel}: duplicate id ${id} (also ${records.get(id).rel})`);
  const product = rel.startsWith('products/') ? rel.split('/')[1] : null;
  if (product && productCodes.has(product) && id.split('-')[1] !== productCodes.get(product)) {
    problems.push(`${rel}: ${id} doesn't use this product's code ${productCodes.get(product)}`);
  }
  records.set(id, { ...data, rel, product: data.product ?? product });
}

for (const record of records.values()) {
  for (const field of LINK_FIELDS) {
    for (const target of asList(record[field])) {
      if (!records.has(target)) problems.push(`${record.rel}: ${field} → ${target} does not exist`);
    }
  }
}

const csvCell = (v) => {
  const s = Array.isArray(v) ? v.join(' ') : String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

if (!checkOnly) {
  for (const [prefix, { sheet, columns }] of Object.entries(TYPES)) {
    if (!sheet) continue;
    const rows = [...records.values()]
      .filter((r) => prefixOf(r.id) === prefix)
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    const lines = [columns.join(','), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))];
    writeFileSync(join(root, 'index', `${sheet}.csv`), lines.join('\n') + '\n');
  }
}

const counts = Object.keys(TYPES).map((p) => `${p} ${[...records.values()].filter((r) => prefixOf(r.id) === p).length}`);
console.log(`${records.size} records (${counts.join(', ')})${checkOnly ? '' : '; index/ rebuilt'}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
}
