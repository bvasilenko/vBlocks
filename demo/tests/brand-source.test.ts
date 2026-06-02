// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { BrowserBrandSourceAdapter } from "@booga/vbrand/adapters/browser";
import { loadFixture, FIXTURE_SLUGS } from "@booga/vfixtures";
import { catalogMode } from "../../src/modes/catalog";
import { parseBrandParam, loadBrand } from "../../demo/src/brand-loader";

const adapter = new BrowserBrandSourceAdapter();

const SOURCE_PARAM_CASES: Array<{ param: string; type: string }> = [
  { param: "fixture:stripe",      type: "fixture"  },
  { param: "fixture:vercel",      type: "fixture"  },
  { param: "github:owner/repo",   type: "github"   },
  { param: "npm:my-brand",        type: "npm"      },
  { param: "json:{\"x\":1}",      type: "json"     },
  { param: "https://example.com", type: "url"      },
  { param: "http://example.com",  type: "url"      },
];

describe("parseBrandParam - source type dispatch", () => {
  it("null param maps to default source", () => {
    expect(parseBrandParam(null)).toEqual({ type: "default" });
  });

  for (const { param, type } of SOURCE_PARAM_CASES) {
    it(`"${param}" maps to source type "${type}"`, () => {
      const result = parseBrandParam(param);
      expect(result.type).toBe(type);
    });
  }

  it("fixture: prefix extracts the handle correctly", () => {
    const result = parseBrandParam("fixture:notion");
    expect(result).toEqual({ type: "fixture", handle: "notion" });
  });

  it("github: prefix extracts owner and repo correctly", () => {
    const result = parseBrandParam("github:acme/brand-kit");
    expect(result).toEqual({ type: "github", owner: "acme", repo: "brand-kit" });
  });

  it("npm: prefix extracts the package name correctly", () => {
    const result = parseBrandParam("npm:@scope/brand");
    expect(result).toEqual({ type: "npm", package: "@scope/brand" });
  });

  it("json: prefix with valid JSON extracts the payload", () => {
    const result = parseBrandParam('json:{"name":"test"}');
    expect(result).toEqual({ type: "json", payload: { name: "test" } });
  });

  it("json: prefix with invalid JSON falls back to default", () => {
    expect(parseBrandParam("json:{bad}")).toEqual({ type: "default" });
  });
});

describe("loadBrand - testable source types", () => {
  it("default source loads the Stripe fixture", async () => {
    const brand = await loadBrand({ type: "default" });
    expect(brand.name).toBe(loadFixture("stripe").name);
  });

  for (const slug of FIXTURE_SLUGS) {
    it(`fixture source "${slug}" resolves a valid brand`, async () => {
      const brand = await loadBrand({ type: "fixture", handle: slug });
      expect(brand.name).toBeTruthy();
      expect(typeof brand.tokens.color).toBe("object");
    });
  }

  it("json source with a valid payload resolves the brand", async () => {
    const stripe = loadFixture("stripe");
    const brand = await loadBrand({ type: "json", payload: stripe });
    expect(brand.name).toBe(stripe.name);
  });

  it("json source with an invalid payload rejects", async () => {
    await expect(loadBrand({ type: "json", payload: { invalid: true } })).rejects.toThrow();
  });
});

describe("BrowserBrandSourceAdapter - fixture loading", () => {
  for (const slug of FIXTURE_SLUGS) {
    it(`loadFromFixture("${slug}") resolves a valid VbrandType`, async () => {
      const brand = await adapter.loadFromFixture(slug);
      expect(brand.name).toBeTruthy();
      expect(typeof brand.tokens.color).toBe("object");
      expect(typeof brand.tokens.type).toBe("object");
    });
  }

  it("loadFromCustomJson accepts a valid vbrand payload", async () => {
    const stripe = loadFixture("stripe");
    const brand = await adapter.loadFromCustomJson(stripe);
    expect(brand.name).toBe(stripe.name);
  });

  it("loadFromCustomJson rejects a payload that does not conform to VbrandType", async () => {
    await expect(adapter.loadFromCustomJson({ notABrand: true })).rejects.toThrow();
  });
});

describe("brand-source - CSS variable cascade into gallery compose()", () => {
  for (const slug of FIXTURE_SLUGS) {
    it(`fixture "${slug}" produces color-primary CSS variable in composed output`, async () => {
      const brand = await adapter.loadFromFixture(slug);
      const spec = catalogMode.defaultComposition();
      const { container } = render(
        createElement(() => catalogMode.compose(brand, spec) as JSX.Element)
      );
      const style = (container.firstElementChild as HTMLElement)?.getAttribute("style") ?? "";
      expect(style).toContain("--v-color-primary");
      expect(style).toContain(brand.tokens.color.primary);
    });
  }

  it("different fixture brands produce different color-primary CSS variable values", async () => {
    const brands = await Promise.all(
      FIXTURE_SLUGS.map((s) => adapter.loadFromFixture(s))
    );
    const spec = catalogMode.defaultComposition();
    const primaryValues = brands.map((brand) => {
      const { container } = render(
        createElement(() => catalogMode.compose(brand, spec) as JSX.Element)
      );
      const style = (container.firstElementChild as HTMLElement)?.getAttribute("style") ?? "";
      const match = style.match(/--v-color-primary:\s*([^;]+)/);
      return match?.[1]?.trim() ?? "";
    });
    expect(new Set(primaryValues).size).toBeGreaterThan(1);
  });
});
