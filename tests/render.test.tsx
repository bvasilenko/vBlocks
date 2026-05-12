// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { z } from "zod";
import { render } from "@testing-library/react";
import { registry } from "../src/registry";

function shapeOf(schema: z.ZodTypeAny): Record<string, z.ZodTypeAny> {
  return (schema as z.AnyZodObject).shape as Record<string, z.ZodTypeAny>;
}

function optionalKeysOf(shape: Record<string, z.ZodTypeAny>): string[] {
  return Object.keys(shape).filter((k) => shape[k].safeParse(undefined).success);
}

describe("render — component output behavior", () => {
  for (const [id, meta] of Object.entries(registry)) {
    describe(id, () => {
      it("renders without throwing with full default content", () => {
        expect(() =>
          render(createElement(meta.component, { content: meta.default }))
        ).not.toThrow();
      });

      it("renders without throwing when all optional fields are absent", () => {
        const shape = shapeOf(meta.schema);
        const optionalKeys = optionalKeysOf(shape);
        const minContent = Object.fromEntries(
          Object.entries(meta.default as Record<string, unknown>).filter(
            ([k]) => !optionalKeys.includes(k)
          )
        );
        expect(() =>
          render(createElement(meta.component, { content: minContent }))
        ).not.toThrow();
      });

      it("wires ThemeOverride keys to CSS custom properties on the root element", () => {
        const theme = { "color-accent": "#ff0000", "spacing-base": "1rem" };
        const { container } = render(
          createElement(meta.component, { content: meta.default, theme })
        );
        const style =
          (container.firstElementChild as HTMLElement).getAttribute("style") ?? "";
        expect(style).toContain("--v-color-accent");
        expect(style).toContain("--v-spacing-base");
      });
    });
  }
});
