// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { test, expect, type Locator, type Page } from "@playwright/test";

const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173").replace(/\/$/, "");

const MOBILE = { width: 375, height: 812 };

const DRAWER_MODES = [
  { mode: "canvas",  drawerLabel: "Variant selector" },
  { mode: "catalog", drawerLabel: "Catalog options"  },
] as const;

const BACKDROP = 'div.fixed.inset-0[aria-hidden="true"]';
const OPEN_VARIANTS = "Open variants";
const LOAD = "Load";
const CLOSE = "Close";

type DrawerModeCase = (typeof DRAWER_MODES)[number];

function drawer(page: Page, label: string): Locator {
  return page.getByRole("complementary", { name: label });
}

function openButton(page: Page): Locator {
  return page.getByRole("button", { name: OPEN_VARIANTS });
}

function loadButton(page: Page): Locator {
  return page.getByRole("button", { name: LOAD });
}

function backdrop(page: Page): Locator {
  return page.locator(BACKDROP);
}

async function gotoMode(page: Page, mode: DrawerModeCase["mode"]): Promise<void> {
  await page.goto(`${BASE}/?mode=${mode}`);
}

async function openDrawer(page: Page, mode: DrawerModeCase["mode"]): Promise<void> {
  await gotoMode(page, mode);
  await expect(openButton(page)).toBeVisible();
  await openButton(page).click();
}

async function expectDrawerOpen(page: Page, label: string): Promise<void> {
  await expect(drawer(page, label)).toBeVisible();
  await expect(backdrop(page)).toBeVisible();
  await expect(openButton(page)).not.toBeVisible();
}

async function expectDrawerClosed(page: Page): Promise<void> {
  await expect(backdrop(page)).not.toBeVisible();
  await expect(openButton(page)).toBeVisible();
}

async function closeDrawerFromPanel(page: Page, label: string): Promise<void> {
  await drawer(page, label).getByRole("button", { name: CLOSE }).click();
}

test.describe("SidebarDrawer - mobile viewport: open/close affordance", () => {
  test.use({ viewport: MOBILE });

  for (const { mode, drawerLabel } of DRAWER_MODES) {
    test(`${mode}: Open button is visible and slides the drawer into view`, async ({ page }) => {
      await openDrawer(page, mode);
      await expectDrawerOpen(page, drawerLabel);
    });

    test(`${mode}: Close button inside the drawer returns to the closed state`, async ({ page }) => {
      await openDrawer(page, mode);
      await closeDrawerFromPanel(page, drawerLabel);
      await expectDrawerClosed(page);
    });

    test(`${mode}: backdrop click returns to the closed state`, async ({ page }) => {
      await openDrawer(page, mode);
      await backdrop(page).click();
      await expectDrawerClosed(page);
    });

    test(`${mode}: Close button inside the drawer is keyboard-focusable`, async ({ page }) => {
      await openDrawer(page, mode);
      const closeBtn = drawer(page, drawerLabel).getByRole("button", { name: CLOSE });
      await expect(closeBtn).toBeVisible();
      await closeBtn.focus();
      const focused = await closeBtn.evaluate((el) => el === document.activeElement);
      expect(focused).toBe(true);
    });

    test(`${mode}: visible header controls remain clickable while the drawer is open`, async ({ page }) => {
      await openDrawer(page, mode);
      await expectDrawerOpen(page, drawerLabel);
      const loadBtn = loadButton(page);
      await expect(loadBtn).toBeVisible();
      await loadBtn.click();
      await closeDrawerFromPanel(page, drawerLabel);
      await expectDrawerClosed(page);
    });
  }

  test("backdrop is absent when the drawer is closed", async ({ page }) => {
    await gotoMode(page, "catalog");
    await expect(backdrop(page)).not.toBeVisible();
  });

  test("backdrop is visible while the drawer is open and absent after close", async ({ page }) => {
    await openDrawer(page, "canvas");
    await expect(backdrop(page)).toBeVisible();
    await closeDrawerFromPanel(page, "Variant selector");
    await expect(backdrop(page)).not.toBeVisible();
  });

  test("app-template mode has no Open button and no sidebar drawer at mobile", async ({ page }) => {
    await page.goto(`${BASE}/?mode=app-template`);
    await expect(openButton(page)).not.toBeVisible();
    await expect(drawer(page, "Variant selector")).not.toBeVisible();
    await expect(drawer(page, "Catalog options")).not.toBeVisible();
  });
});

test.describe("SidebarDrawer - desktop viewport: always-visible sidebar", () => {
  for (const { mode, drawerLabel } of DRAWER_MODES) {
    test(`${mode}: sidebar is visible without any interaction on desktop`, async ({ page }) => {
      await gotoMode(page, mode);
      await expect(drawer(page, drawerLabel)).toBeVisible();
    });

    test(`${mode}: Open button is absent on desktop (md:hidden)`, async ({ page }) => {
      await gotoMode(page, mode);
      await expect(openButton(page)).not.toBeVisible();
    });
  }

  test("app-template mode has no sidebar aside on desktop", async ({ page }) => {
    await page.goto(`${BASE}/?mode=app-template`);
    await expect(drawer(page, "Variant selector")).not.toBeVisible();
    await expect(drawer(page, "Catalog options")).not.toBeVisible();
  });
});

test.describe("CatalogDrawer - content is accessible within the catalog sidebar", () => {
  test("catalog sidebar contains the Section list", async ({ page }) => {
    await gotoMode(page, "catalog");
    const sectionList = drawer(page, "Catalog options").getByRole("list", { name: "Section list" });
    await expect(sectionList).toBeVisible();
    const count = await sectionList.getByRole("listitem").count();
    expect(count).toBeGreaterThan(0);
  });

  test("every section in the list exposes compact, regular, spacious density buttons", async ({ page }) => {
    await gotoMode(page, "catalog");
    const firstItem = page
      .getByRole("complementary", { name: "Catalog options" })
      .getByRole("list", { name: "Section list" })
      .getByRole("listitem")
      .first();
    await expect(firstItem.getByRole("button", { name: "compact" })).toBeVisible();
    await expect(firstItem.getByRole("button", { name: "regular" })).toBeVisible();
    await expect(firstItem.getByRole("button", { name: "spacious" })).toBeVisible();
  });

  test("Reset button is present and uses the action-button typography scale (text-xs font-semibold)", async ({ page }) => {
    await gotoMode(page, "catalog");
    const resetBtn = page
      .getByRole("complementary", { name: "Catalog options" })
      .getByRole("button", { name: "Reset" });
    await expect(resetBtn).toBeVisible();
    const classList = await resetBtn.evaluate((el) => Array.from(el.classList));
    expect(classList).toContain("text-xs");
    expect(classList).toContain("font-semibold");
    expect(classList).not.toContain("text-[10px]");
  });

  test("catalog sidebar is absent when in canvas mode", async ({ page }) => {
    await gotoMode(page, "canvas");
    await expect(
      page.getByRole("complementary", { name: "Catalog options" })
    ).not.toBeVisible();
  });

  test("canvas sidebar is absent when in catalog mode", async ({ page }) => {
    await gotoMode(page, "catalog");
    await expect(
      page.getByRole("complementary", { name: "Variant selector" })
    ).not.toBeVisible();
  });
});
