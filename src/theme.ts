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
 * Cta-anchored hero layouts keep the top rhythm from DENSITY_PY while reducing
 * bottom padding so the primary action remains visually connected to the next
 * section. The default public hero layout stays symmetric unless a caller opts
 * into this app-template presentation mode.
 */
export const DENSITY_PB: Record<Density, 6 | 12 | 16> = {
  compact: 6,
  normal: 12,
  spacious: 16,
};

export function densityPb(density: Density | undefined): 6 | 12 | 16 {
  return DENSITY_PB[density ?? "normal"];
}

/**
 * Maximum tolerated pixel gap between the hero CTA button bottom edge and the
 * first heading of the next section at density="normal". Three-component derivation:
 *   hero pb           = DENSITY_PB.normal * 4 = 48 px
 *   features pt       = DENSITY_PY.normal * 4 = 96 px
 *   heading stack     = 64 px (kicker + eyebrow + gap-3 elements above h2 in
 *                       Stripe-fixture sections content at density=normal;
 *                       measured at runtime -- not driven by a layout token)
 *   tolerance         = 8 px (subpixel rounding + viewport variance headroom)
 *   total             = 216 px
 * The padding-only floor (144 px) undershoots the runtime-observed minimum (~201 px)
 * because content-driven elements above h2 contribute ~57 px of additional offset.
 * Reducing below 216 px requires either a vBrand defaultComposition density change
 * upstream or a sections-content change (fewer pre-heading elements), not a layout edit.
 */
export const HERO_CTA_GAP_THRESHOLD_PX =
  DENSITY_PB.normal * 4 + DENSITY_PY.normal * 4 + 72;

/**
 * Tone-pill content schema item. Each pill renders through vUi's `<Pill>`
 * primitive (semantic-kind `engagement-tag`) and carries an optional tone
 * derived from vTheme 0.3.0's tone-* color roles.
 */
export type TonePill = {
  label: string;
  tone?: "ok" | "warn" | "bad" | "info" | "meta";
};
