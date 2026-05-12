// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { registry } from "../src/registry";
import { shapeOf, requiredKeysOf, minContentOf } from "./helpers";

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
        const minContent = minContentOf(meta.default as Record<string, unknown>, shape);
        expect(() =>
          render(createElement(meta.component, { content: minContent }))
        ).not.toThrow();
      });

      it("throws synchronously when content fails schema validation", () => {
        expect(() =>
          render(createElement(meta.component, { content: {} as never }))
        ).toThrow();
      });

      it("renders without throwing with an empty theme override", () => {
        expect(() =>
          render(createElement(meta.component, { content: meta.default, theme: {} }))
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

      it("renders at least one required string field's value into the DOM", () => {
        const shape = shapeOf(meta.schema);
        const def = meta.default as Record<string, unknown>;
        const required = requiredKeysOf(shape);
        const firstStrKey = required.find((k) => typeof def[k] === "string");
        if (!firstStrKey) return;
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        expect(container.textContent).toContain(def[firstStrKey] as string);
      });
    });
  }
});
