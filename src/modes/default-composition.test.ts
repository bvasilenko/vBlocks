// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { defaultCatalogComposition } from "./default-composition";
import { registry, type BlockId } from "../registry";

const ALL_BLOCK_IDS = Object.keys(registry) as BlockId[];

describe("defaultCatalogComposition - completeness", () => {
  it("contains exactly one section per registered BlockId", () => {
    const spec = defaultCatalogComposition();
    const ids = spec.sections.map((s) => s.id);
    expect(ids.sort()).toEqual([...ALL_BLOCK_IDS].sort());
  });

  it("section count equals the registry size", () => {
    const spec = defaultCatalogComposition();
    expect(spec.sections).toHaveLength(ALL_BLOCK_IDS.length);
  });

  it("every section ID exists in the registry", () => {
    const spec = defaultCatalogComposition();
    for (const section of spec.sections) {
      expect(registry[section.id as BlockId], `"${section.id}" must be in registry`).toBeDefined();
    }
  });

  it("section IDs are unique (no duplicates)", () => {
    const spec = defaultCatalogComposition();
    const ids = spec.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("defaultCatalogComposition - initial state", () => {
  it("every section is visible by default", () => {
    const spec = defaultCatalogComposition();
    expect(spec.sections.every((s) => s.visible)).toBe(true);
  });

  it("every section has density 'regular' by default", () => {
    const spec = defaultCatalogComposition();
    expect(spec.sections.every((s) => s.density === "regular")).toBe(true);
  });

  it("order values form a contiguous zero-based sequence", () => {
    const spec = defaultCatalogComposition();
    const orders = spec.sections.map((s) => s.order).sort((a, b) => a - b);
    orders.forEach((order, idx) => expect(order).toBe(idx));
  });
});

describe("defaultCatalogComposition - canonical order", () => {
  it("starts with hero sections", () => {
    const spec = defaultCatalogComposition();
    const first = spec.sections[0];
    expect(first.id.startsWith("hero/")).toBe(true);
  });

  it("ends with testimonial sections", () => {
    const spec = defaultCatalogComposition();
    const last = spec.sections[spec.sections.length - 1];
    expect(last.id.startsWith("testimonial/")).toBe(true);
  });

  it("hero sections appear before cta sections by order", () => {
    const spec = defaultCatalogComposition();
    const heroOrders = spec.sections.filter((s) => s.id.startsWith("hero/")).map((s) => s.order);
    const ctaOrders = spec.sections.filter((s) => s.id.startsWith("cta/")).map((s) => s.order);
    expect(Math.max(...heroOrders)).toBeLessThan(Math.min(...ctaOrders));
  });
});

describe("defaultCatalogComposition - stability", () => {
  it("two calls return structurally equal but distinct objects", () => {
    const a = defaultCatalogComposition();
    const b = defaultCatalogComposition();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  it("mutating the returned spec does not affect subsequent calls", () => {
    const a = defaultCatalogComposition();
    a.sections[0].visible = false;
    const b = defaultCatalogComposition();
    expect(b.sections[0].visible).toBe(true);
  });
});
