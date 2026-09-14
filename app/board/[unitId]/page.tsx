import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import DrawingBoard from "@/components/board/DrawingBoard";
import { BOARD_UNITS } from "@/lib/boardUnits";

/**
 * The Drawing Board lives on its own route while it is being built out, so
 * the existing lesson keeps working untouched and the two can be compared
 * side by side. Once a unit's board is signed off, /learn can hand over to it.
 *
 * Full-bleed on purpose: the board is the screen, not a panel inside one, so
 * this page deliberately skips AppShell's sidebar and padding.
 */
export default async function BoardPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const user = await requireUser();
  if (!user) redirect("/login");

  const unit = BOARD_UNITS[unitId];
  if (!unit) notFound();

  return (
    <main className="fixed inset-0 overflow-hidden">
      <DrawingBoard unit={unit} />
    </main>
  );
}
