// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroCentered } from "../src/hero/HeroCentered";
import { HeroSplit } from "../src/hero/HeroSplit";
import { DENSITY_PY, DENSITY_PB, HERO_CTA_GAP_THRESHOLD_PX, type Density } from "../src/theme";
import type { HeroSplitContent } from "../src/hero";

const DENSITIES: readonly Density[] = ["compact", "normal", "spacious"];

const BASE_CONTENT = {
  heading: "Test heading",
  description: "Test description",
  primaryCta: { label: "Get started", href: "#" },
};

const IMAGE = { src: "/test.png", alt: "test" };

const HERO_PADDING_CASES: ReadonlyArray<{
  name: string;
  renderHero: (density?: Density) => ReturnType<typeof render>;
  spacing: "symmetric" | "cta-anchored";
}> = [
  {
    name: "HeroCentered default",
    renderHero: (density) => render(<HeroCentered content={{ ...BASE_CONTENT, density }} />),
    spacing: "symmetric",
  },
  {
    name: "HeroSplit default",
    renderHero: (density) => render(<HeroSplit content={{ ...BASE_CONTENT, image: IMAGE, density }} />),
    spacing: "symmetric",
  },
  {
    name: "HeroSplit cta-anchored presentation",
    renderHero: (density) =>
      render(
        <HeroSplit
          content={{
            ...BASE_CONTENT,
            image: IMAGE,
            density,
            presentation: { spacing: "cta-anchored" },
          }}
        />
      ),
    spacing: "cta-anchored",
  },
];

function heroLayout(container: HTMLElement): HTMLElement {
  const layout = container.querySelector("section > *") as HTMLElement | null;
  expect(layout).not.toBeNull();
  return layout!;
}

function classStartsWith(el: HTMLElement, prefix: string): boolean {
  return Array.from(el.classList).some((className) => className.startsWith(prefix));
}

describe("Hero vertical density contract", () => {
  it("exports the app-template CTA gap threshold from the density scale", () => {
    expect(HERO_CTA_GAP_THRESHOLD_PX).toBe(DENSITY_PB.normal * 4 + DENSITY_PY.normal * 4 + 16);
  });

  for (const heroCase of HERO_PADDING_CASES) {
    for (const density of DENSITIES) {
      it(`${heroCase.name}: density ${density}`, () => {
        const layout = heroLayout(heroCase.renderHero(density).container);
        if (heroCase.spacing === "symmetric") {
          expect(layout.classList.contains(`py-${DENSITY_PY[density]}`)).toBe(true);
          expect(classStartsWith(layout, "pt-")).toBe(false);
          expect(classStartsWith(layout, "pb-")).toBe(false);
        } else {
          expect(layout.classList.contains(`pt-${DENSITY_PY[density]}`)).toBe(true);
          expect(layout.classList.contains(`pb-${DENSITY_PB[density]}`)).toBe(true);
          expect(classStartsWith(layout, "py-")).toBe(false);
        }
      });
    }

    it(`${heroCase.name}: undefined density equals normal density`, () => {
      const unspecified = heroLayout(heroCase.renderHero(undefined).container).className;
      const normal = heroLayout(heroCase.renderHero("normal").container).className;
      expect(unspecified).toBe(normal);
    });
  }
});

describe("Hero layout structure contract", () => {
  it("HeroCentered keeps centered single-column reading axis", () => {
    const layout = heroLayout(render(<HeroCentered content={BASE_CONTENT} />).container);
    expect(layout.classList.contains("max-w-3xl")).toBe(true);
    expect(layout.classList.contains("mx-auto")).toBe(true);
    expect(layout.classList.contains("text-center")).toBe(true);
    expect(layout.classList.contains("items-center")).toBe(true);
  });

  it("HeroSplit default keeps existing centered two-column layout", () => {
    const layout = heroLayout(render(<HeroSplit content={{ ...BASE_CONTENT, image: IMAGE }} />).container);
    expect(layout.classList.contains("items-center")).toBe(true);
    expect(layout.classList.contains("items-start")).toBe(false);
    expect(layout.classList.contains("grid-cols-1")).toBe(true);
    expect(layout.classList.contains("lg:grid-cols-2")).toBe(true);
    expect(layout.classList.contains("max-w-6xl")).toBe(true);
    expect(layout.classList.contains("mx-auto")).toBe(true);
  });

  it("HeroSplit cta-anchored presentation aligns columns independently", () => {
    const content: HeroSplitContent = {
      ...BASE_CONTENT,
      image: IMAGE,
      presentation: { spacing: "cta-anchored" },
    };
    const layout = heroLayout(render(<HeroSplit content={content} />).container);
    expect(layout.classList.contains("items-start")).toBe(true);
    expect(layout.classList.contains("items-center")).toBe(false);
  });
});
