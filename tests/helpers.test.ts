// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  shapeOf,
  requiredKeysOf,
  optionalKeysOf,
  minContentOf,
  isPlainObject,
  withoutKey,
  hasStringProps,
} from "./helpers";

const schema = z.object({
  title: z.string(),
  count: z.number(),
  tag: z.string().optional(),
  note: z.string().optional(),
}).strict();

const full = { title: "Hello", count: 3, tag: "news", note: "extra" };
const minimal = { title: "Hello", count: 3 };

describe("shapeOf — every schema field is addressable by name as a typed validator", () => {
  it("returns a record keyed by field names", () => {
    const shape = shapeOf(schema);
    expect(Object.keys(shape).sort()).toEqual(["count", "note", "tag", "title"]);
  });

  it("each value is a ZodType (has a safeParse method)", () => {
    const shape = shapeOf(schema);
    for (const v of Object.values(shape)) {
      expect(typeof v.safeParse).toBe("function");
    }
  });
});

describe("requiredKeysOf — required fields are those the schema rejects when undefined", () => {
  it("identifies required fields", () => {
    expect(requiredKeysOf(shapeOf(schema)).sort()).toEqual(["count", "title"]);
  });

  it("returns empty array when all fields are optional", () => {
    const allOptional = z.object({ a: z.string().optional() });
    expect(requiredKeysOf(shapeOf(allOptional))).toEqual([]);
  });

  it("returns all keys when all fields are required", () => {
    const allRequired = z.object({ x: z.string(), y: z.number() }).strict();
    expect(requiredKeysOf(shapeOf(allRequired)).sort()).toEqual(["x", "y"]);
  });
});

describe("optionalKeysOf — optional fields are those the schema accepts when undefined", () => {
  it("identifies optional fields", () => {
    expect(optionalKeysOf(shapeOf(schema)).sort()).toEqual(["note", "tag"]);
  });

  it("returns empty array when all fields are required", () => {
    const allRequired = z.object({ x: z.string(), y: z.number() }).strict();
    expect(optionalKeysOf(shapeOf(allRequired))).toEqual([]);
  });

  it("returns all keys when all fields are optional", () => {
    const allOptional = z.object({ a: z.string().optional(), b: z.number().optional() });
    expect(optionalKeysOf(shapeOf(allOptional)).sort()).toEqual(["a", "b"]);
  });

  it("is the complement of requiredKeysOf for the same shape", () => {
    const shape = shapeOf(schema);
    const required = new Set(requiredKeysOf(shape));
    const optional = new Set(optionalKeysOf(shape));
    const all = new Set(Object.keys(shape));
    for (const k of all) {
      expect(required.has(k) !== optional.has(k)).toBe(true);
    }
  });
});

describe("minContentOf — removing optional fields produces schema-valid required-only content", () => {
  it("retains all required fields", () => {
    const result = minContentOf(full, shapeOf(schema));
    expect("title" in result).toBe(true);
    expect("count" in result).toBe(true);
  });

  it("removes all optional fields", () => {
    const result = minContentOf(full, shapeOf(schema));
    expect("tag" in result).toBe(false);
    expect("note" in result).toBe(false);
  });

  it("produces a value the schema accepts", () => {
    const result = minContentOf(full, shapeOf(schema));
    expect(schema.safeParse(result).success).toBe(true);
  });

  it("is a no-op when the input has only required fields", () => {
    const result = minContentOf(minimal, shapeOf(schema));
    expect(result).toEqual(minimal);
  });

  it("does not mutate the input object", () => {
    const input = { ...full };
    minContentOf(input, shapeOf(schema));
    expect(input).toEqual(full);
  });
});

describe("isPlainObject — plain object detection excludes null, arrays, and primitives", () => {
  it("returns true for a plain object literal", () => {
    expect(isPlainObject({ a: 1 })).toBe(true);
  });

  it("returns true for an empty object", () => {
    expect(isPlainObject({})).toBe(true);
  });

  it("returns false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("returns false for an array", () => {
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("returns false for a string", () => {
    expect(isPlainObject("text")).toBe(false);
  });

  it("returns false for a number", () => {
    expect(isPlainObject(42)).toBe(false);
  });

  it("returns false for a boolean", () => {
    expect(isPlainObject(true)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPlainObject(undefined)).toBe(false);
  });
});

describe("withoutKey — key omission produces an immutable shallow copy without the excluded entry", () => {
  it("excludes the specified key", () => {
    const result = withoutKey({ a: 1, b: 2, c: 3 }, "b");
    expect("b" in result).toBe(false);
  });

  it("retains all other keys", () => {
    const result = withoutKey({ a: 1, b: 2, c: 3 }, "b");
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("is a no-op when the key does not exist", () => {
    const obj = { a: 1, b: 2 };
    expect(withoutKey(obj, "z")).toEqual({ a: 1, b: 2 });
  });

  it("does not mutate the input object", () => {
    const obj = { a: 1, b: 2 };
    withoutKey(obj, "a");
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it("returns an empty object when the only key is removed", () => {
    expect(withoutKey({ x: 1 }, "x")).toEqual({});
  });
});

describe("hasStringProps — all named keys must be present and hold string values", () => {
  it("returns true when all specified keys hold strings", () => {
    expect(hasStringProps({ src: "/img.jpg", alt: "desc" }, "src", "alt")).toBe(true);
  });

  it("returns true when called with no keys (vacuously)", () => {
    expect(hasStringProps({ a: 1 })).toBe(true);
  });

  it("returns false when a specified key is absent", () => {
    expect(hasStringProps({ src: "/img.jpg" }, "src", "alt")).toBe(false);
  });

  it("returns false when a specified key holds a non-string value", () => {
    expect(hasStringProps({ src: "/img.jpg", alt: 42 }, "src", "alt")).toBe(false);
  });

  it("returns false when a specified key holds null", () => {
    expect(hasStringProps({ label: null }, "label")).toBe(false);
  });

  it("returns false when a specified key holds undefined", () => {
    expect(hasStringProps({ label: undefined }, "label")).toBe(false);
  });

  it("returns true for an empty string value (string type is what matters)", () => {
    expect(hasStringProps({ label: "" }, "label")).toBe(true);
  });
});
