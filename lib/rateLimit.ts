import "server-only";

/**
 * Minimal in-memory rate limiter, scoped per demo profile id. Good enough to
 * stop a runaway client loop from burning API credits during the pilot.
 *
 * NOTE (known gap): this resets on every server restart/deploy and does not
 * share state across serverless instances. Fine for a 1-3 user pilot on a
 * single long-running dev/preview server; replace with a durable store
 * (e.g. Upstash Redis) before any multi-instance production deploy.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (existing.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterMs = existing[0] + WINDOW_MS - now;
    return { allowed: false, retryAfterMs };
  }

  existing.push(now);
  hits.set(key, existing);
  return { allowed: true };
}
