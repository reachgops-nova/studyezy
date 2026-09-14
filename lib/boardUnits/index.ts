import type { BoardUnit } from "./types";
import { CAMBRIDGE_4_MATH_10 } from "./cambridge-4-math-10";

/**
 * Every unit that has a Drawing Board, keyed by unitKey. Adding a unit is
 * adding a data file and one line here - see ./types.ts for why that boundary
 * is drawn where it is.
 */
export const BOARD_UNITS: Record<string, BoardUnit> = {
  [CAMBRIDGE_4_MATH_10.unitKey]: CAMBRIDGE_4_MATH_10,
};
