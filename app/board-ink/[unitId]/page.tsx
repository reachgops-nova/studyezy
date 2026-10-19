import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import InkBoard from "@/components/board/InkBoard";
import { INK_BOARD_UNITS } from "@/lib/inkBoard";

// Mirrors app/board/[unitId]/teacher-writing/page.tsx's wiring - a plain
// server component that resolves the unit and hands it to the client
// InkBoard player. See lib/inkBoard/types.ts for why this is data-driven
// (INK_BOARD_UNITS) rather than one hardcoded page per topic.
export default async function InkBoardPage({ params }: { params: Promise<{ unitId: string }> }) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { unitId } = await params;
  const unit = INK_BOARD_UNITS[unitId];
  if (!unit) notFound();

  return <InkBoard unit={unit} />;
}
