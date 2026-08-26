import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";

const TEMPLATE_PATH = path.join(process.cwd(), "content", "player-template.html");
const PACK_BLOCK_RE = /(<script id="pack" type="application\/json">)[\s\S]*?(<\/script>)/;

// Workbook practice should feel different each time a kid retries it, not
// the same fixed set - see PLATFORM_PLAN.md's 2026-08-26 entry ("draw from a
// pre-built question bank" was the confirmed direction over regenerating via
// AI per attempt). The admin conversion pipeline already accumulates every
// converted question from every uploaded page into one pack (batch/append
// mode) - that pack IS the bank. This route just pools every question across
// every sheet and randomly samples a fresh subset on each page load/attempt,
// rather than always showing the full bank. Once a unit's bank has more
// converted questions than this, retries start looking genuinely different;
// below it, every question shows every time (nothing to sample from).
const QUESTIONS_PER_WORKBOOK_ATTEMPT = 6;

interface BankQuestion {
  id: string;
  [key: string]: unknown;
}
interface BankSheet {
  id: string;
  title?: string;
  objective?: string;
  skill?: string;
  questions: BankQuestion[];
  [key: string]: unknown;
}
interface BankPackData {
  sheets: BankSheet[];
  [key: string]: unknown;
}

function sampleWorkbookAttempt(data: BankPackData): BankPackData {
  const pool = data.sheets.flatMap((s) => s.questions);
  if (pool.length <= QUESTIONS_PER_WORKBOOK_ATTEMPT) return data;

  // Fisher-Yates shuffle, then take the first N - simple, unbiased, no
  // external dependency.
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const sampled = shuffled.slice(0, QUESTIONS_PER_WORKBOOK_ATTEMPT);

  const firstSheet = data.sheets[0];
  return {
    ...data,
    sheets: [
      {
        id: "practice-attempt",
        title: firstSheet?.title ?? "Practice",
        objective: firstSheet?.objective ?? "A fresh set of practice questions from this unit's question bank.",
        skill: firstSheet?.skill,
        questions: sampled,
      },
    ],
  };
}

// Family-facing counterpart to app/admin/content-packs/[packId]/preview/route.ts:
// same content/player-template.html substitution, gated by a signed-in
// family session (matching every other /learn/[unitId] API, not
// getCurrentAdmin()), plus one injected script block that lets a kid submit
// their worksheet for real (POST /api/worksheet-attempts) instead of the
// admin preview's read-only click-through.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ unitId: string; packId: string }> }) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { packId } = await params;
  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack) {
    return NextResponse.json({ error: "Worksheet not found." }, { status: 404 });
  }

  const template = await readFile(TEMPLATE_PATH, "utf8");
  if (!PACK_BLOCK_RE.test(template)) {
    return NextResponse.json({ error: "Worksheet template is missing its pack block." }, { status: 500 });
  }

  // Replacer function, not a template-string second argument: String.replace
  // treats "$1"/"$2"/etc in a STRING replacement as backreferences, and real
  // pack content legitimately contains "$"-prefixed sequences (e.g. "$2.50"
  // in a money word problem) - a string replacement silently swapped "$2"
  // for capture group 2's own value (the literal "</script>" tag),
  // corrupting the page. A function receives the match as plain arguments
  // and its return value is used verbatim, immune to this.
  const attemptPack = sampleWorkbookAttempt(pack.data as unknown as BankPackData);
  const packJson = JSON.stringify(attemptPack);
  const withPack = template.replace(PACK_BLOCK_RE, (_m, open: string, close: string) => `${open}${packJson}${close}`);

  // STATE.results[q.id] is the string 'correct'|'wrong' (checked directly
  // against content/engine/player-app.js's own checkQ/grade functions, not
  // assumed) - shares the player's top-level scope since classic <script>
  // tags in one document see the same lexical top level.
  const submitScript = `
<script>
(function(){
  var bar = document.createElement('div');
  bar.style.cssText = 'position:sticky;bottom:0;left:0;right:0;background:#14243A;color:#fff;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:Inter,sans-serif;font-size:14px;z-index:50;';
  bar.innerHTML = '<span id="submit-status">Answer some questions, then submit whenever you are ready.</span>' +
    '<button id="submit-worksheet-btn" style="background:#1D5FA8;color:#fff;border:none;border-radius:999px;padding:10px 22px;font-weight:600;cursor:pointer;font-size:14px;">Submit worksheet</button>';
  document.body.appendChild(bar);
  document.getElementById('submit-worksheet-btn').addEventListener('click', async function(){
    var results = (typeof STATE !== 'undefined' && STATE.results) ? STATE.results : {};
    var ids = Object.keys(results);
    var statusEl = document.getElementById('submit-status');
    if (ids.length === 0) { statusEl.textContent = 'Check at least one answer first.'; return; }
    var answers = {};
    ids.forEach(function(qid){ answers[qid] = { correct: results[qid] === 'correct' }; });
    statusEl.textContent = 'Submitting...';
    try {
      var res = await fetch('/api/worksheet-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: ${JSON.stringify(pack.packId)}, answers: answers })
      });
      var data = await res.json();
      if (!res.ok) { statusEl.textContent = data.error || 'Could not submit right now.'; return; }
      statusEl.textContent = data.scorePct + '% (' + data.correctCount + '/' + data.totalCount + ') - ' +
        (data.qualifiesForTest ? 'Nicely done! You can take the test now.' : 'Keep practising - redo any you missed and submit again.');
    } catch (e) {
      statusEl.textContent = 'Could not submit right now - check your connection.';
    }
  });
})();
</script>
</body>`;

  const finalHtml = withPack.replace(/<\/body>/, submitScript);

  return new NextResponse(finalHtml, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
