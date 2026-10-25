import type { InkUnit } from "./types";
import { TAMILNADU_10_MATH_1 } from "./tamilnadustateboard-10-math-1";
import { CAMBRIDGE_4_TAMIL_1_INK } from "./cambridge-4-tamil-1";
import { CAMBRIDGE_4_TAMIL_2_INK } from "./cambridge-4-tamil-2";
import { CAMBRIDGE_4_TAMIL_3_INK } from "./cambridge-4-tamil-3";
import { CAMBRIDGE_4_TAMIL_4_INK } from "./cambridge-4-tamil-4";
import { CAMBRIDGE_4_TAMIL_5_INK } from "./cambridge-4-tamil-5";
import { CAMBRIDGE_4_TAMIL_6_INK } from "./cambridge-4-tamil-6";
import { CAMBRIDGE_4_TAMIL_7_INK } from "./cambridge-4-tamil-7";
import { CAMBRIDGE_4_TAMIL_8_INK } from "./cambridge-4-tamil-8";
import { CAMBRIDGE_4_TAMIL_9_INK } from "./cambridge-4-tamil-9";
import { CAMBRIDGE_4_TAMIL_10_INK } from "./cambridge-4-tamil-10";
import { CAMBRIDGE_4_TAMIL_11_INK } from "./cambridge-4-tamil-11";
import { CAMBRIDGE_4_TAMIL_12_INK } from "./cambridge-4-tamil-12";
import { CAMBRIDGE_4_TAMIL_13_INK } from "./cambridge-4-tamil-13";
import { CAMBRIDGE_4_TAMIL_14_INK } from "./cambridge-4-tamil-14";

export const INK_BOARD_UNITS: Record<string, InkUnit> = {
  [TAMILNADU_10_MATH_1.unitKey]: TAMILNADU_10_MATH_1,
  [CAMBRIDGE_4_TAMIL_1_INK.unitKey]: CAMBRIDGE_4_TAMIL_1_INK,
  [CAMBRIDGE_4_TAMIL_2_INK.unitKey]: CAMBRIDGE_4_TAMIL_2_INK,
  [CAMBRIDGE_4_TAMIL_3_INK.unitKey]: CAMBRIDGE_4_TAMIL_3_INK,
  [CAMBRIDGE_4_TAMIL_4_INK.unitKey]: CAMBRIDGE_4_TAMIL_4_INK,
  [CAMBRIDGE_4_TAMIL_5_INK.unitKey]: CAMBRIDGE_4_TAMIL_5_INK,
  [CAMBRIDGE_4_TAMIL_6_INK.unitKey]: CAMBRIDGE_4_TAMIL_6_INK,
  [CAMBRIDGE_4_TAMIL_7_INK.unitKey]: CAMBRIDGE_4_TAMIL_7_INK,
  [CAMBRIDGE_4_TAMIL_8_INK.unitKey]: CAMBRIDGE_4_TAMIL_8_INK,
  [CAMBRIDGE_4_TAMIL_9_INK.unitKey]: CAMBRIDGE_4_TAMIL_9_INK,
  [CAMBRIDGE_4_TAMIL_10_INK.unitKey]: CAMBRIDGE_4_TAMIL_10_INK,
  [CAMBRIDGE_4_TAMIL_11_INK.unitKey]: CAMBRIDGE_4_TAMIL_11_INK,
  [CAMBRIDGE_4_TAMIL_12_INK.unitKey]: CAMBRIDGE_4_TAMIL_12_INK,
  [CAMBRIDGE_4_TAMIL_13_INK.unitKey]: CAMBRIDGE_4_TAMIL_13_INK,
  [CAMBRIDGE_4_TAMIL_14_INK.unitKey]: CAMBRIDGE_4_TAMIL_14_INK,
};

export function hasInkBoardRoute(unitKey: string): boolean {
  return Boolean(INK_BOARD_UNITS[unitKey]);
}
