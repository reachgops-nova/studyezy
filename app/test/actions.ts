"use server";

import { redirect } from "next/navigation";
import { getActiveProfileId } from "@/lib/auth";
import { assembleTerminalTest } from "@/lib/terminalTest";

// Deliberately a server action, not a cached GET route: each click builds a
// fresh terminal-test pack reflecting exactly which units are covered right
// now (see lib/terminalTest.ts), then hands off to the read-only render
// route for that specific pack - a page refresh there just re-shows the
// same test instead of silently regenerating it.
export async function startTerminalTest(subjectId: string) {
  const profileId = await getActiveProfileId();
  if (!profileId) redirect("/login");

  const packId = await assembleTerminalTest(profileId, subjectId);
  if (!packId) {
    redirect(`/select?terminalTestError=1`);
  }

  redirect(`/terminal-test/${packId}`);
}
