// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { loadFixture } from "@booga/vfixtures";
import { CompositionSpecSchema } from "@booga/vbrand/composition";
import { TEMPLATE_IDS } from "@booga/vbrand/templates";
import type { CompositionSpec } from "@booga/vbrand/composition";
import { catalogMode } from "./catalog";
import { canvasMode } from "./canvas";
import { makeAppTemplateMode } from "./app-template";
import { selectBrandMarkImage } from "./brand-mark";
import type { GalleryMode } from "./gallery-mode";

const stripe = loadFixture("stripe");

const CATALOG_MODES: GalleryMode[] = [catalogMode, canvasMode];

const APP_TEMPLATE_MODES: GalleryMode[] = TEMPLATE_IDS.map(makeAppTemplateMode);

const ALL_MODES: GalleryMode[] = [...CATALOG_MODES, ...APP_TEMPLATE_MODES];

describe("GalleryMode contract - modeId()", () => {
  for (const mode of ALL_MODES) {
    it(`${mode.modeId()}: returns a non-empty string`, () => {
      expect(typeof mode.modeId()).toBe("string");
      expect(mode.modeId().length).toBeGreaterThan(0);
    });
  }

  it("each mode produces a distinct modeId", () => {
    const ids = ALL_MODES.map((m) => m.modeId());
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("GalleryMode contract - defaultComposition()", () => {
  for (const mode of ALL_MODES) {
    it(`${mode.modeId()}: returns a valid CompositionSpec`, () => {
      const spec = mode.defaultComposition();
      expect(() => CompositionSpecSchema.parse(spec)).not.toThrow();
    });

    it(`${mode.modeId()}: composition has at least one section`, () => {
      const spec = mode.defaultComposition();
      expect(spec.sections.length).toBeGreaterThan(0);
    });
  }
});

describe("GalleryMode contract - compose() rendering", () => {
  for (const mode of ALL_MODES) {
    it(`${mode.modeId()}: renders without throwing against Stripe fixture`, () => {
      const spec = mode.defaultComposition();
      expect(() =>
        render(createElement(() => mode.compose(stripe, spec) as JSX.Element))
      ).not.toThrow();
    });

    it(`${mode.modeId()}: compose() returns a non-null ReactNode`, () => {
      const spec = mode.defaultComposition();
      expect(mode.compose(stripe, spec)).not.toBeNull();
    });

    it(`${mode.modeId()}: renders without throwing when all sections are hidden`, () => {
      const hidden: CompositionSpec = {
        sections: mode.defaultComposition().sections.map((s) => ({ ...s, visible: false })),
      };
      expect(() =>
        render(createElement(() => mode.compose(stripe, hidden) as JSX.Element))
      ).not.toThrow();
    });
  }

  for (const mode of CATALOG_MODES) {
    it(`${mode.modeId()}: gracefully skips sections with IDs absent from the registry`, () => {
      const spec: CompositionSpec = {
        sections: [
          { id: "hero/split", visible: true, density: "regular", order: 0 },
          { id: "unknown/section", visible: true, density: "regular", order: 1 },
        ],
      };
      expect(() =>
        render(createElement(() => mode.compose(stripe, spec) as JSX.Element))
      ).not.toThrow();
    });
  }
});

describe("GalleryMode contract - brand theme injection", () => {
  it("catalogMode.compose() sets brand CSS variables on the root wrapper", () => {
    const spec = catalogMode.defaultComposition();
    const { container } = render(
      createElement(() => catalogMode.compose(stripe, spec) as JSX.Element)
    );
    const style = (container.firstElementChild as HTMLElement).getAttribute("style") ?? "";
    expect(style).toContain("--v-color-primary");
    expect(style).toContain("--v-color-background");
    expect(style).toContain("--v-font-sans");
  });

  it("canvasMode.compose() sets brand CSS variables on the root wrapper", () => {
    const spec = canvasMode.defaultComposition();
    const { container } = render(
      createElement(() => canvasMode.compose(stripe, spec) as JSX.Element)
    );
    const style = (container.firstElementChild as HTMLElement).getAttribute("style") ?? "";
    expect(style).toContain("--v-color-primary");
  });
});

describe("App-template hero presentation boundary", () => {
  const heroTemplateIds = TEMPLATE_IDS.filter((templateId) =>
    makeAppTemplateMode(templateId).defaultComposition().sections.some((section) => section.id === "hero")
  );

  for (const templateId of heroTemplateIds) {
    it(`${templateId}: visible hero sections receive app-template presentation`, () => {
      const mode = makeAppTemplateMode(templateId);
      const spec = mode.defaultComposition();
      const { container } = render(
        createElement(() => mode.compose(stripe, spec) as JSX.Element)
      );
      const heroLayout = container.querySelector("section > *") as HTMLElement | null;
      const img = container.querySelector("section img") as HTMLImageElement | null;
      expect(heroLayout).not.toBeNull();
      expect(img).not.toBeNull();
      expect(heroLayout!.classList.contains("items-start")).toBe(true);
      expect(heroLayout!.classList.contains("items-center")).toBe(false);
      expect(heroLayout!.classList.contains("pt-24")).toBe(true);
      expect(heroLayout!.classList.contains("pb-12")).toBe(true);
      expect(heroLayout!.classList.contains("py-24")).toBe(false);
      expect(img!.classList.contains("object-scale-down")).toBe(true);
      expect(img!.classList.contains("object-cover")).toBe(false);
      expect(img!.getAttribute("src")).toBe(selectBrandMarkImage(stripe).src);
    });
  }
});
