// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import { compositionFromHash, compositionToHash, type CompositionSpec } from "@booga/vbrand/composition";
import { compositionHashFor } from "../src/routing/composition-hash";
import type { RouteMode } from "../src/routing/route";

const spec: CompositionSpec = {
  sections: [
    { id: "hero/split", visible: true, density: "regular", order: 0 },
    { id: "features/grid", visible: true, density: "compact", order: 1 },
  ],
};

function compositionPair(value: CompositionSpec): string {
  return compositionToHash(value).slice(1);
}

const ROUTE_MODES: readonly RouteMode[] = ["catalog", "canvas", "app-template"];

describe("compositionHashFor", () => {
  it.each(["", "#", "#trace=true", "trace=true", "#mode=unknown"])(
    "writes only the composition when no valid route mode is present: %s",
    (currentHash) => {
      const hash = compositionHashFor(spec, currentHash);
      expect(hash).toBe(compositionToHash(spec));
      expect(compositionFromHash(hash)).toEqual(spec);
    }
  );

  it.each(ROUTE_MODES)("preserves valid route mode %s before the composition payload", (mode) => {
    const hash = compositionHashFor(spec, `#mode=${mode}`);
    expect(hash).toBe(`#mode=${mode}&${compositionPair(spec)}`);
    expect(new URLSearchParams(hash.slice(1)).get("mode")).toBe(mode);
    expect(compositionFromHash(hash)).toEqual(spec);
  });

  it.each(ROUTE_MODES)("drops unrelated hash keys while preserving route mode %s", (mode) => {
    expect(compositionHashFor(spec, `#trace=true&mode=${mode}&x=1`))
      .toBe(`#mode=${mode}&${compositionPair(spec)}`);
  });

  it("uses the first valid route mode when duplicate mode keys are present", () => {
    const hash = compositionHashFor(spec, "#mode=canvas&mode=catalog");
    expect(hash).toBe(`#mode=canvas&${compositionPair(spec)}`);
    expect(compositionFromHash(hash)).toEqual(spec);
  });
});
