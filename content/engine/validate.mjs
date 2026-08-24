#!/usr/bin/env node
/* ============================================================
   SmartIGCSE — validate.mjs
   The gate between "the model extracted something" and
   "a child is allowed to see it".

   As a library:  import { validatePack } from './validate.mjs'
   As a CLI:       node engine/validate.mjs packs/my-pack.json
                   Exit 0 = publishable. Exit 1 = errors must be fixed.

   Every rule here exists because it is a failure mode that
   actually happens when a vision model converts a photographed
   worksheet. Nothing publishes until all of them pass.
   ============================================================ */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { CHECKS, checkAnswer, answerText, KNOWN_CHECK_KINDS } from './checks.js';

/* A probe is a canonical correct answer built from the check itself.
   If a check cannot accept its own stated answer, the content is broken. */
function probeFor(check) {
  switch (check.kind) {
    case 'exact_number': return String(check.value);
    case 'any_of_numbers': return String(check.values[0]);
    case 'number_in_range': return String(check.min);
    case 'sequence': return check.values.join(', ');
    case 'sequence_any_of': return check.options[0].join(', ');
    case 'number_set': return check.values.join(', ');
    case 'number_grid': return check.values;
    case 'choice': return check.value;
    case 'multi_choice': return check.values;
    case 'text_exact': return check.accept[0];
    case 'expression': return check.accept[0];
    case 'keywords': return check.modelAnswer;
    case 'sum_of_primes': return CHECKS.sum_of_primes.show(check);
    case 'digit_completes_divisibility': return CHECKS.digit_completes_divisibility.show(check).split(' or ')[0];
    case 'squares_sum_to_square': return null;   // rule-based, checked separately
    case 'digit_cards_product': return check.example || null;
    default: return null;
  }
}

/**
 * Validates a pack object against every rule this kit knows about.
 * Returns { errors: string[], warnings: string[], counts: {sheets, questions, fields, needsHuman} }.
 * Pure - no I/O, no process.exit - safe to call from a server (e.g. a Next.js API route).
 */
export function validatePack(pack) {
  const errors = [], warnings = [];
  const err = (where, msg) => errors.push(`${where}  ${msg}`);
  const warn = (where, msg) => warnings.push(`${where}  ${msg}`);

  for (const k of ['packVersion', 'packId', 'source', 'curriculum', 'language', 'sheets'])
    if (pack[k] === undefined) err('pack', `missing required key "${k}"`);
  if (!Array.isArray(pack.sheets) || !pack.sheets.length) err('pack', 'no sheets');
  if (pack.source && pack.source.confidence === undefined) warn('pack.source', 'no extraction confidence recorded');

  const seenQid = new Set();
  let nQ = 0, nF = 0, nHuman = 0;

  for (const sheet of pack.sheets || []) {
    const S = `[${sheet.id || '?'}]`;
    for (const k of ['id', 'title', 'objective', 'questions'])
      if (sheet[k] === undefined) err(S, `sheet missing "${k}"`);
    if (!sheet.skill) warn(S, 'no skill tag — this sheet cannot feed the diagnostic report');

    (sheet.questions || []).forEach((q, qi) => {
      nQ++;
      const Q = `${S} q${q.label || qi}`;
      if (!q.id) err(Q, 'question has no id');
      else if (seenQid.has(q.id)) err(Q, `duplicate question id "${q.id}"`);
      else seenQid.add(q.id);

      if (!q.prompt || q.prompt.trim().length < 8) err(Q, 'prompt missing or too short');
      if (!q.hint) err(Q, 'no hint — every question must be attemptable with support');
      if (!q.explanation || q.explanation.trim().length < 20)
        err(Q, 'no usable explanation — this is what the parent reads aloud');
      if (!Array.isArray(q.fields) || !q.fields.length) { err(Q, 'no answer fields'); return; }
      if (q.needsHuman) nHuman++;

      /* a prompt that talks about a picture must have a picture */
      const visual = /\b(here is|shown|diagram|this thermometer|the grid|the pattern|the table below|opposite|figure)\b/i;
      if (visual.test(q.prompt + ' ' + (q.sub || '')) && !q.media && !q.table && q.layout !== 'grid' && !q.needsHuman)
        err(Q, 'prompt refers to something visual but the question has no media, table or grid — flag needsHuman or attach media');

      /* layout consistency */
      if (q.layout === 'table') {
        if (!q.table) err(Q, 'layout "table" but no table defined');
        else {
          const cols = q.table.head.length;
          const slots = q.table.rows.reduce((a, r) => a + (cols - r.length), 0);
          const ins = q.fields.filter(f => f.inTable).length;
          if (slots !== ins) err(Q, `table has ${slots} empty cells but ${ins} fields marked inTable`);
        }
      }
      if (q.layout === 'grid' && q.fields.filter(f => f.input === 'grid').length !== 1)
        err(Q, 'layout "grid" needs exactly one field with input "grid"');

      const seenKeys = new Set();
      q.fields.forEach(f => {
        nF++;
        const F = `${Q}.${f.key || '?'}`;
        if (!f.key) err(F, 'field has no key');
        else if (seenKeys.has(f.key)) err(F, 'duplicate field key within the question');
        else seenKeys.add(f.key);
        if (!f.label) warn(F, 'no label — screen readers will announce nothing useful');
        if (!f.check) { err(F, 'no check'); return; }
        if (!KNOWN_CHECK_KINDS.includes(f.check.kind)) {
          err(F, `unknown check kind "${f.check.kind}" — packs may only use: ${KNOWN_CHECK_KINDS.join(', ')}`);
          return;
        }

        /* choice options must contain the answer */
        if (f.input === 'choice' || f.input === 'multi') {
          if (!Array.isArray(f.options) || f.options.length < 2) err(F, 'choice field needs at least two options');
          else {
            const want = f.check.kind === 'choice' ? [f.check.value] : (f.check.values || []);
            const missing = want.filter(v => !f.options.includes(v));
            if (missing.length) err(F, `correct answer(s) not present in options: ${missing.join(', ')}`);
            if (f.check.kind === 'multi_choice' && want.length === f.options.length)
              warn(F, 'every option is correct — the question tests nothing');
          }
        }

        /* the answer must satisfy its own check */
        const probe = probeFor(f.check);
        if (probe !== null && probe !== undefined && !checkAnswer(f.check, probe))
          err(F, `the stated answer "${probe}" does not pass its own check`);

        /* rule-based checks must have at least one reachable answer */
        if (f.check.kind === 'sum_of_primes') {
          const s = CHECKS.sum_of_primes.show(f.check);
          if (s === 'no pair exists') err(F, `no two primes add to ${f.check.target}`);
        }
        if (f.check.kind === 'digit_completes_divisibility') {
          if (CHECKS.digit_completes_divisibility.show(f.check) === 'no digit works')
            err(F, `no digit 0-9 makes ${f.check.prefix}? divisible by ${f.check.by}`);
        }
        if (f.check.kind === 'keywords' && !f.check.modelAnswer)
          err(F, 'keywords check needs a modelAnswer to show when the child is wrong');
        if (f.check.kind === 'squares_sum_to_square' && !checkAnswer(f.check, '4, 9, 36') && f.check.count === 3)
          warn(F, 'the documented example does not satisfy this check');

        /* on counting/sequence sheets the steps must be constant — this is what
           catches a single mis-read digit, the most common OCR failure of all */
        if (f.check.kind === 'sequence' && f.check.values.length >= 3 && !f.check.gapped &&
            /sequence|counting/.test(sheet.skill || '')) {
          const steps = f.check.values.slice(1).map((v, i) => v - f.check.values[i]);
          if (new Set(steps).size > 1)
            err(F, `steps are not constant (${steps.join(', ')}) on a sequence sheet — a digit was probably mis-read`);
        }

        /* the hint must not simply be the answer */
        const shown = String(answerText(f) || '');
        if (shown.length > 2 && q.hint && q.hint.includes(shown))
          warn(F, `the hint contains the answer "${shown}" verbatim — rewrite it as a nudge`);
      });
    });
  }

  return {
    errors,
    warnings,
    counts: { sheets: pack.sheets ? pack.sheets.length : 0, questions: nQ, fields: nF, needsHuman: nHuman }
  };
}

/* ---------- CLI wrapper - only runs when invoked directly, not on import ---------- */
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const file = process.argv[2];
  if (!file) { console.error('usage: node engine/validate.mjs <pack.json>'); process.exit(2); }
  const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { errors, warnings, counts } = validatePack(pack);

  const name = pack.packId || file;
  console.log(`\n  ${name}`);
  console.log(`  ${counts.sheets} sheets · ${counts.questions} questions · ${counts.fields} fields · ${counts.needsHuman} flagged for human review\n`);
  warnings.forEach(w => console.log(`  WARN   ${w}`));
  errors.forEach(e => console.log(`  ERROR  ${e}`));
  if (!errors.length && !warnings.length) console.log('  clean — publishable\n');
  else console.log(`\n  ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  process.exit(errors.length ? 1 : 0);
}
