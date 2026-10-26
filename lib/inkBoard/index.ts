import type { InkUnit } from "./types";
import { TAMILNADU_10_MATH_1 } from "./tamilnadustateboard-10-math-1";
import { TAMILNADU_10_MATH_2 } from "./tamilnadustateboard-10-math-2";
import { TAMILNADU_10_MATH_3 } from "./tamilnadustateboard-10-math-3";
import { TAMILNADU_10_MATH_4 } from "./tamilnadustateboard-10-math-4";
import { TAMILNADU_10_MATH_5 } from "./tamilnadustateboard-10-math-5";
import { TAMILNADU_10_MATH_6 } from "./tamilnadustateboard-10-math-6";
import { TAMILNADU_10_MATH_7 } from "./tamilnadustateboard-10-math-7";
import { TAMILNADU_10_MATH_8 } from "./tamilnadustateboard-10-math-8";
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
import { CAMBRIDGE_4_TAMIL_15_INK } from "./cambridge-4-tamil-15";
import { CAMBRIDGE_4_TAMIL_16_INK } from "./cambridge-4-tamil-16";
import { CAMBRIDGE_4_TAMIL_17_INK } from "./cambridge-4-tamil-17";
import { CAMBRIDGE_4_TAMIL_18_INK } from "./cambridge-4-tamil-18";
import { CAMBRIDGE_4_TAMIL_19_INK } from "./cambridge-4-tamil-19";
import { CAMBRIDGE_4_TAMIL_20_INK } from "./cambridge-4-tamil-20";
import { CAMBRIDGE_4_TAMIL_21_INK } from "./cambridge-4-tamil-21";
import { CAMBRIDGE_4_TAMIL_22_INK } from "./cambridge-4-tamil-22";

export const INK_BOARD_UNITS: Record<string, InkUnit> = {
  [TAMILNADU_10_MATH_1.unitKey]: TAMILNADU_10_MATH_1,
  [TAMILNADU_10_MATH_2.unitKey]: TAMILNADU_10_MATH_2,
  [TAMILNADU_10_MATH_3.unitKey]: TAMILNADU_10_MATH_3,
  [TAMILNADU_10_MATH_4.unitKey]: TAMILNADU_10_MATH_4,
  [TAMILNADU_10_MATH_5.unitKey]: TAMILNADU_10_MATH_5,
  [TAMILNADU_10_MATH_6.unitKey]: TAMILNADU_10_MATH_6,
  [TAMILNADU_10_MATH_7.unitKey]: TAMILNADU_10_MATH_7,
  [TAMILNADU_10_MATH_8.unitKey]: TAMILNADU_10_MATH_8,
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
  [CAMBRIDGE_4_TAMIL_15_INK.unitKey]: CAMBRIDGE_4_TAMIL_15_INK,
  [CAMBRIDGE_4_TAMIL_16_INK.unitKey]: CAMBRIDGE_4_TAMIL_16_INK,
  [CAMBRIDGE_4_TAMIL_17_INK.unitKey]: CAMBRIDGE_4_TAMIL_17_INK,
  [CAMBRIDGE_4_TAMIL_18_INK.unitKey]: CAMBRIDGE_4_TAMIL_18_INK,
  [CAMBRIDGE_4_TAMIL_19_INK.unitKey]: CAMBRIDGE_4_TAMIL_19_INK,
  [CAMBRIDGE_4_TAMIL_20_INK.unitKey]: CAMBRIDGE_4_TAMIL_20_INK,
  [CAMBRIDGE_4_TAMIL_21_INK.unitKey]: CAMBRIDGE_4_TAMIL_21_INK,
  [CAMBRIDGE_4_TAMIL_22_INK.unitKey]: CAMBRIDGE_4_TAMIL_22_INK,
};

export function hasInkBoardRoute(unitKey: string): boolean {
  return Boolean(INK_BOARD_UNITS[unitKey]);
}
