// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { themeStyle, clampedGridCols } from "../src/theme";

describe("themeStyle — ThemeOverride to CSS custom properties", () => {
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
});

describe("clampedGridCols — column count clamped to valid Grid range [1, 6]", () => {
  it("clamps values below 1 to 1", () => {
    expect(clampedGridCols(0)).toBe(1);
    expect(clampedGridCols(-5)).toBe(1);
  });

  it("clamps values above 6 to 6", () => {
    expect(clampedGridCols(7)).toBe(6);
    expect(clampedGridCols(100)).toBe(6);
  });

  it("passes through every valid value in [1, 6] unchanged", () => {
    for (let n = 1; n <= 6; n++) {
      expect(clampedGridCols(n)).toBe(n);
    }
  });
});
