// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { themeStyle, clampedGridCols } from "../src/theme";

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
