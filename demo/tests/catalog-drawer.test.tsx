// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { defaultCatalogComposition } from "../../src/modes/default-composition";
import { sectionsByOrder, compositionToHash, type CompositionSpec } from "@booga/vbrand/composition";
import { CatalogDrawer } from "../src/catalog/catalog-drawer";

const defaultSpec = defaultCatalogComposition();

beforeEach(() => {
  window.history.pushState({}, "", "/");
  window.location.hash = "";
});

describe("CatalogDrawer - section list", () => {
  it("renders a list item for every section in the spec", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const list = getByRole("list", { name: "Section list" });
    expect(list.querySelectorAll("li").length).toBe(defaultSpec.sections.length);
  });

  it("every section checkbox is checked by default", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.every((cb) => cb.checked)).toBe(true);
  });

  it("sections appear in ascending order", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    const ordered = sectionsByOrder(defaultSpec);
    ordered.forEach((section, i) => {
      expect(checkboxes[i].id).toContain(section.id.replace("/", "-"));
    });
  });
});

describe("CatalogDrawer - density chips", () => {
  it("the current density button is aria-pressed=true for each section", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const pressedButtons = getAllByRole("button", { pressed: true });
    expect(pressedButtons.length).toBe(defaultSpec.sections.length);
    expect(pressedButtons[0].textContent).toBe("regular");
  });

  it("clicking compact chip calls onChange with the first section density set to compact", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const compactButtons = getAllByRole("button", { name: "compact" });
    fireEvent.click(compactButtons[0]);
    expect(onChange).toHaveBeenCalledOnce();
    const updated = onChange.mock.calls[0][0] as CompositionSpec;
    const firstOrdered = sectionsByOrder(defaultSpec)[0];
    const changed = updated.sections.find((s) => s.id === firstOrdered.id);
    expect(changed?.density).toBe("compact");
  });

  it("clicking spacious chip calls onChange with updated density", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const spaciousButtons = getAllByRole("button", { name: "spacious" });
    fireEvent.click(spaciousButtons[0]);
    const updated = onChange.mock.calls[0][0] as CompositionSpec;
    const firstOrdered = sectionsByOrder(defaultSpec)[0];
    const changed = updated.sections.find((s) => s.id === firstOrdered.id);
    expect(changed?.density).toBe("spacious");
  });

  it("density chips for a hidden section are disabled", () => {
    const hiddenSpec: CompositionSpec = {
      sections: defaultSpec.sections.map((s, i) =>
        i === 0 ? { ...s, visible: false } : s
      ),
    };
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={hiddenSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const compactButtons = getAllByRole("button", { name: "compact" }) as HTMLButtonElement[];
    expect(compactButtons[0].disabled).toBe(true);
    expect(compactButtons[1].disabled).toBe(false);
  });

  it("density change on the second section targets that section, not the first", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const compactButtons = getAllByRole("button", { name: "compact" });
    fireEvent.click(compactButtons[1]);
    const updated = onChange.mock.calls[0][0] as CompositionSpec;
    const secondOrdered = sectionsByOrder(defaultSpec)[1];
    const firstOrdered = sectionsByOrder(defaultSpec)[0];
    expect(updated.sections.find((s) => s.id === secondOrdered.id)?.density).toBe("compact");
    expect(updated.sections.find((s) => s.id === firstOrdered.id)?.density).toBe(defaultSpec.sections.find((s) => s.id === firstOrdered.id)?.density);
  });
});

describe("CatalogDrawer - visibility toggle", () => {
  it("unchecking a checkbox calls onChange with that section set to not-visible", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    fireEvent.click(checkboxes[0]);
    const updated = onChange.mock.calls[0][0] as CompositionSpec;
    const firstOrdered = sectionsByOrder(defaultSpec)[0];
    const toggled = updated.sections.find((s) => s.id === firstOrdered.id);
    expect(toggled?.visible).toBe(false);
  });

  it("checking a hidden checkbox calls onChange with that section set to visible", () => {
    const hiddenSpec: CompositionSpec = {
      sections: defaultSpec.sections.map((s, i) =>
        i === 0 ? { ...s, visible: false } : s
      ),
    };
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <CatalogDrawer spec={hiddenSpec} defaultSpec={defaultSpec} onChange={onChange} />
    );
    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    fireEvent.click(checkboxes[0]);
    const updated = onChange.mock.calls[0][0] as CompositionSpec;
    const firstOrdered = sectionsByOrder(defaultSpec)[0];
    const toggled = updated.sections.find((s) => s.id === firstOrdered.id);
    expect(toggled?.visible).toBe(true);
  });
});

describe("CatalogDrawer - reset", () => {
  it("Reset button calls onChange with the defaultSpec", () => {
    const modified: CompositionSpec = {
      sections: defaultSpec.sections.map((s) => ({ ...s, density: "compact" as const, visible: false })),
    };
    const onChange = vi.fn();
    const { getByRole } = render(
      <CatalogDrawer spec={modified} defaultSpec={defaultSpec} onChange={onChange} />
    );
    fireEvent.click(getByRole("button", { name: "Reset" }));
    expect(onChange).toHaveBeenCalledWith(defaultSpec);
  });
});

describe("CatalogDrawer - URL param isolation", () => {
  it("composition hash changes do not modify the search query string", () => {
    window.history.pushState({}, "", "/?brand=fixture:stripe");
    const onChange = vi.fn();
    render(<CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />);
    expect(new URLSearchParams(window.location.search).get("brand")).toBe("fixture:stripe");
  });

  it("spec is written to window.location.hash on render", () => {
    const onChange = vi.fn();
    render(<CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />);
    expect(window.location.hash).toBe(compositionToHash(defaultSpec));
  });

  it("CatalogDrawer preserves route mode while replacing unrelated hash content with the composition", () => {
    window.location.hash = "#mode=canvas&unrelated=value";
    const onChange = vi.fn();
    render(<CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />);
    expect(window.location.hash).toBe(`#mode=canvas&${compositionToHash(defaultSpec).slice(1)}`);
    expect(new URLSearchParams(window.location.hash.slice(1)).get("mode")).toBe("canvas");
    expect(new URLSearchParams(window.location.hash.slice(1)).get("unrelated")).toBeNull();
  });

  it("a valid composition in the hash is loaded via onChange on mount", () => {
    const altSpec: CompositionSpec = {
      sections: [{ id: "hero/split", visible: false, density: "compact" as const, order: 0 }],
    };
    window.location.hash = compositionToHash(altSpec);
    const onChange = vi.fn();
    render(<CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith(altSpec);
  });

  it("an invalid or absent composition hash does not call onChange on mount", () => {
    window.location.hash = "#mode=canvas";
    const onChange = vi.fn();
    render(<CatalogDrawer spec={defaultSpec} defaultSpec={defaultSpec} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("CatalogDrawer - empty sections spec", () => {
  it("renders an empty section list without throwing when spec has no sections", () => {
    const emptySpec: CompositionSpec = { sections: [] };
    const onChange = vi.fn();
    const { getByRole } = render(
      <CatalogDrawer spec={emptySpec} defaultSpec={emptySpec} onChange={onChange} />
    );
    const list = getByRole("list", { name: "Section list" });
    expect(list.querySelectorAll("li").length).toBe(0);
  });

  it("Reset button with empty spec calls onChange with the empty defaultSpec", () => {
    const emptySpec: CompositionSpec = { sections: [] };
    const onChange = vi.fn();
    const { getByRole } = render(
      <CatalogDrawer spec={emptySpec} defaultSpec={emptySpec} onChange={onChange} />
    );
    fireEvent.click(getByRole("button", { name: "Reset" }));
    expect(onChange).toHaveBeenCalledWith(emptySpec);
  });
});
