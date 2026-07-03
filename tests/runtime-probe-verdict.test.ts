// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import {
  coveredSurfaceCount,
  EXPECTED_SURFACES,
  probeCount,
  surfaceFor,
  verdictFor,
  verdictLine,
  type ProbeResult,
  type SurfaceContract,
  type Verdict,
} from "../demo/tests/runtime-probe/verdict-reporter";

const SURFACES = [
  { id: "alpha", file: /alpha\.test\.ts$/, title: /renders alpha/ },
  { id: "beta", file: /beta\.test\.ts$/, title: /renders beta/ },
] as const satisfies readonly SurfaceContract[];

function result(file: string, title: string, passed = true): ProbeResult {
  return { file, title, passed };
}

describe("verdictFor - verdict kind selection", () => {
  it("returns CLEAN when every expected surface is covered and every probe passes", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
      result("demo/tests/runtime-probe/beta.test.ts", "renders beta"),
    ];

    expect(verdictFor(results, results.length, SURFACES)).toEqual({
      kind: "CLEAN",
      probeCount: 2,
      bugCount: 0,
      coveredSurfaceCount: 2,
      expectedSurfaceCount: 2,
    });
  });

  it("returns BUGS when any observed probe fails even if all surfaces have passing coverage", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
      result("demo/tests/runtime-probe/beta.test.ts", "renders beta"),
      result("demo/tests/runtime-probe/drawer.test.ts", "drawer closes", false),
    ];

    expect(verdictFor(results, results.length, SURFACES)).toMatchObject({
      kind: "BUGS",
      probeCount: 3,
      bugCount: 1,
      coveredSurfaceCount: 2,
    });
  });

  it("returns PARTIAL when a required surface is missing", () => {
    const results = [result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha")];

    expect(verdictFor(results, results.length, SURFACES)).toMatchObject({
      kind: "PARTIAL",
      probeCount: 1,
      bugCount: 0,
      coveredSurfaceCount: 1,
      expectedSurfaceCount: 2,
    });
  });

  it("returns PARTIAL when the reporter did not receive every planned test result", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
      result("demo/tests/runtime-probe/beta.test.ts", "renders beta"),
    ];

    expect(verdictFor(results, results.length + 1, SURFACES)).toMatchObject({
      kind: "PARTIAL",
      bugCount: 0,
      coveredSurfaceCount: 2,
    });
  });

  it("BUGS takes precedence over PARTIAL when probes fail and surfaces are missing", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha", false),
    ];

    expect(verdictFor(results, results.length, SURFACES)).toMatchObject({
      kind: "BUGS",
      bugCount: 1,
    });
  });

  it("returns PARTIAL when results are empty and surfaces are expected", () => {
    expect(verdictFor([], 0, SURFACES)).toMatchObject({
      kind: "PARTIAL",
      bugCount: 0,
      coveredSurfaceCount: 0,
      expectedSurfaceCount: 2,
    });
  });

  it("returns CLEAN when zero surfaces are expected and results are complete and passing", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
    ];
    expect(verdictFor(results, results.length, [])).toEqual({
      kind: "CLEAN",
      probeCount: 1,
      bugCount: 0,
      coveredSurfaceCount: 0,
      expectedSurfaceCount: 0,
    });
  });

  it("returns PARTIAL when zero surfaces are expected but result count mismatches expectedTestCount", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
    ];
    expect(verdictFor(results, results.length + 1, [])).toMatchObject({
      kind: "PARTIAL",
      bugCount: 0,
      coveredSurfaceCount: 0,
      expectedSurfaceCount: 0,
    });
  });

  it("returns PARTIAL when results arrive but expectedTestCount is zero", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
    ];
    expect(verdictFor(results, 0, [])).toMatchObject({
      kind: "PARTIAL",
      bugCount: 0,
      coveredSurfaceCount: 0,
      expectedSurfaceCount: 0,
    });
  });

  it("returns CLEAN when both results and expectedTestCount are zero and no surfaces are expected", () => {
    expect(verdictFor([], 0, [])).toEqual({
      kind: "CLEAN",
      probeCount: 0,
      bugCount: 0,
      coveredSurfaceCount: 0,
      expectedSurfaceCount: 0,
    });
  });
});

describe("coveredSurfaceCount - surface attribution", () => {
  it("counts one covered surface when duplicate passing probes hit the same surface", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha desktop"),
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha mobile"),
    ];

    expect(coveredSurfaceCount(results, SURFACES)).toBe(1);
  });

  it("ignores failed probes when calculating covered surfaces", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha", false),
      result("demo/tests/runtime-probe/beta.test.ts", "renders beta"),
    ];

    expect(coveredSurfaceCount(results, SURFACES)).toBe(1);
  });

  it("returns 0 when no results are provided", () => {
    expect(coveredSurfaceCount([], SURFACES)).toBe(0);
  });

  it("counts a surface once when a failing and a passing probe both match it", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha", false),
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha again", true),
    ];
    expect(coveredSurfaceCount(results, SURFACES)).toBe(1);
  });
});

describe("probeCount - file deduplication", () => {
  it("deduplicates probe files and normalizes all-backslash Windows path separators", () => {
    const results = [
      result("demo\\tests\\runtime-probe\\alpha.test.ts", "renders alpha"),
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha again"),
      result("demo/tests/unit/alpha.test.ts", "renders alpha unit"),
    ];

    expect(probeCount(results)).toBe(1);
  });

  it("normalizes mixed forward-slash and backslash separators within a single path", () => {
    const results = [
      result("demo\\tests/runtime-probe\\alpha.test.ts", "renders alpha mixed"),
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha canonical"),
    ];

    expect(probeCount(results)).toBe(1);
  });

  it("returns 0 for an empty result set", () => {
    expect(probeCount([])).toBe(0);
  });

  it("counts distinct probe files independently", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
      result("demo/tests/runtime-probe/beta.test.ts", "renders beta"),
    ];

    expect(probeCount(results)).toBe(2);
  });

  it("returns 0 when all result files are outside the runtime-probe subdirectory", () => {
    const results = [
      result("tests/hero-spacing.test.tsx", "density compact"),
      result("demo/tests/catalog-drawer.test.tsx", "density chip click"),
    ];
    expect(probeCount(results)).toBe(0);
  });

  it("counts only runtime-probe files when mixed with unit and integration test directories", () => {
    const results = [
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"),
      result("tests/hero-spacing.test.tsx", "density compact"),
      result("demo/tests/catalog-drawer.test.tsx", "drawer opens"),
    ];
    expect(probeCount(results)).toBe(1);
  });
});

describe("surfaceFor - contract matching", () => {
  it("matches a surface only when both file and title contracts match", () => {
    expect(surfaceFor(result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"), SURFACES)).toBe("alpha");
    expect(surfaceFor(result("demo/tests/runtime-probe/alpha.test.ts", "renders gamma"), SURFACES)).toBeNull();
    expect(surfaceFor(result("demo/tests/runtime-probe/gamma.test.ts", "renders alpha"), SURFACES)).toBeNull();
  });

  it("returns null for an empty surfaces list", () => {
    expect(surfaceFor(result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"), [])).toBeNull();
  });

  it("uses EXPECTED_SURFACES as the default when no surfaces argument is supplied", () => {
    const knownSurface = EXPECTED_SURFACES[0];
    const matching = result(
      "demo/tests/runtime-probe/mode-query-param.test.ts",
      "fresh navigation renders only the canvas surface",
    );
    expect(surfaceFor(matching)).toBe(knownSurface.id);
  });
});

describe("verdictLine - pipeline log format", () => {
  const CASES: ReadonlyArray<{ verdict: Verdict; expected: string }> = [
    {
      verdict: { kind: "CLEAN",   probeCount: 2, bugCount: 0, coveredSurfaceCount: 2, expectedSurfaceCount: 2 },
      expected: "CLEAN: 2 probes, 0 bugs, 2/2 surfaces covered",
    },
    {
      verdict: { kind: "BUGS",    probeCount: 3, bugCount: 2, coveredSurfaceCount: 2, expectedSurfaceCount: 2 },
      expected: "BUGS: 3 probes, 2 bugs, 2/2 surfaces covered",
    },
    {
      verdict: { kind: "PARTIAL", probeCount: 1, bugCount: 0, coveredSurfaceCount: 1, expectedSurfaceCount: 2 },
      expected: "PARTIAL: 1 probes, 0 bugs, 1/2 surfaces covered",
    },
    {
      verdict: { kind: "CLEAN",   probeCount: 0, bugCount: 0, coveredSurfaceCount: 0, expectedSurfaceCount: 0 },
      expected: "CLEAN: 0 probes, 0 bugs, 0/0 surfaces covered",
    },
  ];

  it.each(CASES)("$verdict.kind verdict formats correctly", ({ verdict, expected }) => {
    expect(verdictLine(verdict)).toBe(expected);
  });
});

describe("EXPECTED_SURFACES - shape contract", () => {
  it("every entry has a non-empty string id, a RegExp file, and a RegExp title", () => {
    for (const surface of EXPECTED_SURFACES) {
      expect(typeof surface.id).toBe("string");
      expect(surface.id.length).toBeGreaterThan(0);
      expect(surface.file).toBeInstanceOf(RegExp);
      expect(surface.title).toBeInstanceOf(RegExp);
    }
  });

  it("all surface ids are unique", () => {
    const ids = EXPECTED_SURFACES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains at least one surface definition", () => {
    expect(EXPECTED_SURFACES.length).toBeGreaterThan(0);
  });
});
