// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import { FIXTURE_SLUGS, loadFixture } from "@booga/vfixtures";
import type { VbrandType } from "@booga/vbrand";
import { selectBrandMarkImage, BRAND_MARK_IMAGE_FIT } from "../src/modes/brand-mark";
import { HeroSplitPresentationSchema } from "../src/hero/HeroSplit/schema";

type AssetOverride = Partial<{
  favicon: Partial<VbrandType["assets"]["favicon"]>;
  og: Partial<VbrandType["assets"]["og"]>;
  icons: Partial<VbrandType["assets"]["icons"]>;
}>;

type BrandOverride = Omit<Partial<VbrandType>, "assets"> & {
  assets?: AssetOverride;
};

type SourceCase = {
  name: string;
  brand: VbrandType;
  expectedSrc: string;
};

const BASE_BRAND = loadFixture("stripe") as VbrandType;

const LOW_FIDELITY_PATTERN = /\b(favicon|apple-touch-icon|mstile|shortcut-icon)\b|\.(ico|cur)(?:[?#].*)?$/i;

function brandWith(overrides: BrandOverride): VbrandType {
  return {
    ...BASE_BRAND,
    ...overrides,
    assets: {
      ...BASE_BRAND.assets,
      ...overrides.assets,
      favicon: {
        ...BASE_BRAND.assets.favicon,
        ...overrides.assets?.favicon,
      },
      og: {
        ...BASE_BRAND.assets.og,
        ...overrides.assets?.og,
      },
      icons: {
        ...BASE_BRAND.assets.icons,
        ...overrides.assets?.icons,
      },
    },
  };
}

function brandFromAssets(assets: BrandOverride["assets"], marks?: VbrandType["marks"]): VbrandType {
  return brandWith({
    name: "Acme",
    marks,
    assets,
  });
}

function decodedFallback(brand: VbrandType): string {
  return decodeURIComponent(selectBrandMarkImage(brand).fallbackSrc);
}

describe("selectBrandMarkImage - source ranking", () => {
  const cases: SourceCase[] = [
    {
      name: "explicit SVG mark outranks generated assets",
      brand: brandFromAssets(
        {
          og: { source: "https://cdn.example.com/og-1200.png", dimensions: [1200, 630] },
          icons: { source: "https://cdn.example.com/icons", set: ["https://cdn.example.com/icon.svg"] },
        },
        { variants: [{ name: "wordmark", source: "https://cdn.example.com/wordmark.svg" }] }
      ),
      expectedSrc: "https://cdn.example.com/wordmark.svg",
    },
    {
      name: "explicit raster mark outranks generated SVG icon fallback",
      brand: brandFromAssets(
        {
          icons: { source: "https://cdn.example.com/icons", set: ["https://cdn.example.com/icon.svg"] },
        },
        { variants: [{ name: "logo", source: "https://cdn.example.com/logo-1024.png" }] }
      ),
      expectedSrc: "https://cdn.example.com/logo-1024.png",
    },
    {
      name: "high-dimension OG image outranks generated raster icons",
      brand: brandFromAssets({
        og: { source: "https://cdn.example.com/og-1200.png", dimensions: [1200, 630] },
        icons: { source: "https://cdn.example.com/icons", set: ["https://cdn.example.com/icon.png"] },
      }),
      expectedSrc: "https://cdn.example.com/og-1200.png",
    },
    {
      name: "generated SVG icon outranks weak OG image",
      brand: brandFromAssets({
        og: { source: "https://cdn.example.com/og-120.png", dimensions: [120, 60] },
        icons: { source: "https://cdn.example.com/icons", set: ["https://cdn.example.com/icon.svg"] },
      }),
      expectedSrc: "https://cdn.example.com/icon.svg",
    },
    {
      name: "OG image outranks low-fidelity generated icons",
      brand: brandFromAssets({
        favicon: { source: "https://cdn.example.com/favicon.ico", sizes: [16] },
        og: { source: "https://cdn.example.com/social.png", dimensions: [1200, 630] },
        icons: {
          source: "https://cdn.example.com/icons",
          set: ["https://cdn.example.com/favicon.ico", "https://cdn.example.com/apple-touch-icon.png"],
        },
      }),
      expectedSrc: "https://cdn.example.com/social.png",
    },
    {
      name: "extensionless explicit mark outranks generated assets",
      brand: brandFromAssets(
        {
          og: { source: "https://cdn.example.com/og-1200.png", dimensions: [1200, 630] },
        },
        { variants: [{ name: "brand mark", source: "https://cdn.example.com/logo" }] }
      ),
      expectedSrc: "https://cdn.example.com/logo",
    },
    {
      name: "favicon remains terminal fallback when no stronger source exists",
      brand: brandFromAssets({
        favicon: { source: "https://cdn.example.com/favicon.ico", sizes: [16] },
        og: { source: undefined, dimensions: [1200, 630] },
        icons: { source: "https://cdn.example.com/icons", set: [] },
      }),
      expectedSrc: "https://cdn.example.com/favicon.ico",
    },
  ];

  it.each(cases)("$name", ({ brand, expectedSrc }) => {
    const image = selectBrandMarkImage(brand);
    expect(image.src).toBe(expectedSrc);
    expect(image.alt).toBe(`${brand.name} logo`);
  });

  it.each([
    { dimensions: [1000, 500] as [number, number], expectedSrc: "https://cdn.example.com/og-1000.png" },
    { dimensions: [512, 256] as [number, number], expectedSrc: "https://cdn.example.com/og-512.png" },
    { dimensions: [256, 128] as [number, number], expectedSrc: "https://cdn.example.com/og-256.png" },
    { dimensions: [255, 127] as [number, number], expectedSrc: "https://cdn.example.com/icon.png" },
  ])("balances OG dimensions against generated raster icons %#", ({ dimensions, expectedSrc }) => {
    const brand = brandFromAssets({
      og: { source: `https://cdn.example.com/og-${dimensions[0]}.png`, dimensions },
      icons: { source: "https://cdn.example.com/icons", set: ["https://cdn.example.com/icon.png"] },
    });
    expect(selectBrandMarkImage(brand).src).toBe(expectedSrc);
  });
});

describe("selectBrandMarkImage - deterministic fallback image", () => {
  it("generates a data SVG fallback with escaped brand text and brand colors", () => {
    const brand = brandWith({
      name: "A&B <Brand>",
      tokens: {
        ...BASE_BRAND.tokens,
        color: {
          ...BASE_BRAND.tokens.color,
          primary: "#123456",
          secondary: "#abcdef",
        },
      },
    });
    const svg = decodedFallback(brand);
    expect(selectBrandMarkImage(brand).fallbackSrc).toMatch(/^data:image\/svg\+xml;charset=UTF-8,/);
    expect(svg).toContain("#123456");
    expect(svg).toContain("#abcdef");
    expect(svg).toContain("A&amp;B &lt;Brand&gt;");
  });

  it("uses safe fallback text and colors when brand values are blank", () => {
    const brand = brandWith({
      name: " ",
      tokens: {
        ...BASE_BRAND.tokens,
        color: {
          ...BASE_BRAND.tokens.color,
          primary: "",
          secondary: "",
        },
      },
    });
    const svg = decodedFallback(brand);
    expect(svg).toContain("#111827");
    expect(svg).toContain("#ffffff");
    expect(svg).toContain(">Brand<");
  });
});

describe("selectBrandMarkImage - packaged fixture integration", () => {
  it.each(FIXTURE_SLUGS)("fixture %s avoids low-fidelity sources when stronger alternatives exist", (slug) => {
    const brand = loadFixture(slug) as VbrandType;
    const image = selectBrandMarkImage(brand);
    const strongerSources = [
      brand.assets.og.source,
      ...(brand.marks?.variants ?? []).map((variant) => variant.source),
      ...brand.assets.icons.set.filter((source) => !LOW_FIDELITY_PATTERN.test(source)),
    ].filter(Boolean);
    if (strongerSources.length > 0) {
      expect(image.src).not.toMatch(LOW_FIDELITY_PATTERN);
    }
    expect(image.fallbackSrc).toMatch(/^data:image\/svg\+xml;charset=UTF-8,/);
  });
});

describe("BRAND_MARK_IMAGE_FIT - HeroSplit presentation schema contract", () => {
  it("is accepted by HeroSplitPresentationSchema as a valid imageFit value", () => {
    expect(() => HeroSplitPresentationSchema.parse({ imageFit: BRAND_MARK_IMAGE_FIT })).not.toThrow();
  });

  it("is a member of the HeroSplitPresentation imageFit enum", () => {
    const imageFitOptions = HeroSplitPresentationSchema.shape.imageFit.unwrap().options;
    expect(imageFitOptions).toContain(BRAND_MARK_IMAGE_FIT);
  });
});
