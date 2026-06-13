// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, beforeEach } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import { loadFixture, type FixtureSlug } from "@booga/vfixtures";
import { compositionToHash, compositionFromHash } from "@booga/vbrand/composition";
import { canvasMode } from "@booga/vblocks/modes";
import { App } from "../src/App";

type AppSurface = "catalog" | "canvas" | "app-template";

type SurfaceExpectation = {
  mode: AppSurface;
  url: string;
  presentRole: "navigation" | "complementary" | "button";
  presentName: string;
  absent: Array<{ role: "navigation" | "complementary" | "button"; name: string }>;
};

const SURFACE_EXPECTATIONS: SurfaceExpectation[] = [
  {
    mode: "catalog",
    url: "/?mode=catalog",
    presentRole: "navigation",
    presentName: "Block navigation",
    absent: [
      { role: "complementary", name: "Variant selector" },
      { role: "button", name: "landing" },
    ],
  },
  {
    mode: "canvas",
    url: "/?mode=canvas",
    presentRole: "complementary",
    presentName: "Variant selector",
    absent: [
      { role: "navigation", name: "Block navigation" },
      { role: "complementary", name: "Catalog options" },
    ],
  },
  {
    mode: "app-template",
    url: "/?mode=app-template",
    presentRole: "button",
    presentName: "landing",
    absent: [
      { role: "navigation", name: "Block navigation" },
      { role: "complementary", name: "Variant selector" },
      { role: "complementary", name: "Catalog options" },
    ],
  },
];

function renderAt(url: string): ReturnType<typeof render> {
  window.history.pushState({}, "", url);
  return render(<App />);
}

function pressedButtonWithText(buttons: HTMLElement[], text: string): HTMLElement | undefined {
  return buttons.find((button) => button.textContent === text);
}

function themedSurfaceForPrimaryColor(container: HTMLElement, color: string): HTMLElement | null {
  return container.querySelector(`[style*="--v-color-primary: ${color}"]`);
}

function fixtureBrandUrl(slug: FixtureSlug): string {
  return `fixture:${slug}`;
}

beforeEach(() => {
  window.history.pushState({}, "", "/");
  window.location.hash = "";
});

describe("App - URL-selected surface integration", () => {
  it("defaults to the catalog surface when no mode source is present", () => {
    const { getByRole, queryByRole } = render(<App />);
    expect(getByRole("navigation", { name: "Block navigation" })).toBeTruthy();
    expect(queryByRole("complementary", { name: "Variant selector" })).toBeNull();
  });

  for (const { mode, url, presentRole, presentName, absent } of SURFACE_EXPECTATIONS) {
    it(`${mode} URL mounts only the ${mode} primary surface`, () => {
      const { getByRole, queryByRole } = renderAt(url);
      expect(getByRole(presentRole, { name: presentName })).toBeTruthy();
      for (const absentElement of absent) {
        expect(queryByRole(absentElement.role, { name: absentElement.name })).toBeNull();
      }
    });
  }
});

describe("App - URL source precedence integration", () => {
  it("uses search mode over a conflicting hash and pathname when mounting App", () => {
    const { getByRole, queryByRole } = renderAt("/app-template?mode=canvas#mode=catalog");
    expect(getByRole("complementary", { name: "Variant selector" })).toBeTruthy();
    expect(queryByRole("navigation", { name: "Block navigation" })).toBeNull();
    expect(queryByRole("button", { name: "landing" })).toBeNull();
  });

  it("falls through to hash mode when search mode is not known", () => {
    const { getByRole, queryByRole } = renderAt("/app-template?mode=unknown#mode=canvas");
    expect(getByRole("complementary", { name: "Variant selector" })).toBeTruthy();
    expect(queryByRole("button", { name: "landing" })).toBeNull();
  });
});

describe("App - browser history integration", () => {
  it("popstate remounts the surface selected by the current URL", () => {
    const { getByRole, queryByRole } = renderAt("/canvas");
    expect(getByRole("complementary", { name: "Variant selector" })).toBeTruthy();

    act(() => {
      window.history.pushState({}, "", "/app-template");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(getByRole("button", { name: "landing", pressed: true })).toBeTruthy();
    expect(queryByRole("complementary", { name: "Variant selector" })).toBeNull();
    expect(queryByRole("navigation", { name: "Block navigation" })).toBeNull();
  });
});

describe("App - independent URL concerns coexist", () => {
  it.each(["vercel", "linear"] as FixtureSlug[])(
    "mode, brand %s, and composition hash coexist without corrupting each other",
    async (slug) => {
      const spec = canvasMode.defaultComposition();
      const brand = loadFixture(slug);
      const brandUrl = fixtureBrandUrl(slug);
      const compositionHash = compositionToHash(spec);
      const view = renderAt(`/?mode=canvas&brand=${brandUrl}${compositionHash}`);

      expect(view.getByRole("complementary", { name: "Variant selector" })).toBeTruthy();
      await waitFor(() => {
        expect(themedSurfaceForPrimaryColor(view.container, brand.tokens.color.primary)).toBeTruthy();
      });
      expect(new URLSearchParams(window.location.search).get("mode")).toBe("canvas");
      expect(new URLSearchParams(window.location.search).get("brand")).toBe(brandUrl);
      expect(compositionFromHash(window.location.hash)).toEqual(spec);
    }
  );

  it("app-template mode selects a known app param and falls back for an unknown app param", () => {
    const dashboard = renderAt("/?mode=app-template&app=dashboard");
    expect(pressedButtonWithText(dashboard.getAllByRole("button", { pressed: true }), "dashboard")).toBeTruthy();
    dashboard.unmount();

    const fallback = renderAt("/?mode=app-template&app=unknown-template");
    expect(pressedButtonWithText(fallback.getAllByRole("button", { pressed: true }), "landing")).toBeTruthy();
  });
});
