// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { registry } from "../src/registry";
import { shapeOf, requiredKeysOf, optionalKeysOf, isPlainObject, withoutKey } from "./helpers";

describe("schema — validation contract per block", () => {
  for (const [id, meta] of Object.entries(registry)) {
    const shape = shapeOf(meta.schema);
    const def = meta.default as Record<string, unknown>;
    const requiredKeys = requiredKeysOf(shape);
    const optionalKeys = optionalKeysOf(shape);

    describe(id, () => {
      it("round-trip: parse(default) returns structurally equal value", () => {
        expect(meta.schema.parse(meta.default)).toEqual(meta.default);
      });

      it("accepts parse with all optional fields absent", () => {
        if (optionalKeys.length === 0) return;
        const withoutOptionals = Object.fromEntries(
          Object.entries(def).filter(([k]) => !optionalKeys.includes(k))
        );
        expect(meta.schema.safeParse(withoutOptionals).success).toBe(true);
      });

      it("rejects any extra top-level field", () => {
        expect(meta.schema.safeParse({ ...def, __unexpected__: 1 }).success).toBe(false);
      });

      it("rejects omission of each required field individually", () => {
        for (const key of requiredKeys) {
          expect(
            meta.schema.safeParse(withoutKey(def, key)).success,
            `missing "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects a non-string value for every top-level string field", () => {
        const strKeys = Object.keys(def).filter((k) => typeof def[k] === "string");
        for (const key of strKeys) {
          expect(
            meta.schema.safeParse({ ...def, [key]: 42 }).success,
            `integer for string field "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects non-string values for string fields inside nested objects", () => {
        const objKeys = Object.keys(def).filter((k) => isPlainObject(def[k]));
        for (const objKey of objKeys) {
          const nested = def[objKey] as Record<string, unknown>;
          const nestedStrKeys = Object.keys(nested).filter((k) => typeof nested[k] === "string");
          for (const strKey of nestedStrKeys) {
            expect(
              meta.schema.safeParse({ ...def, [objKey]: { ...nested, [strKey]: 42 } }).success,
              `integer for nested string "${objKey}.${strKey}" must fail validation`
            ).toBe(false);
          }
        }
      });

      it("rejects an empty array for every required array field", () => {
        const requiredArrKeys = requiredKeys.filter((k) => Array.isArray(def[k]));
        for (const key of requiredArrKeys) {
          expect(
            meta.schema.safeParse({ ...def, [key]: [] }).success,
            `empty array for required field "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects a non-array value for every array field", () => {
        const arrKeys = Object.keys(def).filter((k) => Array.isArray(def[k]));
        for (const key of arrKeys) {
          expect(
            meta.schema.safeParse({ ...def, [key]: "not-an-array" }).success,
            `string for array field "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects null for every nested object field", () => {
        const objKeys = Object.keys(def).filter((k) => isPlainObject(def[k]));
        for (const key of objKeys) {
          expect(
            meta.schema.safeParse({ ...def, [key]: null }).success,
            `null for nested object field "${key}" must fail validation`
          ).toBe(false);
        }
      });

      it("rejects a primitive for every nested object field", () => {
        const objKeys = Object.keys(def).filter((k) => isPlainObject(def[k]));
        for (const key of objKeys) {
          expect(
            meta.schema.safeParse({ ...def, [key]: "not-an-object" }).success,
            `string for object field "${key}" must fail validation`
          ).toBe(false);
        }
      });
    });
  }
});
