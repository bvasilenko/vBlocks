// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { registry } from "../src/registry";
import { shapeOf } from "./helpers";

function expectedRootTag(id: string): "section" | "footer" | "article" {
  if (id.startsWith("footer/")) return "footer";
  if (id.startsWith("post/")) return "article";
  return "section";
}

describe("structure — semantic HTML and accessibility contracts", () => {
  for (const [id, meta] of Object.entries(registry)) {
    describe(id, () => {
      it("root element is the correct landmark tag", () => {
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        expect(container.firstElementChild?.tagName.toLowerCase()).toBe(
          expectedRootTag(id)
        );
      });

      it("every <section> element has a non-empty aria-label", () => {
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        container.querySelectorAll("section").forEach((el) => {
          expect(
            el.getAttribute("aria-label"),
            `${id}: <section> missing aria-label`
          ).toBeTruthy();
        });
      });

      it("every <nav> element has a non-empty aria-label", () => {
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        container.querySelectorAll("nav").forEach((el) => {
          expect(
            el.getAttribute("aria-label"),
            `${id}: <nav> missing aria-label`
          ).toBeTruthy();
        });
      });

      it("every <img> element has a non-empty alt attribute", () => {
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        container.querySelectorAll("img").forEach((el) => {
          expect(
            el.getAttribute("alt"),
            `${id}: <img> missing or empty alt`
          ).toBeTruthy();
        });
      });

      it("every <a> element has a non-empty href attribute", () => {
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        container.querySelectorAll("a").forEach((el) => {
          expect(
            el.getAttribute("href"),
            `${id}: <a> missing or empty href`
          ).toBeTruthy();
        });
      });

      it("renders a heading element when the schema declares a heading field", () => {
        const shape = shapeOf(meta.schema);
        if (!("heading" in shape)) return;
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        const headings = container.querySelectorAll("h1,h2,h3,h4,h5,h6");
        expect(
          headings.length,
          `${id}: schema has 'heading' field but no heading element rendered`
        ).toBeGreaterThan(0);
      });

      it("every rendered heading element has non-empty text content", () => {
        const { container } = render(
          createElement(meta.component, { content: meta.default })
        );
        container.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el) => {
          expect(
            el.textContent?.trim().length,
            `${id}: heading element has empty text content`
          ).toBeGreaterThan(0);
        });
      });
    });
  }
});
