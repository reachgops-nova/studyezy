import { describe, expect, it } from "vitest";
import { presenceFromSessions, formatAgo } from "@/lib/presence";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const now = new Date("2026-09-15T12:00:00Z");
const at = (msAgo: number) => new Date(now.getTime() - msAgo);
const session = (seenMsAgo: number, opts: { createdMsAgo?: number; expired?: boolean } = {}) => ({
  createdAt: at(opts.createdMsAgo ?? seenMsAgo),
  expiresAt: opts.expired ? at(DAY) : new Date(now.getTime() + 20 * DAY),
  lastSeenAt: at(seenMsAgo),
});

describe("presenceFromSessions", () => {
  it("treats someone seen in the last five minutes as online", () => {
    const p = presenceFromSessions([session(2 * MIN)], now);
    expect(p.state).toBe("online");
    expect(p.label).toBe("Online now");
  });

  it("does NOT call a long-lived session active on its own", () => {
    // The whole reason this module exists: a session lasts 30 days, so an
    // unexpired session proves only that nobody signed out.
    const p = presenceFromSessions([session(21 * DAY)], now);
    expect(p.state).toBe("idle");
    expect(p.liveSessions).toBe(1);
    expect(p.label).toBe("Last seen 21 days ago");
  });

  it("separates last sign-in from last seen", () => {
    const p = presenceFromSessions([session(10 * MIN, { createdMsAgo: 3 * DAY })], now);
    expect(p.lastSignInAt).toEqual(at(3 * DAY));
    expect(p.lastSeenAt).toEqual(at(10 * MIN));
    expect(p.state).toBe("today");
  });

  it("takes the most recent stamp across several sessions", () => {
    const p = presenceFromSessions([session(5 * DAY), session(3 * MIN), session(2 * DAY)], now);
    expect(p.state).toBe("online");
    expect(p.liveSessions).toBe(3);
  });

  it("counts only unexpired sessions as live", () => {
    const p = presenceFromSessions([session(2 * MIN), session(40 * DAY, { expired: true })], now);
    expect(p.liveSessions).toBe(1);
  });

  it("reports never for an account with no sessions", () => {
    const p = presenceFromSessions([], now);
    expect(p.state).toBe("never");
    expect(p.lastSeenAt).toBeNull();
    expect(p.liveSessions).toBe(0);
  });
});

describe("formatAgo", () => {
  it("stays coarse", () => {
    expect(formatAgo(30 * 1000)).toBe("just now");
    expect(formatAgo(5 * MIN)).toBe("5 min ago");
    expect(formatAgo(1 * HOUR)).toBe("1 hour ago");
    expect(formatAgo(3 * HOUR)).toBe("3 hours ago");
    expect(formatAgo(1 * DAY)).toBe("1 day ago");
    expect(formatAgo(45 * DAY)).toBe("1 month ago");
  });
});
