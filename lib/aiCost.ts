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
};

/**
 * `feature` identifies the call site (e.g. "ask", "grade", "vocab-practice")
 * so cost can later be broken down by feature, not just totalled blindly.
 */
export function logAiCost(feature: string, model: string, inputTokens: number, outputTokens: number): void {
  const price = PRICE_PER_MILLION_USD[model];
  const costUsd = price ? (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output : null;
  console.log(
    `[ai-cost] feature=${feature} model=${model} in_tokens=${inputTokens} out_tokens=${outputTokens} ` +
      `cost_usd=${costUsd !== null ? costUsd.toFixed(6) : "unknown"}`
  );
}
