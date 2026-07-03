// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import {
  themeStyle,
  clampedGridCols,
  densityPy,
  densityPb,
  DENSITY_PY,
  DENSITY_PB,
  HERO_CTA_GAP_THRESHOLD_PX,
  type Density,
} from "../src/theme";

describe("themeStyle - ThemeOverride to CSS custom properties", () => {
  it("returns undefined when theme is undefined", () => {
    expect(themeStyle(undefined)).toBeUndefined();
  });

  it("returns empty object for empty theme", () => {
    expect(themeStyle({})).toEqual({});
  });

  it("maps a single key to --v-<key>", () => {
    expect(themeStyle({ "color-accent": "#ff0000" })).toEqual({
      "--v-color-accent": "#ff0000",
    });
  });

  it("maps multiple keys independently", () => {
    expect(
      themeStyle({ "color-accent": "#ff0000", "spacing-base": "1rem" })
    ).toEqual({
      "--v-color-accent": "#ff0000",
      "--v-spacing-base": "1rem",
    });
  });

  it("preserves the original value verbatim", () => {
    const val = "hsl(210 100% 50% / 0.5)";
    expect(themeStyle({ "color-bg": val })).toEqual({ "--v-color-bg": val });
  });

  it("maps an empty string value to the CSS variable preserving the empty value", () => {
    expect(themeStyle({ "color-accent": "" })).toEqual({ "--v-color-accent": "" });
  });

  it("preserves special characters in keys verbatim", () => {
    expect(themeStyle({ "font-size/lg": "1.125rem" })).toEqual({
      "--v-font-size/lg": "1.125rem",
    });
  });

  it("applies --v- prefix unconditionally regardless of existing key prefix", () => {
    expect(themeStyle({ "--v-color": "blue" })).toEqual({ "--v---v-color": "blue" });
  });
});

describe("clampedGridCols - column count clamped to valid Grid range [1, 6]", () => {
  it("clamps values below 1 to 1", () => {
    expect(clampedGridCols(0)).toBe(1);
    expect(clampedGridCols(-5)).toBe(1);
  });

  it("clamps values above 6 to 6", () => {
    expect(clampedGridCols(7)).toBe(6);
    expect(clampedGridCols(100)).toBe(6);
  });

  it("passes through every valid integer in [1, 6] unchanged", () => {
    for (let n = 1; n <= 6; n++) {
      expect(clampedGridCols(n)).toBe(n);
    }
  });

  it("rounds mid-range floats to nearest integer before clamping", () => {
    expect(clampedGridCols(1.4)).toBe(1);
    expect(clampedGridCols(1.5)).toBe(2);
    expect(clampedGridCols(1.6)).toBe(2);
    expect(clampedGridCols(3.5)).toBe(4);
    expect(clampedGridCols(4.4)).toBe(4);
    expect(clampedGridCols(4.6)).toBe(5);
  });

  it("clamps boundary floats that round to exactly 1 or 6", () => {
    expect(clampedGridCols(0.9)).toBe(1);
    expect(clampedGridCols(6.1)).toBe(6);
    expect(clampedGridCols(6.4)).toBe(6);
  });

  it("clamps negative float inputs to 1", () => {
    expect(clampedGridCols(-0.4)).toBe(1);
    expect(clampedGridCols(-1.5)).toBe(1);
  });
});

const DENSITY_ACCESSORS: ReadonlyArray<{
  name: string;
  fn: (d: Density | undefined) => number;
  map: Record<Density, number>;
}> = [
  { name: "densityPy", fn: densityPy, map: DENSITY_PY },
  { name: "densityPb", fn: densityPb, map: DENSITY_PB },
];

const DENSITIES: readonly Density[] = ["compact", "normal", "spacious"];

describe.each(DENSITY_ACCESSORS)("$name - density token accessor", ({ fn, map }) => {
  it.each(DENSITIES)("returns the %s token value", (density) => {
    expect(fn(density)).toBe(map[density]);
  });

  it("undefined falls back to normal", () => {
    expect(fn(undefined)).toBe(map.normal);
  });

  it("all three tokens are distinct", () => {
    expect(new Set(Object.values(map)).size).toBe(3);
  });

  it("compact < normal < spacious in the token scale", () => {
    expect(map.compact).toBeLessThan(map.normal);
    expect(map.normal).toBeLessThan(map.spacious);
  });

  it("all token values are positive integers", () => {
    for (const d of DENSITIES) {
      expect(Number.isInteger(map[d])).toBe(true);
      expect(map[d]).toBeGreaterThan(0);
    }
  });
});

describe("DENSITY_PB vs DENSITY_PY - cta-anchored asymmetry invariant", () => {
  it("pb is strictly less than py at every density level", () => {
    for (const d of DENSITIES) {
      expect(DENSITY_PB[d]).toBeLessThan(DENSITY_PY[d]);
    }
  });
});

describe("HERO_CTA_GAP_THRESHOLD_PX - perception gap ceiling formula", () => {
  it("exceeds the padding-only structural floor to accommodate content-driven pre-heading elements", () => {
    const paddingFloor = DENSITY_PB.normal * 4 + DENSITY_PY.normal * 4;
    expect(HERO_CTA_GAP_THRESHOLD_PX).toBeGreaterThan(paddingFloor);
  });

  it("exceeds the runtime-observed minimum gap at density=normal with typical section content", () => {
    expect(HERO_CTA_GAP_THRESHOLD_PX).toBeGreaterThan(200);
  });

  it("stays below the perception ceiling beyond which the gap is visibly egregious regardless of content", () => {
    expect(HERO_CTA_GAP_THRESHOLD_PX).toBeLessThan(400);
  });

  it("is a positive integer aligned to the 4px Tailwind pixel grid", () => {
    expect(Number.isInteger(HERO_CTA_GAP_THRESHOLD_PX)).toBe(true);
    expect(HERO_CTA_GAP_THRESHOLD_PX % 4).toBe(0);
  });
});
