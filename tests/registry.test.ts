import { describe, it, expect } from "vitest";
import { registry, type BlockId } from "../src/registry";

const EXPECTED_BLOCK_IDS: BlockId[] = [
  "hero/split", "hero/centered",
  "cta/split", "cta/centered",
  "faq/split", "faq/grid",
  "footer/split", "footer/grid",
  "gallery/split", "gallery/grid",
  "portfolio/split", "portfolio/grid",
  "post/split", "post/centered",
  "team/split", "team/grid",
  "testimonial/split", "testimonial/grid",
  "blog/split", "blog/grid",
  "business/split", "business/grid",
  "features/split", "features/grid",
];

describe("registry — shape and completeness", () => {
  it("has exactly 24 entries", () => {
    expect(Object.keys(registry)).toHaveLength(24);
  });

  it("contains all expected BlockIds", () => {
    expect(Object.keys(registry).sort()).toEqual([...EXPECTED_BLOCK_IDS].sort());
  });

  it("every BlockId matches category/variant format", () => {
    for (const id of Object.keys(registry)) {
      const parts = id.split("/");
      expect(parts, `"${id}" must be category/variant`).toHaveLength(2);
      expect(parts[0], `"${id}" category must be non-empty`).toBeTruthy();
      expect(parts[1], `"${id}" variant must be non-empty`).toBeTruthy();
    }
  });

  it("every entry has a schema, default content, and a component function", () => {
    for (const [id, meta] of Object.entries(registry)) {
      expect(typeof meta.schema.parse, `${id}: schema.parse must be a function`).toBe("function");
      expect(meta.default, `${id}: default content must be defined`).toBeDefined();
      expect(typeof meta.component, `${id}: component must be a function`).toBe("function");
    }
  });
});
