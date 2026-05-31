// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type CSSProperties } from "react";
import { type ThemeOverride } from "./types";

export function themeStyle(theme: ThemeOverride | undefined): CSSProperties | undefined {
  if (!theme) return undefined;
  return Object.fromEntries(
    Object.entries(theme).map(([k, v]) => [`--v-${k}`, v])
  ) as CSSProperties;
}

export function clampedGridCols(n: number): 1 | 2 | 3 | 4 | 5 | 6 {
  return Math.max(1, Math.min(6, Math.round(n))) as 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Density token for section vertical padding. Maps to the vDsl `py` prop
 * scale (12 / 24 / 32) so consumers can opt out of the proposal-rich `py-24`
 * default without dropping to a className override.
 *
 * - `compact`  -> py-12 (legacy 0.3.x section rhythm)
 * - `normal`   -> py-24 (proposal default; rich vertical breathing room)
 * - `spacious` -> py-32 (hero-grade rhythm for marquee sections)
 */
export type Density = "compact" | "normal" | "spacious";

export const DENSITY_PY: Record<Density, 12 | 24 | 32> = {
  compact: 12,
  normal: 24,
  spacious: 32,
};

export function densityPy(density: Density | undefined): 12 | 24 | 32 {
  return DENSITY_PY[density ?? "normal"];
}

/**
 * Tone-pill content schema item. Each pill renders through vUi's `<Pill>`
 * primitive (semantic-kind `engagement-tag`) and carries an optional tone
 * derived from vTheme 0.3.0's tone-* color roles.
 */
export type TonePill = {
  label: string;
  tone?: "ok" | "warn" | "bad" | "info" | "meta";
};
