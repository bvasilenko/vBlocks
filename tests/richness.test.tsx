// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { registry } from "../src/registry";
import { DensitySchema, TonePillSchema, ToneSchema } from "../src/shared/schemas";
import { densityPy, DENSITY_PY } from "../src/theme";
import { shapeOf } from "./helpers";

// Every richness-flow content field that vBlocks 0.4.0 propagates from
// vUi 0.4.0 + vDsl 0.3.0 + vTheme 0.3.0. Each section schema gets a
// per-field check so the upstream contract is enforced at the registry
// level, not block-by-block.
const RICHNESS_FIELDS = ["kicker", "eyebrow", "tonePills", "density"] as const;

describe("richness — vBlocks 0.4.0 upstream-flow contract", () => {
  describe("density — content schema field + theme helper", () => {
    it("DensitySchema enumerates compact/normal/spacious only", () => {
      expect(DensitySchema.options).toEqual(["compact", "normal", "spacious"]);
    });

    it("densityPy(undefined) falls back to the proposal-rich py-24 default", () => {
      expect(densityPy(undefined)).toBe(24);
    });

    it("densityPy('compact') maps to py-12 (legacy 0.3.x rhythm)", () => {
      expect(densityPy("compact")).toBe(12);
    });

    it("densityPy('normal') maps to py-24 (proposal default)", () => {
      expect(densityPy("normal")).toBe(24);
    });

    it("densityPy('spacious') maps to py-32 (hero-grade rhythm)", () => {
      expect(densityPy("spacious")).toBe(32);
    });

    it("DENSITY_PY values are the three vDsl py-prop literals (12, 24, 32)", () => {
      expect(Object.values(DENSITY_PY).sort()).toEqual([12, 24, 32]);
    });
  });

  describe("tone palette — five semantic tones bound to vTheme 0.3.0 roles", () => {
    it("ToneSchema enumerates ok/warn/bad/info/meta only", () => {
      expect(ToneSchema.options).toEqual(["ok", "warn", "bad", "info", "meta"]);
    });

    it("TonePillSchema accepts label + optional tone", () => {
      expect(TonePillSchema.safeParse({ label: "Typed", tone: "info" }).success).toBe(true);
      expect(TonePillSchema.safeParse({ label: "Neutral" }).success).toBe(true);
    });

    it("TonePillSchema rejects an unknown tone", () => {
      expect(TonePillSchema.safeParse({ label: "x", tone: "fancy" }).success).toBe(false);
    });

    it("TonePillSchema rejects extra fields (strict shape)", () => {
      expect(TonePillSchema.safeParse({ label: "x", weight: 1 }).success).toBe(false);
    });
  });

  describe("per-block schema fields — eyebrow, kicker, density, tonePills", () => {
    for (const [id, meta] of Object.entries(registry)) {
      describe(id, () => {
        const shape = shapeOf(meta.schema);
        for (const field of RICHNESS_FIELDS) {
          it(`accepts a value for optional field "${field}"`, () => {
            if (!(field in shape)) return;
            const enrich =
              field === "tonePills"
                ? { tonePills: [{ label: "Demo", tone: "info" as const }] }
                : field === "density"
                  ? { density: "spacious" as const }
                  : { [field]: "DEMO" };
            const enriched = { ...(meta.default as object), ...enrich };
            expect(meta.schema.safeParse(enriched).success).toBe(true);
          });
        }

        it("rejects an invalid tone value in tonePills (if field exists)", () => {
          if (!("tonePills" in shape)) return;
          const enriched = { ...(meta.default as object), tonePills: [{ label: "x", tone: "fancy" }] };
          expect(meta.schema.safeParse(enriched).success).toBe(false);
        });

        it("rejects an invalid density value (if field exists)", () => {
          if (!("density" in shape)) return;
          const enriched = { ...(meta.default as object), density: "tight" };
          expect(meta.schema.safeParse(enriched).success).toBe(false);
        });
      });
    }
  });

  describe("per-block render — richness-flow fields render without throwing", () => {
    for (const [id, meta] of Object.entries(registry)) {
      describe(id, () => {
        const shape = shapeOf(meta.schema);
        const richContent: Record<string, unknown> = { ...(meta.default as object) };
        if ("kicker" in shape) richContent.kicker = "Demo kicker";
        if ("eyebrow" in shape) richContent.eyebrow = "Demo eyebrow";
        if ("density" in shape) richContent.density = "spacious";
        if ("tonePills" in shape) {
          richContent.tonePills = [
            { label: "Ok", tone: "ok" },
            { label: "Warn", tone: "warn" },
            { label: "Bad", tone: "bad" },
            { label: "Info", tone: "info" },
            { label: "Meta", tone: "meta" },
            { label: "Neutral" },
          ];
        }

        it("renders with every richness field populated", () => {
          expect(() =>
            render(createElement(meta.component, { content: richContent }))
          ).not.toThrow();
        });

        it("emits kicker text into the DOM when kicker is set", () => {
          if (!("kicker" in shape)) return;
          const { container } = render(
            createElement(meta.component, { content: richContent })
          );
          expect(container.textContent).toContain("Demo kicker");
        });

        it("emits eyebrow text into the DOM when eyebrow is set", () => {
          if (!("eyebrow" in shape)) return;
          const { container } = render(
            createElement(meta.component, { content: richContent })
          );
          expect(container.textContent).toContain("Demo eyebrow");
        });

        it("emits a Pill element per tonePills entry when tonePills is set", () => {
          if (!("tonePills" in shape)) return;
          const { container } = render(
            createElement(meta.component, { content: richContent })
          );
          const pills = container.querySelectorAll('[data-semantic-kind="engagement-tag"]');
          expect(pills.length).toBeGreaterThanOrEqual(6);
        });

        it("emits a Kicker semantic-kind attribute when kicker is set", () => {
          if (!("kicker" in shape)) return;
          const { container } = render(
            createElement(meta.component, { content: richContent })
          );
          const kickers = container.querySelectorAll('[data-semantic-kind="kicker"]');
          expect(kickers.length).toBeGreaterThanOrEqual(1);
        });

        it("emits an Eyebrow semantic-kind attribute when eyebrow is set", () => {
          if (!("eyebrow" in shape)) return;
          const { container } = render(
            createElement(meta.component, { content: richContent })
          );
          const eyebrows = container.querySelectorAll('[data-semantic-kind="eyebrow"]');
          expect(eyebrows.length).toBeGreaterThanOrEqual(1);
        });
      });
    }
  });
});
