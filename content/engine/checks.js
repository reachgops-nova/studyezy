/* ============================================================
   SmartIGCSE — checks.js
   The complete vocabulary of answer checks.

   Content packs contain DATA ONLY. They never contain code.
   A pack may only reference a "kind" that exists in this file,
   which is what makes machine-generated content safe to run and
   possible to validate before a child ever sees it.

   Works unchanged in Node and in the browser.
   ============================================================ */

/* ---------- primitives ---------- */
const dash = s => String(s == null ? '' : s).replace(/[\u2212\u2013\u2014]/g, '-').trim();

export function toNum(s) {
  if (typeof s === 'number') return s;
  const t = dash(s).replace(/[^0-9.\-]/g, '');
  if (t === '' || t === '-') return NaN;
  return Number(t);
}
export function toList(s) {
  if (Array.isArray(s)) return s.map(toNum).filter(n => !Number.isNaN(n));
  return dash(s).split(/[,;]+|\s+/).filter(Boolean).map(toNum).filter(n => !Number.isNaN(n));
}
export const isPrime = n => {
  n = Math.abs(n);
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
export const isSquare = n => n >= 0 && Number.isInteger(Math.sqrt(n));

const sameOrdered = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const sameSet = (a, b) => sameOrdered([...a].sort((x, y) => x - y), [...b].sort((x, y) => x - y));
// Strips hyphens and ALL whitespace (not just collapsing runs of it) before
// comparing - real bug found live 2026-08-26 (see the same fix in
// content/player-template.html): an extracted answer like "Two-thirds" only
// matched a kid typing the hyphen exactly; typing the far more natural "two
// thirds" (no hyphen, how anyone actually says it) was marked wrong even
// though it was the same answer.
const normText = s => dash(s).toLowerCase().replace(/[.,;:!?'"()-]/g, '').replace(/\s+/g, '').trim();
const normExpr = s => dash(s).toLowerCase()
  .replace(/\s|[×*·]/g, '')
  .replace(/position|term|pattern/g, 'n')
  .replace(/([0-9n])x([0-9n])/g, '$1$2');   // "2 x position" -> "2n"

/* ============================================================
   THE CHECK VOCABULARY
   Each entry: run(check, raw) -> boolean
               show(check)     -> string shown when the child is wrong
   ============================================================ */
export const CHECKS = {

  /* --- numeric --- */
  exact_number: {
    run: (c, v) => toNum(v) === c.value,
    show: c => String(c.value)
  },
  any_of_numbers: {                       // several answers are equally right
    run: (c, v) => c.values.includes(toNum(v)),
    show: c => c.values.join(' or ')
  },
  number_in_range: {
    run: (c, v) => { const n = toNum(v); return !Number.isNaN(n) && n >= c.min && n <= c.max; },
    show: c => `any value from ${c.min} to ${c.max}`
  },

  /* --- collections --- */
  sequence: {                              // order matters
    run: (c, v) => sameOrdered(toList(v), c.values),
    show: c => c.values.join(', ')
  },
  sequence_any_of: {                       // several valid endings, e.g. stop at 6 or go on to 11
    run: (c, v) => { const l = toList(v).join(','); return c.options.some(o => o.join(',') === l); },
    show: c => c.options[0].join(', ')
  },
  number_set: {                            // order does not matter (factor lists)
    run: (c, v) => sameSet(toList(v), c.values),
    show: c => c.values.join(', ')
  },
  number_grid: {                           // tap-a-grid, e.g. circle the primes
    run: (c, v) => Array.isArray(v) && sameSet(v, c.values),
    show: c => c.values.join(', ')
  },

  /* --- choice --- */
  choice: {
    run: (c, v) => v === c.value,
    show: c => c.value
  },
  multi_choice: {
    run: (c, v) => Array.isArray(v) && v.length === c.values.length && c.values.every(x => v.includes(x)),
    show: c => c.values.join(', ')
  },

  /* --- language --- */
  text_exact: {
    run: (c, v) => { const n = normText(v); return n !== '' && c.accept.some(a => normText(a) === n); },
    show: c => c.accept[0]
  },
  keywords: {                              // "explain why" answers: each group needs one synonym present
    run: (c, v) => { const n = normText(v); return n !== '' && c.allOf.every(g => g.some(w => n.includes(normText(w)))); },
    show: c => c.modelAnswer
  },
  expression: {                            // algebraic rules: "2n+5", "2 x position + 5"
    run: (c, v) => c.accept.some(a => normExpr(a) === normExpr(v)),
    show: c => c.accept[0]
  },

  /* --- open-ended maths: many right answers, one rule --- */
  sum_of_primes: {                         // Goldbach style: 12 = 5 + 7
    run: (c, v) => { const p = toList(v); return p.length === 2 && p.every(isPrime) && p[0] + p[1] === c.target; },
    show: c => {
      for (let a = 2; a <= c.target / 2; a++) if (isPrime(a) && isPrime(c.target - a)) return `${a} + ${c.target - a}`;
      return 'no pair exists';
    }
  },
  squares_sum_to_square: {                 // "three square numbers that make a square number"
    run: (c, v) => {
      const l = toList(v);
      return l.length === c.count && l.every(isSquare) && isSquare(l.reduce((a, b) => a + b, 0));
    },
    show: c => c.example || 'for example 4, 9, 36'
  },
  digit_completes_divisibility: {          // 83_ must divide by 4
    run: (c, v) => {
      const d = toNum(v);
      return Number.isInteger(d) && d >= 0 && d <= 9 && Number(String(c.prefix) + d) % c.by === 0;
    },
    show: c => {
      const out = [];
      for (let d = 0; d <= 9; d++) if (Number(String(c.prefix) + d) % c.by === 0) out.push(d);
      return out.length ? out.join(' or ') : 'no digit works';
    }
  },
  digit_cards_product: {                   // use each card once; product must end in 0
    run: (c, v) => {
      const parts = dash(v).toLowerCase().replace(/[×*]/g, 'x').split('x')
        .map(p => p.replace(/[^0-9]/g, '')).filter(Boolean);
      if (parts.length !== 2) return false;
      const used = (parts[0] + parts[1]).split('').sort().join('');
      if (used !== [...String(c.digits)].sort().join('')) return false;
      const product = Number(parts[0]) * Number(parts[1]);
      if (c.endsWith !== undefined && product % 10 !== c.endsWith) return false;
      if (c.equals !== undefined && product !== c.equals) return false;
      return true;
    },
    show: c => c.example || 'use each card once'
  },

  /* --- graded by a person/AI, not a fixed rule ---
     Added 2026-08-25 for pack-based progression tests (see
     lib/questionPaperToPack.ts): free-text answers judged against a real
     mark scheme by the app's existing AI grading
     (gradeShortAnswer/gradeShortAnswerGroq), never by this file. run()
     always returns false - it exists only so `ai_graded` is a recognised
     kind (validators/players must never silently accept it as
     self-markable), and callers must special-case it rather than call
     checkAnswer(). */
  ai_graded: {
    run: () => false,
    show: c => (c.markScheme && Array.isArray(c.markScheme.criteria)) ? c.markScheme.criteria.join('; ') : ''
  }
};

/* ---------- public API ---------- */
export function checkAnswer(check, raw) {
  const impl = CHECKS[check && check.kind];
  if (!impl) return false;
  try { return impl.run(check, raw === undefined || raw === null ? '' : raw); }
  catch { return false; }
}
export function answerText(field) {
  if (field.answerText) return field.answerText;
  const impl = CHECKS[field.check && field.check.kind];
  return impl ? impl.show(field.check) : '';
}
export const KNOWN_CHECK_KINDS = Object.keys(CHECKS);
