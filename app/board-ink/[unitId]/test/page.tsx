import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import InkTestSession from "@/components/board/InkTestSession";
import { INK_BOARD_UNITS } from "@/lib/inkBoard";

// The "Test" leg of RRT, its own route the same way the card-based Board
// keeps /test/[unitId] separate from /board/[unitId] - see
// InkTestSession.tsx for why this records through the same
// recordUnitAttempt path as every other unit test.
export default async function InkTestPage({ params }: { params: Promise<{ unitId: string }> }) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { unitId } = await params;
  const unit = INK_BOARD_UNITS[unitId];
  if (!unit) notFound();

  return <InkTestSession unit={unit} />;
}
