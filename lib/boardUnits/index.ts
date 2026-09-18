import type { BoardUnit } from "./types";
import { STAGE_PREVIEWS } from "./stage-previews";
import { CAMBRIDGE_4_MATH_1 } from "./cambridge-4-math-1";
import { CAMBRIDGE_4_MATH_2 } from "./cambridge-4-math-2";
import { CAMBRIDGE_4_MATH_10 } from "./cambridge-4-math-10";
import { CAMBRIDGE_5_ENGLISH_1 } from "./cambridge-5-english-1";
import { CAMBRIDGE_5_ENGLISH_2 } from "./cambridge-5-english-2";
import { CAMBRIDGE_5_ENGLISH_3 } from "./cambridge-5-english-3";
import { PENDING_MATH_BOARD_UNITS } from "./cambridge-4-math-pending";
import { PENDING_ENGLISH_BOARD_UNITS } from "./cambridge-5-english-pending";

/**
 * Every unit that has a Drawing Board, keyed by unitKey. Adding a unit is
 * adding a data file and one line here - see ./types.ts for why that boundary
 * is drawn where it is.
 */
export const BOARD_UNITS: Record<string, BoardUnit> = {
  [STAGE_PREVIEWS.unitKey]: STAGE_PREVIEWS,
  [CAMBRIDGE_4_MATH_1.unitKey]: CAMBRIDGE_4_MATH_1,
  [CAMBRIDGE_4_MATH_2.unitKey]: CAMBRIDGE_4_MATH_2,
  [CAMBRIDGE_4_MATH_10.unitKey]: CAMBRIDGE_4_MATH_10,
  [CAMBRIDGE_5_ENGLISH_1.unitKey]: CAMBRIDGE_5_ENGLISH_1,
  [CAMBRIDGE_5_ENGLISH_2.unitKey]: CAMBRIDGE_5_ENGLISH_2,
  [CAMBRIDGE_5_ENGLISH_3.unitKey]: CAMBRIDGE_5_ENGLISH_3,
  ...PENDING_MATH_BOARD_UNITS,
  ...PENDING_ENGLISH_BOARD_UNITS,
};

/** Cambridge textbook units are DB-processed and can use the generic Board
 * adapter even before a bespoke visual file is authored. */
export function hasBoardRoute(unitKey: string): boolean {
  return Boolean(BOARD_UNITS[unitKey]) || /^cambridge-(?:4-math|5-english)-\d+$/.test(unitKey);
}
