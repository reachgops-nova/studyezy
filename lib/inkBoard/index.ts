import type { InkUnit } from "./types";
import { TAMILNADU_10_MATH_1 } from "./tamilnadustateboard-10-math-1";
import { CAMBRIDGE_4_TAMIL_1_INK } from "./cambridge-4-tamil-1";
import { CAMBRIDGE_4_TAMIL_2_INK } from "./cambridge-4-tamil-2";
import { CAMBRIDGE_4_TAMIL_3_INK } from "./cambridge-4-tamil-3";
import { CAMBRIDGE_4_TAMIL_4_INK } from "./cambridge-4-tamil-4";
import { CAMBRIDGE_4_TAMIL_5_INK } from "./cambridge-4-tamil-5";
import { CAMBRIDGE_4_TAMIL_6_INK } from "./cambridge-4-tamil-6";
import { CAMBRIDGE_4_TAMIL_7_INK } from "./cambridge-4-tamil-7";

export const INK_BOARD_UNITS: Record<string, InkUnit> = {
  [TAMILNADU_10_MATH_1.unitKey]: TAMILNADU_10_MATH_1,
  [CAMBRIDGE_4_TAMIL_1_INK.unitKey]: CAMBRIDGE_4_TAMIL_1_INK,
  [CAMBRIDGE_4_TAMIL_2_INK.unitKey]: CAMBRIDGE_4_TAMIL_2_INK,
  [CAMBRIDGE_4_TAMIL_3_INK.unitKey]: CAMBRIDGE_4_TAMIL_3_INK,
  [CAMBRIDGE_4_TAMIL_4_INK.unitKey]: CAMBRIDGE_4_TAMIL_4_INK,
  [CAMBRIDGE_4_TAMIL_5_INK.unitKey]: CAMBRIDGE_4_TAMIL_5_INK,
  [CAMBRIDGE_4_TAMIL_6_INK.unitKey]: CAMBRIDGE_4_TAMIL_6_INK,
  [CAMBRIDGE_4_TAMIL_7_INK.unitKey]: CAMBRIDGE_4_TAMIL_7_INK,
};

export function hasInkBoardRoute(unitKey: string): boolean {
  return Boolean(INK_BOARD_UNITS[unitKey]);
}
