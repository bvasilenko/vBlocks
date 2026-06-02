// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, beforeEach } from "vitest";
import { registry } from "../src/registry";
import {
  readRouteMode,
  navigateToMode,
  readBrandParam,
  updateBrandParam,
  readTemplateParam,
  updateTemplateParam,
  readInspectParam,
  setInspectParam,
  blockIdToSlug,
  slugToBlockId,
  type RouteMode,
} from "../demo/src/routing/route";

beforeEach(() => {
  window.history.pushState({}, "", "/");
});

const ALL_ROUTE_MODES: RouteMode[] = ["catalog", "canvas", "app-template"];

describe("readRouteMode - pathname to RouteMode mapping", () => {
  const CASES: Array<{ path: string; expected: RouteMode }> = [
    { path: "/",                      expected: "catalog" },
    { path: "/catalog",               expected: "catalog" },
    { path: "/unknown",               expected: "catalog" },
    { path: "/unknown/deep",          expected: "catalog" },
    { path: "/canvas",                expected: "canvas" },
    { path: "/canvas/something",      expected: "canvas" },
    { path: "/app-template",          expected: "app-template" },
    { path: "/app-template/landing",  expected: "app-template" },
  ];

  for (const { path, expected } of CASES) {
    it(`"${path}" resolves to "${expected}"`, () => {
      window.history.pushState({}, "", path);
      expect(readRouteMode()).toBe(expected);
    });
  }
});

describe("navigateToMode - pathname and param side-effects", () => {
  it("sets pathname to / for catalog mode", () => {
    navigateToMode("catalog");
    expect(window.location.pathname).toBe("/");
  });

  it("sets pathname to /canvas for canvas mode", () => {
    navigateToMode("canvas");
    expect(window.location.pathname).toBe("/canvas");
  });

  it("sets pathname to /app-template for app-template mode", () => {
    navigateToMode("app-template");
    expect(window.location.pathname).toBe("/app-template");
  });

  it("readRouteMode reflects the navigated mode immediately for every mode", () => {
    for (const mode of ALL_ROUTE_MODES) {
      navigateToMode(mode);
      expect(readRouteMode()).toBe(mode);
    }
  });

  it("preserves an existing brand param when switching mode", () => {
    window.history.pushState({}, "", "/?brand=stripe");
    navigateToMode("canvas");
    expect(readBrandParam()).toBe("stripe");
  });

  it("removes the inspect param when switching mode", () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    navigateToMode("canvas");
    expect(readInspectParam()).toBeNull();
  });

  it("preserves template param when switching to app-template", () => {
    window.history.pushState({}, "", "/?app=dashboard");
    navigateToMode("app-template");
    expect(readTemplateParam()).toBe("dashboard");
  });
});

describe("readBrandParam / updateBrandParam - brand source persistence", () => {
  it("returns null when no brand param is present", () => {
    expect(readBrandParam()).toBeNull();
  });

  it("returns the exact value of the brand param", () => {
    window.history.pushState({}, "", "/?brand=fixture:stripe");
    expect(readBrandParam()).toBe("fixture:stripe");
  });

  it("updateBrandParam makes readBrandParam return the new value", () => {
    updateBrandParam("github:owner/repo");
    expect(readBrandParam()).toBe("github:owner/repo");
  });

  it("updateBrandParam overwrites a previously set brand value", () => {
    updateBrandParam("first");
    updateBrandParam("second");
    expect(readBrandParam()).toBe("second");
  });

  it("updateBrandParam preserves other existing params", () => {
    window.history.pushState({}, "", "/?app=landing");
    updateBrandParam("npm:my-brand");
    expect(readTemplateParam()).toBe("landing");
  });
});

describe("readTemplateParam / updateTemplateParam - app type persistence", () => {
  it("returns null when no app param is present", () => {
    expect(readTemplateParam()).toBeNull();
  });

  it("returns the exact value of the app param", () => {
    window.history.pushState({}, "", "/?app=dashboard");
    expect(readTemplateParam()).toBe("dashboard");
  });

  it("updateTemplateParam makes readTemplateParam return the new value", () => {
    updateTemplateParam("marketing");
    expect(readTemplateParam()).toBe("marketing");
  });

  it("updateTemplateParam overwrites a previously set template value", () => {
    updateTemplateParam("docs");
    updateTemplateParam("landing");
    expect(readTemplateParam()).toBe("landing");
  });
});

describe("readInspectParam / setInspectParam - variant inspector state", () => {
  it("returns null when no inspect param is present", () => {
    expect(readInspectParam()).toBeNull();
  });

  it("returns the slug value when inspect param is set", () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    expect(readInspectParam()).toBe("hero-split");
  });

  it("setInspectParam(slug) makes readInspectParam return the slug", () => {
    setInspectParam("cta-centered");
    expect(readInspectParam()).toBe("cta-centered");
  });

  it("setInspectParam(null) removes the inspect param", () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    setInspectParam(null);
    expect(readInspectParam()).toBeNull();
  });

  it("setInspectParam(null) preserves other params when removing inspect", () => {
    window.history.pushState({}, "", "/?inspect=hero-split&brand=stripe");
    setInspectParam(null);
    expect(readBrandParam()).toBe("stripe");
  });

  it("setInspectParam overwrites a previously set inspect value", () => {
    setInspectParam("hero-split");
    setInspectParam("cta-grid");
    expect(readInspectParam()).toBe("cta-grid");
  });
});

describe("blockIdToSlug / slugToBlockId - format conversion contract", () => {
  it("blockIdToSlug converts the category/variant slash to a hyphen", () => {
    expect(blockIdToSlug("hero/split")).toBe("hero-split");
    expect(blockIdToSlug("testimonial/grid")).toBe("testimonial-grid");
    expect(blockIdToSlug("features/split")).toBe("features-split");
  });

  it("slugToBlockId converts the first hyphen back to a slash", () => {
    expect(slugToBlockId("hero-split")).toBe("hero/split");
    expect(slugToBlockId("testimonial-grid")).toBe("testimonial/grid");
    expect(slugToBlockId("features-split")).toBe("features/split");
  });

  it("blockIdToSlug output contains no forward slash", () => {
    for (const id of Object.keys(registry)) {
      expect(blockIdToSlug(id)).not.toContain("/");
    }
  });

  it("slugToBlockId output contains exactly one forward slash", () => {
    for (const id of Object.keys(registry)) {
      const slug = blockIdToSlug(id);
      const restored = slugToBlockId(slug);
      expect(restored.split("/")).toHaveLength(2);
    }
  });

  for (const id of Object.keys(registry)) {
    it(`"${id}" survives blockIdToSlug -> slugToBlockId roundtrip`, () => {
      expect(slugToBlockId(blockIdToSlug(id))).toBe(id);
    });
  }
});
