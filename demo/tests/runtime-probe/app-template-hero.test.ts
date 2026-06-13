// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { test, expect, type Locator, type Page } from "@playwright/test";
import { HERO_CTA_GAP_THRESHOLD_PX } from "../../../src/theme";

const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173").replace(/\/$/, "");

type Size = {
  width: number;
  height: number;
};

type BrandMarkMetrics = {
  complete: boolean;
  currentSrc: string;
  natural: Size;
  contentBox: Size;
  objectFit: string;
  filter: string;
};

const LOW_FIDELITY_SOURCE = /\b(favicon|apple-touch-icon|mstile|shortcut-icon|social-mark|social-square)\b|\.(ico|cur)(?:[?#].*)?$/i;

function heroSection(page: Page): Locator {
  return page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) }).first();
}

function heroBrandMark(page: Page): Locator {
  return heroSection(page).getByRole("img", { name: /logo/i }).first();
}

function concreteScaleDownSize(natural: Size, contentBox: Size): Size {
  if (natural.width <= 0 || natural.height <= 0 || contentBox.width <= 0 || contentBox.height <= 0) {
    return { width: 0, height: 0 };
  }
  if (natural.width <= contentBox.width && natural.height <= contentBox.height) {
    return natural;
  }
  const ratio = Math.min(contentBox.width / natural.width, contentBox.height / natural.height);
  return { width: natural.width * ratio, height: natural.height * ratio };
}

async function readBrandMarkMetrics(page: Page): Promise<BrandMarkMetrics> {
  const mark = heroBrandMark(page);
  return mark.evaluate((img) => {
    const style = window.getComputedStyle(img);
    const rect = img.getBoundingClientRect();
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return {
      complete: img.complete,
      currentSrc: img.currentSrc,
      natural: { width: img.naturalWidth, height: img.naturalHeight },
      contentBox: {
        width: Math.max(0, rect.width - paddingX),
        height: Math.max(0, rect.height - paddingY),
      },
      objectFit: style.objectFit,
      filter: style.filter,
    };
  });
}

const SCALE_DOWN_CASES: Array<{ name: string; natural: Size; contentBox: Size; expected: Size }> = [
  {
    name: "returns zero when intrinsic width is missing",
    natural: { width: 0, height: 24 },
    contentBox: { width: 120, height: 80 },
    expected: { width: 0, height: 0 },
  },
  {
    name: "keeps native size when the raster already fits",
    natural: { width: 32, height: 32 },
    contentBox: { width: 160, height: 120 },
    expected: { width: 32, height: 32 },
  },
  {
    name: "downscales by width for wide rasters",
    natural: { width: 400, height: 100 },
    contentBox: { width: 200, height: 200 },
    expected: { width: 200, height: 50 },
  },
  {
    name: "downscales by height for tall rasters",
    natural: { width: 100, height: 400 },
    contentBox: { width: 200, height: 100 },
    expected: { width: 25, height: 100 },
  },
];

test.describe("object-fit scale-down sizing", () => {
  for (const { name, natural, contentBox, expected } of SCALE_DOWN_CASES) {
    test(name, () => {
      expect(concreteScaleDownSize(natural, contentBox)).toEqual(expected);
    });
  }
});

test("app-template hero brand mark uses a high-fidelity source without CSS filter or raster upscale", async ({ page }) => {
  await page.goto(`${BASE}/?mode=app-template`);
  const mark = heroBrandMark(page);
  await expect(mark).toBeVisible();
  await expect(mark).toHaveJSProperty("complete", true);
  await expect.poll(() => mark.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(() => mark.evaluate((img) => img.naturalHeight)).toBeGreaterThan(0);

  const metrics = await readBrandMarkMetrics(page);
  const concreteObject = concreteScaleDownSize(metrics.natural, metrics.contentBox);

  expect(metrics.complete).toBe(true);
  expect(metrics.currentSrc).not.toMatch(LOW_FIDELITY_SOURCE);
  expect(metrics.filter).toBe("none");
  expect(metrics.objectFit).toBe("scale-down");
  expect(concreteObject.width).toBeLessThanOrEqual(metrics.natural.width);
  expect(concreteObject.height).toBeLessThanOrEqual(metrics.natural.height);
});

test("app-template hero-to-features section gap stays below the exported threshold", async ({ page }) => {
  await page.goto(`${BASE}/?mode=app-template`);
  const section = heroSection(page);
  const gap = await section.evaluate((hero) => {
    const ctaBtn = hero.querySelector("a");
    const nextSection = hero.nextElementSibling as HTMLElement | null;
    if (!nextSection) return null;
    const heading = nextSection.querySelector("h2, h3") as HTMLElement | null;
    if (!ctaBtn || !heading) return null;
    return heading.getBoundingClientRect().top - ctaBtn.getBoundingClientRect().bottom;
  });
  expect(gap).not.toBeNull();
  expect(gap as number).toBeLessThan(HERO_CTA_GAP_THRESHOLD_PX);
});

test("app-template hero region screenshot is captured as a reviewable probe artifact", async ({ page }, testInfo) => {
  await page.goto(`${BASE}/?mode=app-template`);
  const section = heroSection(page);
  await expect(section).toBeVisible();
  const box = await section.boundingBox();
  expect(box).not.toBeNull();
  const screenshot = await page.screenshot({
    clip: { x: box!.x, y: box!.y, width: box!.width, height: Math.min(box!.height, 600) },
  });
  await testInfo.attach("hero-region", { body: screenshot, contentType: "image/png" });
  expect(screenshot.byteLength).toBeGreaterThan(0);
});
