import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";
import type { User } from "@prisma/client";

const SESSION_COOKIE = "studyezy_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days, matches the old demo-profile cookie lifetime

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a session row and sets the session cookie. Only a SHA-256 hash of
 * the token is stored server-side - a DB read alone can never reconstitute a
 * valid cookie value.
 */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;

  touchLastSeen(session.id, session.lastSeenAt);

  return session.user;
}

/** How stale a last-seen stamp may get before it is worth a write. */
const LAST_SEEN_THROTTLE_MS = 5 * 60 * 1000;

/**
 * Records that this session is in use, at most once every five minutes.
 *
 * getCurrentUser runs on essentially every request, so an unconditional write
 * here would put a row update in front of every page load for no extra
 * information - five-minute resolution is far finer than "active today" needs.
 * Deliberately not awaited, and failures are swallowed: knowing when someone
 * was last seen is never worth failing a page load over.
 */
function touchLastSeen(sessionId: string, lastSeenAt: Date): void {
  if (Date.now() - lastSeenAt.getTime() < LAST_SEEN_THROTTLE_MS) return;
  void db.session
    .update({ where: { id: sessionId }, data: { lastSeenAt: new Date() } })
    .catch(() => {});
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } }).catch(() => {});
  }
  store.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin(): Promise<User | null> {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
