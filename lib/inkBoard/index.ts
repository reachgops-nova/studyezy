import type { InkUnit } from "./types";
import { TAMILNADU_10_MATH_1 } from "./tamilnadustateboard-10-math-1";
import { CAMBRIDGE_4_TAMIL_1_INK } from "./cambridge-4-tamil-1";
import { CAMBRIDGE_4_TAMIL_5_INK } from "./cambridge-4-tamil-5";

export const INK_BOARD_UNITS: Record<string, InkUnit> = {
  [TAMILNADU_10_MATH_1.unitKey]: TAMILNADU_10_MATH_1,
  [CAMBRIDGE_4_TAMIL_1_INK.unitKey]: CAMBRIDGE_4_TAMIL_1_INK,
  [CAMBRIDGE_4_TAMIL_5_INK.unitKey]: CAMBRIDGE_4_TAMIL_5_INK,
};

export function hasInkBoardRoute(unitKey: string): boolean {
  return Boolean(INK_BOARD_UNITS[unitKey]);
}
