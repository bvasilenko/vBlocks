// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, beforeEach } from "vitest";
import { registry } from "../src/registry";
import {
  resolveModeFromPathname,
  buildModePathname,
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
const ALL_BASES = ["/", "/vBlocks/", "/any/deep/path/"];

describe("resolveModeFromPathname - segment extraction at any deploy base", () => {
  const CASES: Array<{ pathname: string; base: string; expected: RouteMode }> = [
    { pathname: "/",                           base: "/",               expected: "catalog" },
    { pathname: "/canvas",                     base: "/",               expected: "canvas" },
    { pathname: "/app-template",               base: "/",               expected: "app-template" },
    { pathname: "/canvas/deep",                base: "/",               expected: "canvas" },
    { pathname: "/app-template/landing",       base: "/",               expected: "app-template" },
    { pathname: "/catalog",                    base: "/",               expected: "catalog" },
    { pathname: "/unknown",                    base: "/",               expected: "catalog" },
    { pathname: "/unknown/deep",               base: "/",               expected: "catalog" },
    { pathname: "/vBlocks/",                   base: "/vBlocks/",       expected: "catalog" },
    { pathname: "/vBlocks/canvas",             base: "/vBlocks/",       expected: "canvas" },
    { pathname: "/vBlocks/app-template",       base: "/vBlocks/",       expected: "app-template" },
    { pathname: "/vBlocks/canvas/deep",        base: "/vBlocks/",       expected: "canvas" },
    { pathname: "/vBlocks/unknown",            base: "/vBlocks/",       expected: "catalog" },
    { pathname: "/any/deep/path/",             base: "/any/deep/path/", expected: "catalog" },
    { pathname: "/any/deep/path/canvas",       base: "/any/deep/path/", expected: "canvas" },
    { pathname: "/any/deep/path/app-template", base: "/any/deep/path/", expected: "app-template" },
  ];

  for (const { pathname, base, expected } of CASES) {
    it(`"${pathname}" with base "${base}" -> "${expected}"`, () => {
      expect(resolveModeFromPathname(pathname, base)).toBe(expected);
    });
  }
});

describe("resolveModeFromPathname - fallback when pathname does not start with base", () => {
  const CASES: Array<{ pathname: string; base: string; expected: RouteMode }> = [
    { pathname: "/canvas",       base: "/vBlocks/",       expected: "canvas" },
    { pathname: "/app-template", base: "/vBlocks/",       expected: "app-template" },
    { pathname: "/",             base: "/vBlocks/",       expected: "catalog" },
    { pathname: "/unknown",      base: "/vBlocks/",       expected: "catalog" },
    { pathname: "/canvas",       base: "/any/deep/path/", expected: "canvas" },
  ];

  for (const { pathname, base, expected } of CASES) {
    it(`"${pathname}" with mismatched base "${base}" falls back to "${expected}"`, () => {
      expect(resolveModeFromPathname(pathname, base)).toBe(expected);
    });
  }
});

describe("buildModePathname - mode produces base-prefixed pathname", () => {
  const CASES: Array<{ mode: RouteMode; base: string; expected: string }> = [
    { mode: "catalog",      base: "/",               expected: "/" },
    { mode: "canvas",       base: "/",               expected: "/canvas" },
    { mode: "app-template", base: "/",               expected: "/app-template" },
    { mode: "catalog",      base: "/vBlocks/",       expected: "/vBlocks/" },
    { mode: "canvas",       base: "/vBlocks/",       expected: "/vBlocks/canvas" },
    { mode: "app-template", base: "/vBlocks/",       expected: "/vBlocks/app-template" },
    { mode: "catalog",      base: "/any/deep/path/", expected: "/any/deep/path/" },
    { mode: "canvas",       base: "/any/deep/path/", expected: "/any/deep/path/canvas" },
    { mode: "app-template", base: "/any/deep/path/", expected: "/any/deep/path/app-template" },
  ];

  for (const { mode, base, expected } of CASES) {
    it(`"${mode}" at base "${base}" -> "${expected}"`, () => {
      expect(buildModePathname(mode, base)).toBe(expected);
    });
  }
});

describe("resolveModeFromPathname / buildModePathname - roundtrip invertibility", () => {
  for (const base of ALL_BASES) {
    for (const mode of ALL_ROUTE_MODES) {
      it(`"${mode}" at base "${base}" survives build -> resolve roundtrip`, () => {
        expect(resolveModeFromPathname(buildModePathname(mode, base), base)).toBe(mode);
      });
    }
  }
});

describe("readRouteMode - reads window.location.pathname via base resolution", () => {
  it("returns catalog for the initial root URL", () => {
    expect(readRouteMode()).toBe("catalog");
  });

  for (const mode of ALL_ROUTE_MODES) {
    it(`returns "${mode}" after pushState to its canonical pathname`, () => {
      window.history.pushState({}, "", buildModePathname(mode, "/"));
      expect(readRouteMode()).toBe(mode);
    });
  }
});

describe("navigateToMode - pushState and param side-effects", () => {
  for (const mode of ALL_ROUTE_MODES) {
    it(`sets pathname to "${buildModePathname(mode, "/")}" for "${mode}" mode`, () => {
      navigateToMode(mode);
      expect(window.location.pathname).toBe(buildModePathname(mode, "/"));
    });
  }

  for (const mode of ALL_ROUTE_MODES) {
    it(`readRouteMode immediately reflects "${mode}" after navigateToMode`, () => {
      navigateToMode(mode);
      expect(readRouteMode()).toBe(mode);
    });
  }

  for (const mode of ALL_ROUTE_MODES) {
    it(`clears the inspect param when navigating to "${mode}"`, () => {
      window.history.pushState({}, "", "/?inspect=hero-split");
      navigateToMode(mode);
      expect(readInspectParam()).toBeNull();
    });
  }

  it("preserves the brand param across all mode switches", () => {
    window.history.pushState({}, "", "/?brand=fixture:stripe");
    for (const mode of ALL_ROUTE_MODES) {
      navigateToMode(mode);
      expect(readBrandParam()).toBe("fixture:stripe");
    }
  });

  it("preserves the template param across all mode switches", () => {
    window.history.pushState({}, "", "/?app=dashboard");
    for (const mode of ALL_ROUTE_MODES) {
      navigateToMode(mode);
      expect(readTemplateParam()).toBe("dashboard");
    }
  });
});

describe("readBrandParam / updateBrandParam - brand source persistence", () => {
  it("returns null when the brand param is absent", () => {
    expect(readBrandParam()).toBeNull();
  });

  it("returns the exact brand param value", () => {
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

  it("updateBrandParam does not disturb other params", () => {
    window.history.pushState({}, "", "/?app=landing&inspect=hero-split");
    updateBrandParam("npm:my-brand");
    expect(readTemplateParam()).toBe("landing");
    expect(readInspectParam()).toBe("hero-split");
  });
});

describe("readTemplateParam / updateTemplateParam - app type persistence", () => {
  it("returns null when the app param is absent", () => {
    expect(readTemplateParam()).toBeNull();
  });

  it("returns the exact app param value", () => {
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

  it("updateTemplateParam does not disturb other params", () => {
    window.history.pushState({}, "", "/?brand=stripe&inspect=hero-split");
    updateTemplateParam("docs");
    expect(readBrandParam()).toBe("stripe");
    expect(readInspectParam()).toBe("hero-split");
  });
});

describe("readInspectParam / setInspectParam - variant inspector state", () => {
  it("returns null when the inspect param is absent", () => {
    expect(readInspectParam()).toBeNull();
  });

  it("returns the exact inspect param value", () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    expect(readInspectParam()).toBe("hero-split");
  });

  it("setInspectParam(slug) makes readInspectParam return that slug", () => {
    setInspectParam("cta-centered");
    expect(readInspectParam()).toBe("cta-centered");
  });

  it("setInspectParam(null) removes the inspect param", () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    setInspectParam(null);
    expect(readInspectParam()).toBeNull();
  });

  it("setInspectParam overwrites a previously set inspect value", () => {
    setInspectParam("hero-split");
    setInspectParam("cta-grid");
    expect(readInspectParam()).toBe("cta-grid");
  });

  it("setInspectParam does not disturb other params", () => {
    window.history.pushState({}, "", "/?brand=stripe&app=landing");
    setInspectParam("hero-split");
    expect(readBrandParam()).toBe("stripe");
    expect(readTemplateParam()).toBe("landing");
  });

  it("setInspectParam(null) does not disturb other params when removing inspect", () => {
    window.history.pushState({}, "", "/?inspect=hero-split&brand=stripe&app=landing");
    setInspectParam(null);
    expect(readBrandParam()).toBe("stripe");
    expect(readTemplateParam()).toBe("landing");
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
