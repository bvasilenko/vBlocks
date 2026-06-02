// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { loadFixture, FIXTURE_SLUGS } from "@booga/vfixtures";
import { brandToTheme } from "./brand-theme";
import type { VbrandType } from "@booga/vbrand";

const stripe = loadFixture("stripe");

const DIRECT_COLOR_MAPPINGS: Array<{ token: string; cssKey: string }> = [
  { token: "primary",     cssKey: "color-primary"           },
  { token: "secondary",   cssKey: "color-secondary"         },
  { token: "accent",      cssKey: "color-accent"            },
  { token: "neutral-900", cssKey: "color-foreground"        },
  { token: "neutral-900", cssKey: "color-card-foreground"   },
  { token: "neutral-700", cssKey: "color-popover-foreground"},
  { token: "neutral-500", cssKey: "color-muted-foreground"  },
  { token: "success",     cssKey: "color-success"           },
  { token: "warning",     cssKey: "color-warning"           },
  { token: "error",       cssKey: "color-destructive"       },
];

const NEUTRAL_50_ROLES = ["color-background", "color-card", "color-popover"] as const;
const NEUTRAL_200_ROLES = ["color-border", "color-input"] as const;
const NEUTRAL_100_ROLES = ["color-muted"] as const;

const FONT_MAPPINGS: Array<{ typeKey: string; cssKey: string }> = [
  { typeKey: "body", cssKey: "font-sans" },
  { typeKey: "mono", cssKey: "font-mono" },
];

const CONTRAST_CASES: Array<{ background: string; expected: "#000000" | "#ffffff" }> = [
  { background: "#ffffff", expected: "#000000" },
  { background: "#f0f0f0", expected: "#000000" },
  { background: "#808080", expected: "#000000" },
  { background: "#000000", expected: "#ffffff" },
  { background: "#0a0a0a", expected: "#ffffff" },
  { background: "#606060", expected: "#ffffff" },
];

describe("brandToTheme - direct color-token passthrough", () => {
  for (const { token, cssKey } of DIRECT_COLOR_MAPPINGS) {
    it(`token "${token}" writes its value to "${cssKey}"`, () => {
      const theme = brandToTheme(stripe);
      expect(theme[cssKey]).toBe(stripe.tokens.color[token]);
    });
  }

  it("neutral-50 writes to every surface-background role", () => {
    const theme = brandToTheme(stripe);
    for (const key of NEUTRAL_50_ROLES) {
      expect(theme[key]).toBe(stripe.tokens.color["neutral-50"]);
    }
  });

  it("neutral-200 writes to every border-and-input role", () => {
    const theme = brandToTheme(stripe);
    for (const key of NEUTRAL_200_ROLES) {
      expect(theme[key]).toBe(stripe.tokens.color["neutral-200"]);
    }
  });

  it("neutral-100 writes to the muted-surface role", () => {
    const theme = brandToTheme(stripe);
    for (const key of NEUTRAL_100_ROLES) {
      expect(theme[key]).toBe(stripe.tokens.color["neutral-100"]);
    }
  });

  it("color-ring inherits the primary color value", () => {
    const theme = brandToTheme(stripe);
    expect(theme["color-ring"]).toBe(stripe.tokens.color.primary);
  });
});

describe("brandToTheme - derived contrast-foreground values", () => {
  it("primary produces a color-primary-foreground value", () => {
    const theme = brandToTheme(stripe);
    expect(theme["color-primary-foreground"]).toBeDefined();
  });

  it("secondary produces a color-secondary-foreground value", () => {
    const theme = brandToTheme(stripe);
    expect(theme["color-secondary-foreground"]).toBeDefined();
  });

  it("accent produces a color-accent-foreground value", () => {
    const theme = brandToTheme(stripe);
    expect(theme["color-accent-foreground"]).toBeDefined();
  });

  it("error produces a color-destructive-foreground value", () => {
    const theme = brandToTheme(stripe);
    expect(theme["color-destructive-foreground"]).toBeDefined();
  });

  it("every contrast-derived foreground is either #000000 or #ffffff (binary readable contrast)", () => {
    const theme = brandToTheme(stripe);
    const CONTRAST_DERIVED_KEYS = [
      "color-primary-foreground",
      "color-secondary-foreground",
      "color-accent-foreground",
      "color-destructive-foreground",
    ] as const;
    for (const key of CONTRAST_DERIVED_KEYS) {
      expect(theme[key], `${key} must be a binary contrast color`).toMatch(/^#(000000|ffffff)$/);
    }
  });

  for (const { background, expected } of CONTRAST_CASES) {
    it(`background "${background}" produces ${expected} foreground (readable contrast)`, () => {
      const brand: VbrandType = {
        ...stripe,
        tokens: { ...stripe.tokens, color: { ...stripe.tokens.color, primary: background } },
      };
      const theme = brandToTheme(brand);
      expect(theme["color-primary-foreground"]).toBe(expected);
    });
  }

  it("non-hex color value produces black foreground as a safe fallback", () => {
    const brand: VbrandType = {
      ...stripe,
      tokens: {
        ...stripe.tokens,
        color: { ...stripe.tokens.color, primary: "oklch(0.5 0.2 270)" },
      },
    };
    const theme = brandToTheme(brand);
    expect(theme["color-primary-foreground"]).toBe("#000000");
  });
});

describe("brandToTheme - font-token passthrough", () => {
  for (const { typeKey, cssKey } of FONT_MAPPINGS) {
    it(`type token "${typeKey}" writes its value to "${cssKey}"`, () => {
      const theme = brandToTheme(stripe);
      expect(theme[cssKey]).toBe(stripe.tokens.type[typeKey]);
    });
  }

  it('font-serif uses the "display" type token when present', () => {
    const theme = brandToTheme(stripe);
    expect(theme["font-serif"]).toBe(stripe.tokens.type.display);
  });

  it('font-serif falls back to "heading" when "display" is absent', () => {
    const brand: VbrandType = {
      ...stripe,
      tokens: {
        ...stripe.tokens,
        type: { ...stripe.tokens.type, display: undefined as unknown as string },
      },
    };
    const theme = brandToTheme(brand);
    expect(theme["font-serif"]).toBe(stripe.tokens.type.heading);
  });
});

describe("brandToTheme - absent token produces no output key", () => {
  it("optional color tokens absent from brand produce no CSS variable", () => {
    const minimal: VbrandType = {
      ...stripe,
      tokens: { color: { primary: "#111111" }, type: { body: "sans-serif" } },
    };
    const theme = brandToTheme(minimal);
    expect(theme["color-secondary"]).toBeUndefined();
    expect(theme["color-accent"]).toBeUndefined();
    expect(theme["color-background"]).toBeUndefined();
    expect(theme["color-muted"]).toBeUndefined();
    expect(theme["color-success"]).toBeUndefined();
    expect(theme["color-warning"]).toBeUndefined();
    expect(theme["color-destructive"]).toBeUndefined();
  });

  it("absent type tokens produce no font CSS variable", () => {
    const minimal: VbrandType = {
      ...stripe,
      tokens: { color: { primary: "#111111" }, type: {} },
    };
    const theme = brandToTheme(minimal);
    expect(theme["font-sans"]).toBeUndefined();
    expect(theme["font-mono"]).toBeUndefined();
    expect(theme["font-serif"]).toBeUndefined();
  });
});

describe("brandToTheme - purity and stability", () => {
  it("produces equal output for equal input (deterministic)", () => {
    expect(brandToTheme(stripe)).toEqual(brandToTheme(stripe));
  });

  it("does not mutate the input brand object", () => {
    const before = JSON.stringify(stripe);
    brandToTheme(stripe);
    expect(JSON.stringify(stripe)).toBe(before);
  });

  it("returns distinct output objects on each call (no shared reference)", () => {
    const a = brandToTheme(stripe);
    const b = brandToTheme(stripe);
    expect(a).not.toBe(b);
  });
});

describe("brandToTheme - cross-fixture coverage", () => {
  for (const slug of FIXTURE_SLUGS) {
    it(`fixture "${slug}" produces a non-empty theme without throwing`, () => {
      const brand = loadFixture(slug);
      let theme: ReturnType<typeof brandToTheme> | undefined;
      expect(() => { theme = brandToTheme(brand); }).not.toThrow();
      expect(Object.keys(theme!).length).toBeGreaterThan(0);
    });

    it(`fixture "${slug}" produces color-primary from its primary token`, () => {
      const brand = loadFixture(slug);
      const theme = brandToTheme(brand);
      expect(theme["color-primary"]).toBe(brand.tokens.color.primary);
    });
  }

  it("different fixtures produce different primary theme values", () => {
    const themes = FIXTURE_SLUGS.map((s) => brandToTheme(loadFixture(s))["color-primary"]);
    const unique = new Set(themes);
    expect(unique.size).toBeGreaterThan(1);
  });
});
