-- Adds a last-seen stamp to each session so the admin panel can show who is
-- actually active, rather than inferring it from a session that lasts 30 days.
-- Backfilled from createdAt so existing sessions read as "last seen when they
-- signed in", which is the most honest thing we can say about them.
ALTER TABLE "Session" ADD COLUMN "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Session" SET "lastSeenAt" = "createdAt";

CREATE INDEX "Session_userId_lastSeenAt_idx" ON "Session"("userId", "lastSeenAt");
