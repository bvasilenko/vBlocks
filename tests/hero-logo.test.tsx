// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { FIXTURE_SLUGS, loadFixture } from "@booga/vfixtures";
import { HeroSplit } from "../src/hero/HeroSplit";
import { selectBrandMarkImage, BRAND_MARK_IMAGE_FIT } from "../src/modes/brand-mark";
import type { HeroSplitContent } from "../src/hero";

const BASE_CONTENT: Omit<HeroSplitContent, "image"> = {
  heading: "Test heading",
  description: "Test description",
  primaryCta: { label: "Get started", href: "#" },
};

const IMAGE_SOURCES: ReadonlyArray<{ src: string; alt: string }> = [
  { src: "/brand/wordmark.svg", alt: "relative SVG path" },
  { src: "https://cdn.example.com/logo.png", alt: "absolute HTTPS URL to a full-size asset" },
  { src: "https://cdn.example.com/favicon.ico", alt: "small raster asset" },
];

const IMAGE_FIT_CASES: ReadonlyArray<{
  name: string;
  presentation: HeroSplitContent["presentation"];
  includedClass: string;
  excludedClass: string;
  wrapped: boolean;
}> = [
  {
    name: "default cover presentation",
    presentation: undefined,
    includedClass: "object-cover",
    excludedClass: "object-scale-down",
    wrapped: false,
  },
  {
    name: "scale-down presentation",
    presentation: { imageFit: "scale-down" },
    includedClass: "object-scale-down",
    excludedClass: "object-cover",
    wrapped: true,
  },
];

const FALLBACK_SRC = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E";

function assertNoFilterApplied(img: HTMLImageElement): void {
  expect(img.getAttribute("filter")).toBeNull();
  expect(img.style.filter).toBe("");
}

function renderImage(content: HeroSplitContent): { img: HTMLImageElement; layout: HTMLElement } {
  const { container } = render(<HeroSplit content={content} />);
  const img = container.querySelector("img") as HTMLImageElement | null;
  const layout = container.querySelector("section > *") as HTMLElement | null;
  expect(img).not.toBeNull();
  expect(layout).not.toBeNull();
  return { img: img!, layout: layout! };
}

function contentFor(
  image: { src: string; alt: string },
  presentation: HeroSplitContent["presentation"]
): HeroSplitContent {
  return presentation ? { ...BASE_CONTENT, image, presentation } : { ...BASE_CONTENT, image };
}

describe("HeroSplit image rendering contract", () => {
  for (const fitCase of IMAGE_FIT_CASES) {
    for (const image of IMAGE_SOURCES) {
      it(`${fitCase.name}: ${image.alt}`, () => {
        const { img, layout } = renderImage(contentFor(image, fitCase.presentation));
        expect(img.getAttribute("src")).toBe(image.src);
        expect(img.getAttribute("alt")).toBe(image.alt);
        assertNoFilterApplied(img);
        expect(img.getAttribute("width")).toBeNull();
        expect(img.getAttribute("height")).toBeNull();
        expect(img.classList.contains(fitCase.includedClass)).toBe(true);
        expect(img.classList.contains(fitCase.excludedClass)).toBe(false);
        if (fitCase.wrapped) {
          expect(img.parentElement).not.toBe(layout);
          expect(img.parentElement?.classList.contains("relative")).toBe(true);
          expect(img.parentElement?.classList.contains("overflow-hidden")).toBe(true);
          expect(img.parentElement?.classList.contains("lg:self-stretch")).toBe(true);
          expect(img.classList.contains("absolute")).toBe(true);
          expect(img.classList.contains("inset-0")).toBe(true);
        } else {
          expect(img.parentElement).toBe(layout);
          expect(img.classList.contains("aspect-video")).toBe(true);
        }
      });
    }
  }

  it.each(FIXTURE_SLUGS)("renders fixture-selected brand mark %s through the no-upscale presentation", (slug) => {
    const mark = selectBrandMarkImage(loadFixture(slug));
    const { img } = renderImage({
      ...BASE_CONTENT,
      image: mark,
      presentation: { imageFit: BRAND_MARK_IMAGE_FIT },
    });

    expect(img.getAttribute("src")).toBe(mark.src);
    expect(img.getAttribute("alt")).toBe(mark.alt);
    assertNoFilterApplied(img);
    expect(img.getAttribute("width")).toBeNull();
    expect(img.getAttribute("height")).toBeNull();
    expect(img.classList.contains("object-scale-down")).toBe(true);
    expect(img.classList.contains("object-cover")).toBe(false);
  });

  it.each([
    {
      name: "no error leaves the original source unchanged",
      image: { src: "https://cdn.example.com/missing.png", alt: "Brand logo", fallbackSrc: FALLBACK_SRC },
      errors: 0,
      expectedSrc: "https://cdn.example.com/missing.png",
      fallbackApplied: undefined,
    },
    {
      name: "primary failure swaps to fallback once",
      image: { src: "https://cdn.example.com/missing.png", alt: "Brand logo", fallbackSrc: FALLBACK_SRC },
      errors: 1,
      expectedSrc: FALLBACK_SRC,
      fallbackApplied: "true",
    },
    {
      name: "repeated failure does not loop after fallback is active",
      image: { src: "https://cdn.example.com/missing.png", alt: "Brand logo", fallbackSrc: FALLBACK_SRC },
      errors: 2,
      expectedSrc: FALLBACK_SRC,
      fallbackApplied: "true",
    },
    {
      name: "third and further failures remain idempotent on the fallback source",
      image: { src: "https://cdn.example.com/missing.png", alt: "Brand logo", fallbackSrc: FALLBACK_SRC },
      errors: 3,
      expectedSrc: FALLBACK_SRC,
      fallbackApplied: "true",
    },
    {
      name: "image without fallback keeps the original source on failure",
      image: { src: "https://cdn.example.com/missing.png", alt: "Brand logo" },
      errors: 1,
      expectedSrc: "https://cdn.example.com/missing.png",
      fallbackApplied: undefined,
    },
  ])("$name", ({ image, errors, expectedSrc, fallbackApplied }) => {
    const { img } = renderImage({
      ...BASE_CONTENT,
      image,
      presentation: { imageFit: "scale-down" },
    });

    for (let i = 0; i < errors; i += 1) fireEvent.error(img);

    expect(img.getAttribute("src")).toBe(expectedSrc);
    expect(img.dataset.vblocksFallbackApplied).toBe(fallbackApplied);
  });
});

describe("HeroSplit image fallback - presentation-agnostic error recovery", () => {
  it("cover presentation triggers fallback on error the same as scale-down", () => {
    const image = {
      src: "https://cdn.example.com/missing.png",
      alt: "Brand logo",
      fallbackSrc: FALLBACK_SRC,
    };
    const { img } = renderImage({ ...BASE_CONTENT, image });
    fireEvent.error(img);
    expect(img.getAttribute("src")).toBe(FALLBACK_SRC);
    expect(img.dataset.vblocksFallbackApplied).toBe("true");
  });

  it("does not swap src when fallbackSrc equals the primary src", () => {
    const src = "https://cdn.example.com/logo.png";
    const image = { src, alt: "Brand logo", fallbackSrc: src };
    const { img } = renderImage({
      ...BASE_CONTENT,
      image,
      presentation: { imageFit: "scale-down" },
    });
    fireEvent.error(img);
    expect(img.getAttribute("src")).toBe(src);
    expect(img.dataset.vblocksFallbackApplied).toBeUndefined();
  });
});
