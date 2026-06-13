// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import type { FullConfig, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";

export type SurfaceContract = {
  id: string;
  file: RegExp;
  title: RegExp;
};

export type VerdictKind = "CLEAN" | "BUGS" | "PARTIAL";

export type ProbeResult = {
  file: string;
  title: string;
  passed: boolean;
};

export type Verdict = {
  kind: VerdictKind;
  probeCount: number;
  bugCount: number;
  coveredSurfaceCount: number;
  expectedSurfaceCount: number;
};

export const EXPECTED_SURFACES = [
  {
    id: "mode-query-param",
    file: /mode-query-param\.test\.ts$/,
    title: /fresh navigation renders only the (catalog|canvas|app-template) surface/,
  },
  {
    id: "app-template-hero-brand-mark",
    file: /app-template-hero\.test\.ts$/,
    title: /brand mark uses a high-fidelity source without CSS filter or raster upscale/,
  },
  {
    id: "app-template-hero-gap",
    file: /app-template-hero\.test\.ts$/,
    title: /hero-to-features section gap stays below the exported threshold/,
  },
] as const satisfies readonly SurfaceContract[];

const RUNTIME_PROBE_FILE = /\/runtime-probe\/.*\.test\.ts$/;

function normalizedFile(test: TestCase): string {
  return test.location.file.replace(/\\/g, "/");
}

function normalizedTitle(test: TestCase): string {
  return test.titlePath().join(" ");
}

export function surfaceFor(
  result: ProbeResult,
  surfaces: readonly SurfaceContract[] = EXPECTED_SURFACES
): string | null {
  const surface = surfaces.find(({ file, title }) =>
    file.test(result.file) && title.test(result.title)
  );
  return surface?.id ?? null;
}

export function probeCount(results: readonly ProbeResult[]): number {
  return new Set(
    results
      .map((result) => result.file.replace(/\\/g, "/"))
      .filter((file) => RUNTIME_PROBE_FILE.test(file))
  ).size;
}

export function coveredSurfaceCount(
  results: readonly ProbeResult[],
  surfaces: readonly SurfaceContract[] = EXPECTED_SURFACES
): number {
  const covered = new Set<string>();

  for (const result of results) {
    if (!result.passed) continue;
    const surface = surfaceFor(result, surfaces);
    if (surface) covered.add(surface);
  }

  return covered.size;
}

export function verdictFor(
  results: readonly ProbeResult[],
  expectedTestCount: number,
  surfaces: readonly SurfaceContract[] = EXPECTED_SURFACES
): Verdict {
  const bugCount = results.filter((result) => !result.passed).length;
  const covered = coveredSurfaceCount(results, surfaces);
  const expected = surfaces.length;
  const partial = results.length !== expectedTestCount || covered !== expected;

  return {
    kind: bugCount > 0 ? "BUGS" : partial ? "PARTIAL" : "CLEAN",
    probeCount: probeCount(results),
    bugCount,
    coveredSurfaceCount: covered,
    expectedSurfaceCount: expected,
  };
}

export function verdictLine(verdict: Verdict): string {
  return `${verdict.kind}: ${verdict.probeCount} probes, ${verdict.bugCount} bugs, ${verdict.coveredSurfaceCount}/${verdict.expectedSurfaceCount} surfaces covered`;
}

export default class RuntimeProbeVerdictReporter implements Reporter {
  private expectedTestCount = 0;
  private readonly results: ProbeResult[] = [];

  onBegin(_config: FullConfig, suite: Suite): void {
    this.expectedTestCount = suite.allTests().length;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      file: normalizedFile(test),
      title: normalizedTitle(test),
      passed: result.status === "passed",
    });
  }

  onEnd(): void {
    const line = verdictLine(verdictFor(this.results, this.expectedTestCount));
    process.stdout.write(`${line}\n`);
  }
}
