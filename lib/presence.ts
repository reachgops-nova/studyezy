/**
 * Turning session rows into an honest answer to "is this person using the
 * app?".
 *
 * The trap this exists to avoid: a session lasts 30 days, so "has a session
 * that has not expired" would label someone who signed in three weeks ago and
 * closed the tab as logged in. That reads as activity and is not. Presence is
 * therefore derived from lastSeenAt, which getCurrentUser stamps while someone
 * is actually making requests, and the only claim we make from a live session
 * alone is that they have not signed out.
 */

/** Within this window someone is treated as here right now. */
const ONLINE_MS = 5 * 60 * 1000;
/** Beyond ONLINE_MS but within this, they have been around today. */
const TODAY_MS = 24 * 60 * 60 * 1000;
/** Beyond TODAY_MS but within this, recently enough to matter. */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type PresenceState = "online" | "today" | "week" | "idle" | "never";

export type Presence = {
  state: PresenceState;
  /** Short label for a badge, e.g. "Online now". */
  label: string;
  /** When they were last seen making a request, if ever. */
  lastSeenAt: Date | null;
  /** When they most recently signed in, if ever. */
  lastSignInAt: Date | null;
  /** Unexpired sessions - roughly, devices still signed in. */
  liveSessions: number;
};

type SessionRow = { createdAt: Date; expiresAt: Date; lastSeenAt: Date };

export function presenceFromSessions(sessions: SessionRow[], now = new Date()): Presence {
  const live = sessions.filter((s) => s.expiresAt > now);

  const lastSeenAt = sessions.reduce<Date | null>(
    (acc, s) => (!acc || s.lastSeenAt > acc ? s.lastSeenAt : acc),
    null,
  );
  const lastSignInAt = sessions.reduce<Date | null>(
    (acc, s) => (!acc || s.createdAt > acc ? s.createdAt : acc),
    null,
  );

  if (!lastSeenAt) {
    return { state: "never", label: "Never signed in", lastSeenAt: null, lastSignInAt, liveSessions: live.length };
  }

  const ago = now.getTime() - lastSeenAt.getTime();
  const state: PresenceState =
    ago < ONLINE_MS ? "online" : ago < TODAY_MS ? "today" : ago < WEEK_MS ? "week" : "idle";

  const label =
    state === "online"
      ? "Online now"
      : state === "today"
        ? `Active ${formatAgo(ago)}`
        : `Last seen ${formatAgo(ago)}`;

  return { state, label, lastSeenAt, lastSignInAt, liveSessions: live.length };
}

/** "3 minutes ago" style, kept coarse - precision here would be false comfort. */
export function formatAgo(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export const PRESENCE_STYLES: Record<PresenceState, string> = {
  online: "bg-green-100 text-green-700",
  today: "bg-emerald-50 text-emerald-700",
  week: "bg-amber-50 text-amber-700",
  idle: "bg-slate-100 text-slate-500",
  never: "bg-slate-100 text-slate-400",
};

export const PRESENCE_DOTS: Record<PresenceState, string> = {
  online: "bg-green-500",
  today: "bg-emerald-400",
  week: "bg-amber-400",
  idle: "bg-slate-300",
  never: "bg-slate-200",
};
