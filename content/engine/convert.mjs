#!/usr/bin/env node
/* ============================================================
   SmartIGCSE — convert.mjs
   images -> vision model -> pack -> validate -> repair -> disk

   node engine/convert.mjs --pages ./scans --out packs/english.json \
        --book "Grade 4 English Coursebook" --subject English \
        --board Cambridge --stage "Grade 4" --limit 3

   Needs ANTHROPIC_API_KEY in the environment.
   Start with --limit 3 and read the output by hand before spending
   tokens on a whole book.
   ============================================================ */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');

/* ============================================================
   ADAPTER — the only part you need to write.

   Return the page images in reading order. The default reads a
   local folder; swap the body for your S3 / GCS / DB blob call.
   Nothing else in this file needs to change.
   ============================================================ */
async function loadPages(source, limit) {
  // --- replace from here for real storage ---------------------
  const files = fs.readdirSync(source)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .slice(0, limit || Infinity);
  return files.map(f => ({
    name: f,
    mediaType: /\.png$/i.test(f) ? 'image/png' : /\.webp$/i.test(f) ? 'image/webp' : 'image/jpeg',
    base64: fs.readFileSync(path.join(source, f)).toString('base64')
  }));
  // --- to here ------------------------------------------------
}

/* ---------------- args ---------------- */
const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) =>
    v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a, [])
);
const need = k => { if (!args[k]) { console.error(`missing --${k}`); process.exit(2); } return args[k]; };
const PAGES = need('pages'), OUT = need('out');
const META = {
  book: args.book || 'Untitled', subject: args.subject || 'Unknown',
  board: args.board || 'Cambridge', stage: args.stage || 'Unknown', year: args.year || ''
};
const LIMIT = args.limit ? Number(args.limit) : undefined;
const MODEL = args.model || 'claude-sonnet-4-6';
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error('set ANTHROPIC_API_KEY'); process.exit(2); }

/* ---------------- prompt ---------------- */
const promptFile = fs.readFileSync(path.join(ROOT, 'prompts', 'extract-worksheet.md'), 'utf8');
const SYSTEM = promptFile.split('## SYSTEM')[1].split('## USER')[0].trim();
const USER_TMPL = promptFile.split('## USER')[1].split('---')[0].trim();
const fill = t => t.replace(/\{\{(\w+)\}\}/g, (_, k) => META[k] ?? '');

/* ---------------- model call ---------------- */
async function callModel(pages, repairNotes) {
  const content = pages.map(p => ({
    type: 'image', source: { type: 'base64', media_type: p.mediaType, data: p.base64 }
  }));
  let text = fill(USER_TMPL);
  if (repairNotes) {
    text += `\n\nYour previous attempt failed automated validation. Fix exactly these problems and return the corrected pack in full. Do not change anything else.\n\n${repairNotes}`;
  }
  content.push({ type: 'text', text });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 32000, temperature: 0, system: SYSTEM, messages: [{ role: 'user', content }] })
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const data = await res.json();
  const raw = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
  const usage = data.usage || {};
  const json = raw.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
  let pack;
  try { pack = JSON.parse(json); }
  catch (e) {
    fs.writeFileSync(OUT + '.raw.txt', raw);
    throw new Error(`model did not return valid JSON — raw output saved to ${OUT}.raw.txt`);
  }
  return { pack, usage };
}

/* ---------------- validate ---------------- */
function validate(file) {
  try {
    const out = execFileSync('node', [path.join(HERE, 'validate.mjs'), file], { encoding: 'utf8' });
    return { ok: true, report: out };
  } catch (e) {
    return { ok: false, report: (e.stdout || '') + (e.stderr || '') };
  }
}

/* ---------------- run ---------------- */
const t0 = Date.now();
const pages = await loadPages(PAGES, LIMIT);
if (!pages.length) { console.error('no page images found at ' + PAGES); process.exit(2); }
console.log(`\n  ${pages.length} page(s): ${pages.map(p => p.name).join(', ')}`);

let totals = { input: 0, output: 0 };
let repairNotes = null, result = null;

for (let attempt = 1; attempt <= 3; attempt++) {
  console.log(`\n  attempt ${attempt} — calling ${MODEL}…`);
  const { pack, usage } = await callModel(pages, repairNotes);
  totals.input += usage.input_tokens || 0;
  totals.output += usage.output_tokens || 0;

  if (pack.error) { console.error(`  model refused: ${pack.error}`); process.exit(1); }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(pack, null, 2));

  const v = validate(OUT);
  console.log(v.report);
  if (v.ok) { result = 'clean'; break; }

  const errs = v.report.split('\n').filter(l => l.includes('ERROR'));
  if (attempt === 3) { result = 'failed'; break; }
  repairNotes = errs.join('\n');
  console.log(`  ${errs.length} error(s) — sending back for repair`);
}

const flagged = JSON.parse(fs.readFileSync(OUT, 'utf8'))
  .sheets.flatMap(s => s.questions).filter(q => q.needsHuman);

const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`  ${result === 'clean' ? 'PASS' : 'NEEDS HUMAN REVIEW'} — written to ${OUT}`);
console.log(`  ${totals.input} input + ${totals.output} output tokens · ${secs}s · ${(totals.input / pages.length).toFixed(0)} input tokens per page`);
if (flagged.length) {
  console.log(`  ${flagged.length} question(s) flagged for a human:`);
  flagged.forEach(q => console.log(`    ${q.id}  ${q.reviewReason || 'no reason given'}`));
}
console.log('');
process.exit(result === 'clean' ? 0 : 1);
