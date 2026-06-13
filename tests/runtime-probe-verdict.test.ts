// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import {
  coveredSurfaceCount,
  probeCount,
  surfaceFor,
  verdictFor,
  verdictLine,
  type ProbeResult,
  type SurfaceContract,
} from "../demo/tests/runtime-probe/verdict-reporter";

const SURFACES = [
  { id: "alpha", file: /alpha\.test\.ts$/, title: /renders alpha/ },
  { id: "beta", file: /beta\.test\.ts$/, title: /renders beta/ },
] as const satisfies readonly SurfaceContract[];

function result(file: string, title: string, passed = true): ProbeResult {
  return { file, title, passed };
}

describe("runtime probe verdict algorithm", () => {
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

  it("deduplicates probe files and normalizes Windows path separators", () => {
    const results = [
      result("demo\\tests\\runtime-probe\\alpha.test.ts", "renders alpha"),
      result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha again"),
      result("demo/tests/unit/alpha.test.ts", "renders alpha unit"),
    ];

    expect(probeCount(results)).toBe(1);
  });

  it("matches a surface only when both file and title contracts match", () => {
    expect(surfaceFor(result("demo/tests/runtime-probe/alpha.test.ts", "renders alpha"), SURFACES)).toBe("alpha");
    expect(surfaceFor(result("demo/tests/runtime-probe/alpha.test.ts", "renders gamma"), SURFACES)).toBeNull();
    expect(surfaceFor(result("demo/tests/runtime-probe/gamma.test.ts", "renders alpha"), SURFACES)).toBeNull();
  });

  it("formats the verdict line used by pipeline logs", () => {
    expect(
      verdictLine({
        kind: "CLEAN",
        probeCount: 2,
        bugCount: 0,
        coveredSurfaceCount: 2,
        expectedSurfaceCount: 2,
      })
    ).toBe("CLEAN: 2 probes, 0 bugs, 2/2 surfaces covered");
  });
});
