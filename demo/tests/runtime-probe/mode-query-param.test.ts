// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { test, expect } from "@playwright/test";

const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173").replace(/\/$/, "");

type Surface = {
  mode: string;
  urlSource: string;
  urlMustContain?: string;
  present: { role: "button" | "complementary" | "navigation"; name: string };
  absent: Array<{ role: "button" | "complementary" | "navigation"; name: string }>;
};

type EditableSurface = {
  mode: "canvas" | "catalog";
  drawerName: string;
  absentAfterEdit: Surface["absent"];
};

const SURFACES: Surface[] = [
  {
    mode: "catalog",
    urlSource: "?mode=catalog",
    urlMustContain: "mode=catalog",
    present: { role: "navigation", name: "Block navigation" },
    absent: [
      { role: "complementary", name: "Variant selector" },
      { role: "button", name: "landing" },
    ],
  },
  {
    mode: "canvas",
    urlSource: "?mode=canvas",
    urlMustContain: "mode=canvas",
    present: { role: "complementary", name: "Variant selector" },
    absent: [
      { role: "navigation", name: "Block navigation" },
      { role: "button", name: "landing" },
    ],
  },
  {
    mode: "app-template",
    urlSource: "?mode=app-template",
    urlMustContain: "mode=app-template",
    present: { role: "button", name: "landing" },
    absent: [
      { role: "navigation", name: "Block navigation" },
      { role: "complementary", name: "Variant selector" },
    ],
  },
  {
    mode: "canvas",
    urlSource: "#mode=canvas",
    present: { role: "complementary", name: "Variant selector" },
    absent: [
      { role: "navigation", name: "Block navigation" },
      { role: "button", name: "landing" },
    ],
  },
  {
    mode: "app-template",
    urlSource: "#mode=app-template",
    present: { role: "button", name: "landing" },
    absent: [
      { role: "navigation", name: "Block navigation" },
      { role: "complementary", name: "Variant selector" },
    ],
  },
];

const EDITABLE_HASH_SURFACES: EditableSurface[] = [
  {
    mode: "canvas",
    drawerName: "Variant selector",
    absentAfterEdit: [
      { role: "navigation", name: "Block navigation" },
      { role: "button", name: "landing" },
    ],
  },
  {
    mode: "catalog",
    drawerName: "Catalog options",
    absentAfterEdit: [
      { role: "complementary", name: "Variant selector" },
      { role: "button", name: "landing" },
    ],
  },
];

for (const { mode, urlSource, urlMustContain, present, absent } of SURFACES) {
  test(`${urlSource} fresh navigation renders only the ${mode} surface`, async ({ page }) => {
    await page.goto(`${BASE}/${urlSource}`);
    await expect(page.getByRole(present.role, { name: present.name })).toBeVisible();
    for (const hidden of absent) {
      await expect(page.getByRole(hidden.role, { name: hidden.name })).not.toBeVisible();
    }
    if (urlMustContain) expect(page.url()).toContain(urlMustContain);
  });
}

test("search mode has precedence over conflicting hash mode on fresh navigation", async ({ page }) => {
  await page.goto(`${BASE}/?mode=canvas#mode=app-template`);
  await expect(page.getByRole("complementary", { name: "Variant selector" })).toBeAttached();
  await expect(page.getByRole("button", { name: "landing" })).not.toBeVisible();
});

for (const { mode, drawerName, absentAfterEdit } of EDITABLE_HASH_SURFACES) {
  test(`#mode=${mode} remains on the selected editable surface after composition changes`, async ({ page }) => {
    await page.goto(`${BASE}/#mode=${mode}`);
    const drawer = page.getByRole("complementary", { name: drawerName });
    await expect(drawer).toBeVisible();

    await drawer.getByRole("button", { name: "compact" }).first().click();

    await expect(drawer).toBeVisible();
    for (const hidden of absentAfterEdit) {
      await expect(page.getByRole(hidden.role, { name: hidden.name })).not.toBeVisible();
    }
    const params = new URLSearchParams(new URL(page.url()).hash.slice(1));
    expect(params.get("mode")).toBe(mode);
    expect(params.get("composition")).toBeTruthy();
  });
}
