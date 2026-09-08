import "server-only";

// Real per-call cost logging, not a guess - every AI call site logs its
// actual token usage (straight from the provider's response, not an
// estimate) as a single structured line, picked up by `railway logs`. This
// exists so a real per-family/per-month cost figure can be pulled from
// actual usage once the app has real traffic, instead of pricing being set
// off a one-off estimate. Verified rates as of 2026-08-20 - re-check
// provider pricing pages before trusting this for a real billing decision,
// since rates do change.
const PRICE_PER_MILLION_USD: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5-20251001": { input: 1.0, output: 5.0 },
  "claude-sonnet-5": { input: 2.0, output: 10.0 },
  "openai/gpt-oss-120b": { input: 0.15, output: 0.6 },
  "openai/gpt-oss-20b": { input: 0.075, output: 0.3 },
  // Verified 2026-08-22 against console.groq.com/docs/model/qwen/qwen3.6-27b
  "qwen/qwen3.6-27b": { input: 0.6, output: 3.0 },
  // Verified live 2026-09-06 by cross-checking a real OpenRouter response's
  // own cost_details against this rate (matched exactly: 14 prompt tokens x
  // $2.50/M + 1 completion token x $10/M = $0.000045).
  "openai/gpt-4o": { input: 2.5, output: 10.0 },
  // Verified 2026-09-06 against ai.google.dev/gemini-api/docs/pricing,
  // standard tier (through 2026-12-31 - doubles to $1.50/$7.50 on 2027-01-01).
  "gemini-flash-latest": { input: 0.75, output: 3.75 },
  // Verified live 2026-09-07: a real call's usageMetadata showed 1290 image
  // output tokens for one 1024x1024 image, and ai.google.dev/gemini-api/docs/pricing
  // states image output is $30/1M tokens ($0.039/image) - 1290 * 30/1e6 =
  // $0.0387, matching. Input is billed the same "$0.30 (text/image)" rate
  // whether the input is a text prompt or a reference image.
  "gemini-2.5-flash-image": { input: 0.3, output: 30.0 },
  // Verified live 2026-09-08 against ai.google.dev/gemini-api/docs/pricing -
  // a real call's usageMetadata showed 137 audio output tokens for a short
  // two-sentence Tamil utterance ($10/1M audio tokens = ~$0.0014, trivial).
  "gemini-2.5-flash-preview-tts": { input: 0.5, output: 10.0 },
};

/** Shared by logAiCost and anything else (e.g. /admin/model-compare) that needs the same real per-call number. */
export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number | null {
  const price = PRICE_PER_MILLION_USD[model];
  return price ? (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output : null;
}

/**
 * `feature` identifies the call site (e.g. "ask", "grade", "vocab-practice")
 * so cost can later be broken down by feature, not just totalled blindly.
 */
export function logAiCost(feature: string, model: string, inputTokens: number, outputTokens: number): void {
  const costUsd = estimateCostUsd(model, inputTokens, outputTokens);
  console.log(
    `[ai-cost] feature=${feature} model=${model} in_tokens=${inputTokens} out_tokens=${outputTokens} ` +
      `cost_usd=${costUsd !== null ? costUsd.toFixed(6) : "unknown"}`
  );
}

/**
 * Same log line shape as logAiCost, for a request served from
 * lib/answerCache.ts instead of a real model call - so cache savings show
 * up in the exact same `railway logs` grep as real cost, not a separate
 * metric nobody looks at.
 */
export function logCacheHit(feature: string): void {
  console.log(`[ai-cost] feature=${feature} model=cache in_tokens=0 out_tokens=0 cost_usd=0.000000`);
}
