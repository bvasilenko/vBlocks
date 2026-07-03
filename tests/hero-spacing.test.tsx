// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroCentered } from "../src/hero/HeroCentered";
import { HeroSplit } from "../src/hero/HeroSplit";
import { FeaturesGrid } from "../src/features";
import { DENSITY_PY, DENSITY_PB, type Density } from "../src/theme";
import type { HeroSplitContent } from "../src/hero";
import type { FeaturesGridContent } from "../src/features";

const DENSITIES: readonly Density[] = ["compact", "normal", "spacious"];

const BASE_CONTENT = {
  heading: "Test heading",
  description: "Test description",
  primaryCta: { label: "Get started", href: "#" },
};

const IMAGE = { src: "/test.png", alt: "test" };

const ADJACENT_FEATURES: FeaturesGridContent = {
  heading: "What defines Stripe",
  features: [{ title: "Reliability", description: "99.999% uptime SLA" }],
};

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

function sectionLayout(section: Element): HTMLElement {
  const layout = section.firstElementChild as HTMLElement | null;
  expect(layout).not.toBeNull();
  return layout!;
}

function heroLayout(container: HTMLElement): HTMLElement {
  const section = container.querySelector("section");
  expect(section).not.toBeNull();
  return sectionLayout(section!);
}

function classStartsWith(el: HTMLElement, prefix: string): boolean {
  return Array.from(el.classList).some((className) => className.startsWith(prefix));
}

describe("Hero vertical density contract", () => {
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

describe("HeroSplit cta-anchored presentation - independent prop composition", () => {
  it("imageFit scale-down and cta-anchored spacing apply independently without overriding each other", () => {
    const content: HeroSplitContent = {
      ...BASE_CONTENT,
      image: IMAGE,
      presentation: { spacing: "cta-anchored", imageFit: "scale-down" },
    };
    const { container } = render(<HeroSplit content={content} />);
    const img = container.querySelector("img")!;
    const layout = heroLayout(container);
    expect(img.classList.contains("object-scale-down")).toBe(true);
    expect(img.parentElement!.classList.contains("relative")).toBe(true);
    expect(layout.classList.contains("items-start")).toBe(true);
    expect(layout.classList.contains(`pt-${DENSITY_PY.normal}`)).toBe(true);
    expect(layout.classList.contains(`pb-${DENSITY_PB.normal}`)).toBe(true);
  });
});

describe("cta-anchored hero-to-next-section cross-section gap token contract", () => {
  for (const density of DENSITIES) {
    it(`density ${density}: hero pb and adjacent features py carry density-derived Tailwind classes`, () => {
      const { container } = render(
        <div>
          <HeroSplit
            content={{
              ...BASE_CONTENT,
              image: IMAGE,
              density,
              presentation: { spacing: "cta-anchored" },
            }}
          />
          <FeaturesGrid content={ADJACENT_FEATURES} />
        </div>
      );

      const sections = container.querySelectorAll("section");
      expect(sections).toHaveLength(2);

      const heroGrid = sectionLayout(sections[0]);
      const featuresStack = sectionLayout(sections[1]);

      expect(heroGrid.classList.contains(`pb-${DENSITY_PB[density]}`)).toBe(true);
      expect(featuresStack.classList.contains(`py-${DENSITY_PY.normal}`)).toBe(true);
    });
  }
});
