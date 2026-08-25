import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { recordUnitAttempt } from "@/lib/recordMastery";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

interface AttemptBody {
  unitKey: string;
  attemptType?: "progression_test" | "diagnostic";
  difficulty?: string;
  correct: number;
  total: number;
  perConcept: Record<string, { correct: number; total: number }>;
}

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, attemptType, difficulty, correct, total, perConcept } = (body ?? {}) as Partial<AttemptBody>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof correct !== "number" ||
    typeof total !== "number" ||
    total <= 0 ||
    typeof perConcept !== "object" ||
    perConcept === null
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  try {
    const result = await recordUnitAttempt({
      profileId,
      unitKey,
      attemptType: attemptType === "diagnostic" ? "diagnostic" : "progression_test",
      difficulty,
      correct,
      total,
      perConcept,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }
}
