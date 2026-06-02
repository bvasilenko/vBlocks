// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, vi } from "vitest";
import { createElement } from "react";
import { render, fireEvent } from "@testing-library/react";
import { loadFixture } from "@booga/vfixtures";
import { registry, type BlockId } from "../src/registry";
import { BlockInspector } from "../demo/src/catalog/block-inspector";

const stripe = loadFixture("stripe");

describe("BlockInspector - shell contract for every registered block", () => {
  for (const id of Object.keys(registry) as BlockId[]) {
    it(`"${id}": renders without throwing`, () => {
      expect(() =>
        render(
          createElement(BlockInspector, {
            blockId: id,
            brand: stripe,
            onBack: () => {},
          })
        )
      ).not.toThrow();
    });
  }
});

describe("BlockInspector - header metadata", () => {
  it("renders a Back button for a known block", () => {
    const { getByRole } = render(
      <BlockInspector blockId="hero/split" brand={stripe} onBack={() => {}} />
    );
    expect(getByRole("button", { name: "Back" })).toBeTruthy();
  });

  it("Back button type is button, not submit", () => {
    const { getByRole } = render(
      <BlockInspector blockId="hero/split" brand={stripe} onBack={() => {}} />
    );
    expect((getByRole("button", { name: "Back" }) as HTMLButtonElement).type).toBe("button");
  });

  it("renders the block ID in a code element", () => {
    const { container } = render(
      <BlockInspector blockId="hero/split" brand={stripe} onBack={() => {}} />
    );
    const code = container.querySelector("code");
    expect(code?.textContent).toBe("hero/split");
  });

  it("renders the category badge in the header", () => {
    const { container } = render(
      <BlockInspector blockId="features/grid" brand={stripe} onBack={() => {}} />
    );
    const spans = Array.from(container.querySelectorAll("span"));
    expect(spans.some((s) => s.textContent === "features")).toBe(true);
  });

  it("renders the variant badge in the header", () => {
    const { container } = render(
      <BlockInspector blockId="features/grid" brand={stripe} onBack={() => {}} />
    );
    const spans = Array.from(container.querySelectorAll("span"));
    expect(spans.some((s) => s.textContent === "grid")).toBe(true);
  });
});

describe("BlockInspector - Back button interaction", () => {
  it("calls onBack when the Back button is clicked", () => {
    const onBack = vi.fn();
    const { getByRole } = render(
      <BlockInspector blockId="cta/split" brand={stripe} onBack={onBack} />
    );
    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onBack exactly once per click", () => {
    const onBack = vi.fn();
    const { getByRole } = render(
      <BlockInspector blockId="cta/split" brand={stripe} onBack={onBack} />
    );
    fireEvent.click(getByRole("button", { name: "Back" }));
    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(2);
  });
});

describe("BlockInspector - brand theme injection", () => {
  it("applies brand CSS custom properties to the block content wrapper", () => {
    const { container } = render(
      <BlockInspector blockId="hero/split" brand={stripe} onBack={() => {}} />
    );
    const themed = container.querySelector("[style]") as HTMLElement | null;
    expect(themed).not.toBeNull();
    const style = themed!.getAttribute("style") ?? "";
    expect(style).toContain("--v-color-primary");
  });

  it("different brand fixtures produce different primary CSS variable values", () => {
    const stripeThemed = render(
      <BlockInspector blockId="hero/split" brand={loadFixture("stripe")} onBack={() => {}} />
    );
    const linearThemed = render(
      <BlockInspector blockId="hero/split" brand={loadFixture("linear")} onBack={() => {}} />
    );
    const getStyle = (c: HTMLElement) =>
      (c.querySelector("[style]") as HTMLElement | null)?.getAttribute("style") ?? "";
    expect(getStyle(stripeThemed.container)).not.toBe(getStyle(linearThemed.container));
  });
});

describe("BlockInspector - unknown block ID resilience", () => {
  it("renders without throwing for an unknown block ID", () => {
    expect(() =>
      render(
        <BlockInspector
          blockId={"unknown/thing" as BlockId}
          brand={stripe}
          onBack={() => {}}
        />
      )
    ).not.toThrow();
  });

  it("shows a not-found message for an unknown block ID", () => {
    const { container } = render(
      <BlockInspector
        blockId={"unknown/thing" as BlockId}
        brand={stripe}
        onBack={() => {}}
      />
    );
    expect(container.textContent).toContain("unknown/thing");
  });

  it("still renders the Back button for an unknown block ID", () => {
    const { getByRole } = render(
      <BlockInspector
        blockId={"unknown/thing" as BlockId}
        brand={stripe}
        onBack={() => {}}
      />
    );
    expect(getByRole("button", { name: "Back" })).toBeTruthy();
  });
});
