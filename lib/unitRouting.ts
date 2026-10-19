import { hasBoardRoute } from "@/lib/boardUnits";
import { hasInkBoardRoute } from "@/lib/inkBoard";

/**
 * Single place every unit-link site resolves a unitKey to its real route -
 * ink board (lib/inkBoard) first, then the card-based RCRT Board
 * (lib/boardUnits), falling back to the legacy /learn page. Added
 * 2026-10-19 alongside the first ink-board unit so CurriculumSelector,
 * UnitSwitcher, and UnitOverview all gained the same three-way branch at
 * once instead of three copies of the same ternary silently drifting apart.
 */
export function resolveUnitHref(unitKey: string): string {
  if (hasInkBoardRoute(unitKey)) return `/board-ink/${unitKey}`;
  if (hasBoardRoute(unitKey)) return `/board/${unitKey}`;
  return `/learn/${unitKey}`;
}
