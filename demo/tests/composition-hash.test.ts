// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import { compositionFromHash, compositionToHash, type CompositionSpec } from "@booga/vbrand/composition";
import { compositionHashFor } from "../src/routing/composition-hash";
import type { RouteMode } from "../src/routing/route";

const NOMINAL_SPEC: CompositionSpec = {
  sections: [
    { id: "hero/split", visible: true, density: "regular", order: 0 },
    { id: "features/grid", visible: true, density: "compact", order: 1 },
  ],
};

function compositionPair(value: CompositionSpec): string {
  return compositionToHash(value).slice(1);
}

const ROUTE_MODES: readonly RouteMode[] = ["catalog", "canvas", "app-template"];

describe("compositionHashFor - route mode preservation", () => {
  it.each(["", "#", "#trace=true", "trace=true", "#mode=unknown", "#mode=", "#mode=CANVAS"])(
    "writes only the composition when no valid route mode is present: %s",
    (currentHash) => {
      const hash = compositionHashFor(NOMINAL_SPEC, currentHash);
      expect(hash).toBe(compositionToHash(NOMINAL_SPEC));
      expect(compositionFromHash(hash)).toEqual(NOMINAL_SPEC);
    }
  );

  it.each(ROUTE_MODES)("preserves valid route mode %s before the composition payload", (mode) => {
    const hash = compositionHashFor(NOMINAL_SPEC, `#mode=${mode}`);
    expect(hash).toBe(`#mode=${mode}&${compositionPair(NOMINAL_SPEC)}`);
    expect(new URLSearchParams(hash.slice(1)).get("mode")).toBe(mode);
    expect(compositionFromHash(hash)).toEqual(NOMINAL_SPEC);
  });

  it.each(ROUTE_MODES)("drops unrelated hash keys while preserving route mode %s", (mode) => {
    expect(compositionHashFor(NOMINAL_SPEC, `#trace=true&mode=${mode}&x=1`))
      .toBe(`#mode=${mode}&${compositionPair(NOMINAL_SPEC)}`);
  });

  it("uses the first valid route mode when duplicate mode keys are present", () => {
    const hash = compositionHashFor(NOMINAL_SPEC, "#mode=canvas&mode=catalog");
    expect(hash).toBe(`#mode=canvas&${compositionPair(NOMINAL_SPEC)}`);
    expect(compositionFromHash(hash)).toEqual(NOMINAL_SPEC);
  });

  it.each(ROUTE_MODES)("extracts route mode %s from a hash string without a leading # prefix", (mode) => {
    const hash = compositionHashFor(NOMINAL_SPEC, `mode=${mode}`);
    expect(hash).toBe(`#mode=${mode}&${compositionPair(NOMINAL_SPEC)}`);
    expect(compositionFromHash(hash)).toEqual(NOMINAL_SPEC);
  });

  it("overwrites an existing composition payload in the current hash while keeping the mode", () => {
    const existingHash = compositionHashFor(NOMINAL_SPEC, "#mode=canvas");
    const updatedSpec: CompositionSpec = {
      sections: [{ id: "cta/split", visible: true, density: "compact", order: 0 }],
    };
    const result = compositionHashFor(updatedSpec, existingHash);
    expect(result).toBe(`#mode=canvas&${compositionPair(updatedSpec)}`);
    expect(compositionFromHash(result)).toEqual(updatedSpec);
  });
});

describe("compositionHashFor - spec shape round-trips", () => {
  const EMPTY_SPEC: CompositionSpec = { sections: [] };

  const SINGLE_VISIBLE: CompositionSpec = {
    sections: [{ id: "hero/split", visible: true, density: "regular", order: 0 }],
  };

  const SINGLE_HIDDEN: CompositionSpec = {
    sections: [{ id: "hero/split", visible: false, density: "regular", order: 0 }],
  };

  const MIXED_VISIBILITY: CompositionSpec = {
    sections: [
      { id: "hero/split",    visible: false, density: "compact", order: 0 },
      { id: "features/grid", visible: true,  density: "regular", order: 1 },
    ],
  };

  it("empty sections array produces a # hash string without throwing", () => {
    const hash = compositionHashFor(EMPTY_SPEC, "");
    expect(hash).toMatch(/^#/);
  });

  it("empty sections array: compositionFromHash returns null", () => {
    const hash = compositionHashFor(EMPTY_SPEC, "");
    expect(compositionFromHash(hash)).toBeNull();
  });

  it("single visible section round-trips without data loss", () => {
    const hash = compositionHashFor(SINGLE_VISIBLE, "");
    expect(compositionFromHash(hash)).toEqual(SINGLE_VISIBLE);
  });

  it("single hidden section round-trips with visible=false preserved", () => {
    const hash = compositionHashFor(SINGLE_HIDDEN, "");
    expect(compositionFromHash(hash)).toEqual(SINGLE_HIDDEN);
  });

  it("mixed-visibility spec round-trips preserving each section's visibility", () => {
    const hash = compositionHashFor(MIXED_VISIBILITY, "");
    expect(compositionFromHash(hash)).toEqual(MIXED_VISIBILITY);
  });

  it("empty spec with a preserved route mode retains the mode key in the hash", () => {
    const hash = compositionHashFor(EMPTY_SPEC, "#mode=canvas");
    expect(new URLSearchParams(hash.slice(1)).get("mode")).toBe("canvas");
  });

  it("hidden-section spec with a preserved route mode retains both mode and section data", () => {
    const hash = compositionHashFor(SINGLE_HIDDEN, "#mode=catalog");
    expect(new URLSearchParams(hash.slice(1)).get("mode")).toBe("catalog");
    expect(compositionFromHash(hash)).toEqual(SINGLE_HIDDEN);
  });

  it("preserves all three density values through a round-trip", () => {
    const allDensities: CompositionSpec = {
      sections: [
        { id: "hero/split",    visible: true,  density: "compact",  order: 0 },
        { id: "features/grid", visible: true,  density: "regular",  order: 1 },
        { id: "cta/split",     visible: false, density: "spacious", order: 2 },
      ],
    };
    expect(compositionFromHash(compositionHashFor(allDensities, ""))).toEqual(allDensities);
  });

  it("non-sequential order values survive a round-trip unchanged", () => {
    const spec: CompositionSpec = {
      sections: [
        { id: "cta/split",  visible: true, density: "regular", order: 5 },
        { id: "hero/split", visible: true, density: "compact", order: 2 },
      ],
    };
    expect(compositionFromHash(compositionHashFor(spec, ""))).toEqual(spec);
  });
});
