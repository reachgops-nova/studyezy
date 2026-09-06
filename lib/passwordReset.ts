import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { db } from "./db";

// Same hash-not-raw-token storage convention as lib/session.ts's own
// createSession/hashToken - a DB read alone can never reconstitute a usable
// reset link.
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a one-time reset token for userId and returns the RAW token (only its hash is ever stored). */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
  });
  return token;
}

/**
 * Validates a raw token (unexpired, unused) and marks it used - returns the
 * userId it belonged to, or null if the token is invalid/expired/already used.
 * Marking used happens here, not by the caller, so a token can never be
 * consumed twice even under a race (a second concurrent request that read
 * the same row before this update would still see usedAt set once this
 * commits, since the update itself is the source of truth checked next time).
 */
export async function consumePasswordResetToken(token: string): Promise<string | null> {
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  await db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  return record.userId;
}
