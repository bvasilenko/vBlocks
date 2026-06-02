// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { loadFixture } from "@booga/vfixtures";
import type { CompositionSpec } from "@booga/vbrand/composition";
import { registry, type BlockId } from "../src/registry";
import { CatalogView } from "../demo/src/catalog/catalog-view";

const stripe = loadFixture("stripe");

const singleSectionSpec = (id: BlockId): CompositionSpec => ({
  sections: [{ id, visible: true, density: "regular", order: 0 }],
});

const hiddenSpec = (id: BlockId): CompositionSpec => ({
  sections: [{ id, visible: false, density: "regular", order: 0 }],
});

beforeEach(() => {
  window.history.pushState({}, "", "/");
});

describe("CatalogView - TOC navigation structure", () => {
  it("renders a nav element with aria-label='Block navigation'", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    expect(getByRole("navigation", { name: "Block navigation" })).toBeTruthy();
  });

  it("TOC contains a button for each visible variant", () => {
    const spec: CompositionSpec = {
      sections: [
        { id: "hero/split",  visible: true,  density: "regular", order: 0 },
        { id: "hero/centered", visible: true,  density: "regular", order: 1 },
        { id: "cta/split",   visible: false, density: "regular", order: 2 },
      ],
    };
    const { getByRole } = render(<CatalogView brand={stripe} composition={spec} />);
    const nav = getByRole("navigation", { name: "Block navigation" });
    const buttons = nav.querySelectorAll("button");
    expect(buttons).toHaveLength(2);
  });

  it("TOC button text is the variant portion of the block ID", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    const nav = getByRole("navigation", { name: "Block navigation" });
    expect(nav.textContent).toContain("split");
  });

  it("hidden sections are absent from the TOC", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={hiddenSpec("hero/split")} />
    );
    const nav = getByRole("navigation", { name: "Block navigation" });
    expect(nav.querySelectorAll("button")).toHaveLength(0);
  });

  it("TOC shows a category label for each group", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    const nav = getByRole("navigation", { name: "Block navigation" });
    expect(nav.textContent).toContain("hero");
  });
});

describe("CatalogView - inspector navigation", () => {
  it("clicking a TOC button shows the BlockInspector", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    const nav = getByRole("navigation", { name: "Block navigation" });
    const button = nav.querySelector("button") as HTMLButtonElement;
    fireEvent.click(button);
    expect(getByRole("button", { name: "Back" })).toBeTruthy();
  });

  it("clicking a TOC button sets the inspect URL param", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    const nav = getByRole("navigation", { name: "Block navigation" });
    fireEvent.click(nav.querySelector("button") as HTMLButtonElement);
    const params = new URLSearchParams(window.location.search);
    expect(params.get("inspect")).toBe("hero-split");
  });

  it("clicking Back from inspector returns to grid view", () => {
    const { getByRole, queryByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    const nav = getByRole("navigation", { name: "Block navigation" });
    fireEvent.click(nav.querySelector("button") as HTMLButtonElement);
    expect(getByRole("button", { name: "Back" })).toBeTruthy();

    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("clicking Back clears the inspect URL param", () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    fireEvent.click(
      (getByRole("navigation", { name: "Block navigation" })).querySelector("button") as HTMLButtonElement
    );
    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(new URLSearchParams(window.location.search).get("inspect")).toBeNull();
  });

  it("an initial inspect URL param opens the inspector on mount", () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    expect(getByRole("button", { name: "Back" })).toBeTruthy();
  });
});

describe("CatalogView - popstate synchronization", () => {
  it("dispatching popstate with an inspect param in URL shows the inspector", async () => {
    const { getByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    await act(async () => {
      window.history.pushState({}, "", "/?inspect=hero-split");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(getByRole("button", { name: "Back" })).toBeTruthy();
  });

  it("dispatching popstate with no inspect param hides the inspector", async () => {
    window.history.pushState({}, "", "/?inspect=hero-split");
    const { queryByRole } = render(
      <CatalogView brand={stripe} composition={singleSectionSpec("hero/split")} />
    );
    await act(async () => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(queryByRole("button", { name: "Back" })).toBeNull();
  });
});

describe("CatalogView - groupByCategory integrity", () => {
  it("each category group contains only the variants belonging to that category", () => {
    const spec: CompositionSpec = {
      sections: [
        { id: "hero/split",    visible: true, density: "regular", order: 0 },
        { id: "hero/centered", visible: true, density: "regular", order: 1 },
        { id: "cta/split",     visible: true, density: "regular", order: 2 },
      ],
    };
    const { getByRole } = render(<CatalogView brand={stripe} composition={spec} />);
    const nav = getByRole("navigation", { name: "Block navigation" });
    const buttons = Array.from(nav.querySelectorAll("button")).map((b) => b.textContent);
    expect(buttons).toContain("split");
    expect(buttons).toContain("centered");
    expect(buttons.filter((t) => t === "split")).toHaveLength(2);
  });

  it("renders without throwing for the full default composition", () => {
    const fullSpec: CompositionSpec = {
      sections: (Object.keys(registry) as BlockId[]).map((id, order) => ({
        id,
        visible: true,
        density: "regular" as const,
        order,
      })),
    };
    expect(() =>
      render(<CatalogView brand={stripe} composition={fullSpec} />)
    ).not.toThrow();
  });
});
