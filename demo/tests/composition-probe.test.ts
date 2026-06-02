// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import { loadFixture } from "@booga/vfixtures";
import {
  compositionToHash,
  compositionFromHash,
  updateSection,
  reorderSections,
  sectionsByOrder,
  visibleSections,
  type CompositionSpec,
} from "@booga/vbrand/composition";
import { catalogMode } from "../../src/modes/catalog";
import { canvasMode } from "../../src/modes/canvas";
import { defaultCatalogComposition } from "../../src/modes/default-composition";

const stripe = loadFixture("stripe");
const baseSpec = defaultCatalogComposition();

type EditOp = {
  name: string;
  edit: (spec: CompositionSpec) => CompositionSpec;
  verify: (original: CompositionSpec, edited: CompositionSpec) => void;
};

const VISITOR_EDITS: EditOp[] = [
  {
    name: "toggle visibility: hide hero/split",
    edit: (spec) => updateSection(spec, "hero/split", { visible: false }),
    verify: (_orig, edited) => {
      const section = edited.sections.find((s) => s.id === "hero/split");
      expect(section?.visible).toBe(false);
    },
  },
  {
    name: "change density: cta/split → compact",
    edit: (spec) => updateSection(spec, "cta/split", { density: "compact" }),
    verify: (_orig, edited) => {
      const section = edited.sections.find((s) => s.id === "cta/split");
      expect(section?.density).toBe("compact");
    },
  },
  {
    name: "reorder: move order-0 section to position 3",
    edit: (spec) => reorderSections(spec, 0, 3),
    verify: (orig, edited) => {
      const origFirst = sectionsByOrder(orig)[0];
      const editedOrdered = sectionsByOrder(edited);
      expect(editedOrdered[3].id).toBe(origFirst.id);
    },
  },
];

describe("composition visitor-edit operations - correctness", () => {
  for (const { name, edit, verify } of VISITOR_EDITS) {
    it(`${name}: produces the expected mutation`, () => {
      const edited = edit(baseSpec);
      verify(baseSpec, edited);
    });

    it(`${name}: preserves total section count`, () => {
      const edited = edit(baseSpec);
      expect(edited.sections).toHaveLength(baseSpec.sections.length);
    });

    it(`${name}: returns a new object (immutability)`, () => {
      const edited = edit(baseSpec);
      expect(edited).not.toBe(baseSpec);
    });

    it(`${name}: does not mutate the input spec`, () => {
      const snapshot = JSON.stringify(baseSpec);
      edit(baseSpec);
      expect(JSON.stringify(baseSpec)).toBe(snapshot);
    });
  }
});

describe("compositionToHash / compositionFromHash - round-trip fidelity", () => {
  it("base spec round-trips through hash without data loss", () => {
    const hash = compositionToHash(baseSpec);
    const restored = compositionFromHash(hash);
    expect(restored).toEqual(baseSpec);
  });

  it("compositionFromHash returns null for an empty string", () => {
    expect(compositionFromHash("")).toBeNull();
  });

  it("compositionFromHash returns null for a garbage string", () => {
    expect(compositionFromHash("not-a-valid-hash-!!!")).toBeNull();
  });

  for (const { name, edit } of VISITOR_EDITS) {
    it(`${name}: edited spec round-trips faithfully`, () => {
      const edited = edit(baseSpec);
      const hash = compositionToHash(edited);
      const restored = compositionFromHash(hash);
      expect(restored).toEqual(edited);
    });

    it(`${name}: hash differs from base spec hash`, () => {
      const edited = edit(baseSpec);
      expect(compositionToHash(edited)).not.toBe(compositionToHash(baseSpec));
    });
  }

  it("two equal specs produce the same hash (deterministic)", () => {
    const a = defaultCatalogComposition();
    const b = defaultCatalogComposition();
    expect(compositionToHash(a)).toBe(compositionToHash(b));
  });
});

describe("sectionsByOrder - ordering contract", () => {
  it("returns sections in ascending order-value sequence", () => {
    const ordered = sectionsByOrder(baseSpec);
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i].order).toBeGreaterThanOrEqual(ordered[i - 1].order);
    }
  });

  it("count matches total section count", () => {
    expect(sectionsByOrder(baseSpec)).toHaveLength(baseSpec.sections.length);
  });

  it("after reorder the sequence is still contiguous from 0", () => {
    const reordered = reorderSections(baseSpec, 0, 3);
    const orders = sectionsByOrder(reordered).map((s) => s.order);
    orders.forEach((v, i) => expect(v).toBe(i));
  });
});

describe("visibleSections - filtering contract", () => {
  it("all sections visible: returns full list", () => {
    expect(visibleSections(baseSpec)).toHaveLength(baseSpec.sections.length);
  });

  it("one section hidden: returns count minus one", () => {
    const edited = updateSection(baseSpec, "hero/split", { visible: false });
    expect(visibleSections(edited)).toHaveLength(baseSpec.sections.length - 1);
  });

  it("all sections hidden: returns empty list", () => {
    const allHidden: CompositionSpec = {
      sections: baseSpec.sections.map((s) => ({ ...s, visible: false })),
    };
    expect(visibleSections(allHidden)).toHaveLength(0);
  });

  it("every returned section has visible === true", () => {
    const mixed: CompositionSpec = {
      sections: baseSpec.sections.map((s, i) => ({ ...s, visible: i % 2 === 0 })),
    };
    for (const s of visibleSections(mixed)) {
      expect(s.visible).toBe(true);
    }
  });
});

describe("composition → catalog rendered tree", () => {
  it("renders one <section> element per visible section", () => {
    const { container } = render(
      createElement(() => catalogMode.compose(stripe, baseSpec) as JSX.Element)
    );
    const domSections = container.querySelectorAll("section[id^=\"block-\"]");
    expect(domSections.length).toBe(visibleSections(baseSpec).length);
  });

  it("each visible section ID appears as a DOM id on its <section>", () => {
    const { container } = render(
      createElement(() => catalogMode.compose(stripe, baseSpec) as JSX.Element)
    );
    for (const spec of visibleSections(baseSpec)) {
      const domId = `block-${spec.id.replace("/", "-")}`;
      expect(container.querySelector(`#${domId}`)).not.toBeNull();
    }
  });

  it("hidden section is absent from the rendered DOM", () => {
    const edited = updateSection(baseSpec, "hero/split", { visible: false });
    const { container } = render(
      createElement(() => catalogMode.compose(stripe, edited) as JSX.Element)
    );
    expect(container.querySelector("#block-hero-split")).toBeNull();
  });

  it("hiding one section reduces <section> count by exactly one", () => {
    const full = render(
      createElement(() => catalogMode.compose(stripe, baseSpec) as JSX.Element)
    );
    const edited = updateSection(baseSpec, "hero/split", { visible: false });
    const reduced = render(
      createElement(() => catalogMode.compose(stripe, edited) as JSX.Element)
    );
    expect(reduced.container.querySelectorAll("section[id^=\"block-\"]").length).toBe(
      full.container.querySelectorAll("section[id^=\"block-\"]").length - 1
    );
  });

  for (const { name, edit } of VISITOR_EDITS) {
    it(`${name}: rendered <section> count matches visible-section count`, () => {
      const edited = edit(baseSpec);
      const { container } = render(
        createElement(() => catalogMode.compose(stripe, edited) as JSX.Element)
      );
      const domSections = container.querySelectorAll("section[id^=\"block-\"]");
      expect(domSections.length).toBe(visibleSections(edited).length);
    });
  }

  it("all-hidden composition renders a container with no <section> children", () => {
    const allHidden: CompositionSpec = {
      sections: baseSpec.sections.map((s) => ({ ...s, visible: false })),
    };
    const { container } = render(
      createElement(() => catalogMode.compose(stripe, allHidden) as JSX.Element)
    );
    expect(container.querySelectorAll("section[id^=\"block-\"]").length).toBe(0);
  });
});

describe("composition → canvas rendered tree", () => {
  it("renders without throwing for the base composition", () => {
    expect(() =>
      render(createElement(() => canvasMode.compose(stripe, baseSpec) as JSX.Element))
    ).not.toThrow();
  });

  it("renders without throwing when all sections are hidden", () => {
    const allHidden: CompositionSpec = {
      sections: baseSpec.sections.map((s) => ({ ...s, visible: false })),
    };
    expect(() =>
      render(createElement(() => canvasMode.compose(stripe, allHidden) as JSX.Element))
    ).not.toThrow();
  });

  for (const { name, edit } of VISITOR_EDITS) {
    it(`${name}: canvas renders without throwing`, () => {
      const edited = edit(baseSpec);
      expect(() =>
        render(createElement(() => canvasMode.compose(stripe, edited) as JSX.Element))
      ).not.toThrow();
    });
  }

  it("hiding a section reduces catalog visible count (shared composition source of truth)", () => {
    const edited = updateSection(baseSpec, "hero/split", { visible: false });
    const { container } = render(
      createElement(() => catalogMode.compose(stripe, edited) as JSX.Element)
    );
    expect(container.querySelector("#block-hero-split")).toBeNull();
    expect(container.querySelectorAll("section[id^=\"block-\"]").length).toBe(
      visibleSections(edited).length
    );
  });
});
