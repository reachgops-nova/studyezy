import type { BoardUnit } from "./types";
import { STAGE_PREVIEWS } from "./stage-previews";
import { CAMBRIDGE_4_MATH_1 } from "./cambridge-4-math-1";
import { CAMBRIDGE_4_MATH_10 } from "./cambridge-4-math-10";
import { CAMBRIDGE_5_ENGLISH_1 } from "./cambridge-5-english-1";
import { CAMBRIDGE_5_ENGLISH_2 } from "./cambridge-5-english-2";

/**
 * Every unit that has a Drawing Board, keyed by unitKey. Adding a unit is
 * adding a data file and one line here - see ./types.ts for why that boundary
 * is drawn where it is.
 */
export const BOARD_UNITS: Record<string, BoardUnit> = {
  [STAGE_PREVIEWS.unitKey]: STAGE_PREVIEWS,
  [CAMBRIDGE_4_MATH_1.unitKey]: CAMBRIDGE_4_MATH_1,
  [CAMBRIDGE_4_MATH_10.unitKey]: CAMBRIDGE_4_MATH_10,
  [CAMBRIDGE_5_ENGLISH_1.unitKey]: CAMBRIDGE_5_ENGLISH_1,
  [CAMBRIDGE_5_ENGLISH_2.unitKey]: CAMBRIDGE_5_ENGLISH_2,
};
