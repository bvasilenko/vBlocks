// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { registry } from "../src/registry";

function shapeOf(schema: z.ZodTypeAny): Record<string, z.ZodTypeAny> {
  return (schema as z.AnyZodObject).shape as Record<string, z.ZodTypeAny>;
}

function requiredKeysOf(shape: Record<string, z.ZodTypeAny>): string[] {
  return Object.keys(shape).filter((k) => !shape[k].safeParse(undefined).success);
}

function firstKeyWhere(
  obj: Record<string, unknown>,
  predicate: (v: unknown) => boolean
): string | undefined {
  return Object.keys(obj).find((k) => predicate(obj[k]));
}

function withoutKey(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}

describe("schema — validation contract per block", () => {
  for (const [id, meta] of Object.entries(registry)) {
    const shape = shapeOf(meta.schema);
    const def = meta.default as Record<string, unknown>;
    const requiredKeys = requiredKeysOf(shape);

    describe(id, () => {
      it("round-trip: parse(default) returns structurally equal value", () => {
        expect(meta.schema.parse(meta.default)).toEqual(meta.default);
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

      const strKey = firstKeyWhere(def, (v) => typeof v === "string");
      if (strKey !== undefined) {
        it(`rejects wrong type for string field "${strKey}"`, () => {
          expect(meta.schema.safeParse({ ...def, [strKey]: 42 }).success).toBe(false);
        });
      }

      const arrKey = firstKeyWhere(def, (v) => Array.isArray(v));
      if (arrKey !== undefined) {
        it(`rejects empty array for min-1 field "${arrKey}"`, () => {
          expect(meta.schema.safeParse({ ...def, [arrKey]: [] }).success).toBe(false);
        });
      }

      const objKey = firstKeyWhere(
        def,
        (v) => v !== null && typeof v === "object" && !Array.isArray(v)
      );
      if (objKey !== undefined) {
        it(`rejects extra field inside nested object "${objKey}"`, () => {
          const nested = def[objKey] as Record<string, unknown>;
          expect(
            meta.schema.safeParse({ ...def, [objKey]: { ...nested, __unexpected__: 1 } }).success
          ).toBe(false);
        });
      }
    });
  }
});
