import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { registry } from "../src/registry";

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
    });
  }
});
