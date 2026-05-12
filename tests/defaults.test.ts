// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { registry } from "../src/registry";
import { shapeOf, requiredKeysOf, optionalKeysOf, isPlainObject, hasStringProps } from "./helpers";

describe("defaults — authored default content meets quality invariants", () => {
  for (const [id, meta] of Object.entries(registry)) {
    const shape = shapeOf(meta.schema);
    const def = meta.default as Record<string, unknown>;
    const requiredKeys = requiredKeysOf(shape);
    const optionalKeys = optionalKeysOf(shape);

    describe(id, () => {
      it("every required string field is non-empty", () => {
        const strKeys = requiredKeys.filter((k) => typeof def[k] === "string");
        for (const key of strKeys) {
          expect(
            (def[key] as string).length,
            `"${key}" must be a non-empty string in default content`
          ).toBeGreaterThan(0);
        }
      });

      it("every required array field has at least one element", () => {
        const arrKeys = requiredKeys.filter((k) => Array.isArray(def[k]));
        for (const key of arrKeys) {
          expect(
            (def[key] as unknown[]).length,
            `"${key}" must have at least one element in default content`
          ).toBeGreaterThan(0);
        }
      });

      it("every optional string field present in default content is non-empty", () => {
        const presentOptStrKeys = optionalKeys.filter(
          (k) => k in def && typeof def[k] === "string"
        );
        for (const key of presentOptStrKeys) {
          expect(
            (def[key] as string).length,
            `optional field "${key}" is present in defaults but is an empty string`
          ).toBeGreaterThan(0);
        }
      });

      it("every image-shaped nested object has non-empty src and alt", () => {
        const imageLike = Object.keys(def).filter(
          (k) => isPlainObject(def[k]) && hasStringProps(def[k] as Record<string, unknown>, "src", "alt")
        );
        for (const key of imageLike) {
          const img = def[key] as Record<string, string>;
          expect(img.src.length, `"${key}.src" must be non-empty`).toBeGreaterThan(0);
          expect(img.alt.length, `"${key}.alt" must be non-empty`).toBeGreaterThan(0);
        }
      });

      it("every cta-shaped nested object has non-empty label and href", () => {
        const ctaLike = Object.keys(def).filter(
          (k) =>
            isPlainObject(def[k]) &&
            hasStringProps(def[k] as Record<string, unknown>, "label", "href")
        );
        for (const key of ctaLike) {
          const cta = def[key] as Record<string, string>;
          expect(cta.label.length, `"${key}.label" must be non-empty`).toBeGreaterThan(0);
          expect(cta.href.length, `"${key}.href" must be non-empty`).toBeGreaterThan(0);
        }
      });

      it("every array item that is an object has non-empty string properties", () => {
        const arrKeys = requiredKeys.filter((k) => Array.isArray(def[k]));
        for (const key of arrKeys) {
          const items = def[key] as unknown[];
          items.forEach((item, idx) => {
            if (!isPlainObject(item)) return;
            const strEntries = Object.entries(item).filter(([, v]) => typeof v === "string");
            for (const [prop, val] of strEntries) {
              expect(
                (val as string).length,
                `"${key}[${idx}].${prop}" must be non-empty in default content`
              ).toBeGreaterThan(0);
            }
          });
        }
      });
    });
  }
});
