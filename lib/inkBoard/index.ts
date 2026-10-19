import type { InkUnit } from "./types";
import { TAMILNADU_10_MATH_1 } from "./tamilnadustateboard-10-math-1";

export const INK_BOARD_UNITS: Record<string, InkUnit> = {
  [TAMILNADU_10_MATH_1.unitKey]: TAMILNADU_10_MATH_1,
};

export function hasInkBoardRoute(unitKey: string): boolean {
  return Boolean(INK_BOARD_UNITS[unitKey]);
}
