// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { registry } from "../src/registry";
import { shapeOf, requiredKeysOf, isPlainObject } from "./helpers";

describe("strict - deep extra-property rejection across all nested structures", () => {
  for (const [id, meta] of Object.entries(registry)) {
    const def = meta.default as Record<string, unknown>;

    describe(id, () => {
      it("rejects null for every required field", () => {
        const shape = shapeOf(meta.schema);
        const requiredKeys = requiredKeysOf(shape);
        for (const key of requiredKeys) {
          expect(
            meta.schema.safeParse({ ...def, [key]: null }).success,
            `null for required field "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects an extra property in every top-level nested object", () => {
        const objKeys = Object.keys(def).filter((k) => isPlainObject(def[k]));
        for (const key of objKeys) {
          const nested = def[key] as Record<string, unknown>;
          expect(
            meta.schema.safeParse({ ...def, [key]: { ...nested, __unexpected__: 1 } }).success,
            `extra field in nested object "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects an extra property in the first array item", () => {
        const arrKeys = Object.keys(def).filter((k) => Array.isArray(def[k]));
        for (const key of arrKeys) {
          const items = def[key] as unknown[];
          const firstObj = items.find(isPlainObject);
          if (!firstObj) continue;
          const patchedItems = items.map((item, i) =>
            i === items.indexOf(firstObj) ? { ...firstObj, __unexpected__: 1 } : item
          );
          expect(
            meta.schema.safeParse({ ...def, [key]: patchedItems }).success,
            `extra field in first "${key}" array item must fail validation`
          ).toBe(false);
        }
      });

      it("rejects an extra property in the last array item", () => {
        const arrKeys = Object.keys(def).filter((k) => Array.isArray(def[k]));
        for (const key of arrKeys) {
          const items = def[key] as unknown[];
          const lastObj = [...items].reverse().find(isPlainObject);
          if (!lastObj) continue;
          const lastIdx = items.lastIndexOf(lastObj);
          const patchedItems = items.map((item, i) =>
            i === lastIdx ? { ...(lastObj as Record<string, unknown>), __unexpected__: 1 } : item
          );
          expect(
            meta.schema.safeParse({ ...def, [key]: patchedItems }).success,
            `extra field in last "${key}" array item must fail validation`
          ).toBe(false);
        }
      });

      it("rejects an extra property injected into every array item simultaneously", () => {
        const arrKeys = Object.keys(def).filter((k) => Array.isArray(def[k]));
        for (const key of arrKeys) {
          const items = def[key] as unknown[];
          if (!items.some(isPlainObject)) continue;
          const patchedItems = items.map((item) =>
            isPlainObject(item) ? { ...(item as Record<string, unknown>), __unexpected__: 1 } : item
          );
          expect(
            meta.schema.safeParse({ ...def, [key]: patchedItems }).success,
            `extra field in every "${key}" array item must fail validation`
          ).toBe(false);
        }
      });
    });
  }
});
