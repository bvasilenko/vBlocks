import { type CSSProperties } from "react";
import { type ThemeOverride } from "./types";

export function themeStyle(theme: ThemeOverride | undefined): CSSProperties | undefined {
  if (!theme) return undefined;
  return Object.fromEntries(
    Object.entries(theme).map(([k, v]) => [`--v-${k}`, v])
  ) as CSSProperties;
}

export function clampedGridCols(n: number): 1 | 2 | 3 | 4 | 5 | 6 {
  return Math.max(1, Math.min(6, n)) as 1 | 2 | 3 | 4 | 5 | 6;
}
