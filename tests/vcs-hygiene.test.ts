// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

const REPO_ROOT = resolve(".");
const GITIGNORE_PATH = resolve(".gitignore");

const EM_DASH_RE = /[\u2013\u2014]/;
const TEXT_FILE_RE = /\.(ts|tsx|js|jsx|json|yml|yaml|md|sh|html|css)$/;

const AUTHORED_SOURCE_ROOTS = [
  "src",
  "demo/src",
  "tests",
  "demo/tests",
  ".github/workflows",
];

const EPHEMERAL_ARTIFACT_DIRS: ReadonlyArray<{
  pattern: string;
  examplePaths: string[];
  stagedRoots: string[];
}> = [
  {
    pattern: ".playwright-cli/",
    examplePaths: [
      ".playwright-cli/session.log",
      ".playwright-cli/page-2026-01-01T00-00-00-000Z.png",
      ".playwright-cli/page-2026-01-01T00-00-00-000Z.yml",
      ".playwright-cli/subdir/nested/file.json",
    ],
    stagedRoots: [".playwright-cli/"],
  },
  {
    pattern: "test-results/",
    examplePaths: [
      "test-results/some-run/trace.zip",
      "demo/test-results/.last-run.json",
      "demo/test-results/some-run/video.webm",
    ],
    stagedRoots: ["test-results/", "demo/test-results/"],
  },
];

function readGitignoreLines(): string[] {
  return readFileSync(GITIGNORE_PATH, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
}

function isIgnored(path: string): boolean {
  const r = spawnSync("git", ["check-ignore", "-q", path], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
  });
  return r.status === 0;
}

function trackedFilesUnder(roots: string[]): string[] {
  const r = spawnSync("git", ["ls-files", "--", ...roots], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
  });
  return r.stdout
    .trim()
    .split("\n")
    .filter((f) => Boolean(f) && TEXT_FILE_RE.test(f));
}

function stagedFilesUnder(path: string): string[] {
  const r = spawnSync("git", ["ls-files", "--cached", path], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
  });
  return r.stdout.trim().split("\n").filter(Boolean);
}

describe("vcs-hygiene - .gitignore exclusion contract", () => {
  describe("gitignore structural integrity", () => {
    it("is non-empty", () => {
      const lines = readGitignoreLines();
      expect(lines.length).toBeGreaterThan(0);
    });

    it("contains no duplicate patterns", () => {
      const lines = readGitignoreLines();
      expect(new Set(lines).size).toBe(lines.length);
    });

    it("excludes standard build artifacts", () => {
      const lines = readGitignoreLines();
      expect(lines).toContain("node_modules/");
      expect(lines).toContain("dist/");
      expect(lines).toContain("coverage/");
    });

    it.each(EPHEMERAL_ARTIFACT_DIRS.map(({ pattern }) => [pattern]))(
      "excludes ephemeral artifact directory %s",
      (pattern) => {
        expect(readGitignoreLines()).toContain(pattern);
      }
    );
  });

  describe.each(EPHEMERAL_ARTIFACT_DIRS)(
    "$pattern - artifact exclusion via git check-ignore",
    ({ pattern, examplePaths }) => {
      it("ignores the directory itself", () => {
        expect(isIgnored(pattern)).toBe(true);
      });

      it.each(examplePaths.map((p) => [p]))("ignores %s", (path) => {
        expect(isIgnored(path)).toBe(true);
      });
    }
  );

  describe("false-positive guard - source files are not accidentally excluded", () => {
    const sourcePaths = [
      "src/index.ts",
      "tests/vcs-hygiene.test.ts",
      "demo/tailwind.config.js",
      "package.json",
      "tsconfig.json",
      ".gitignore",
    ];

    it.each(sourcePaths.map((p) => [p]))("does not exclude %s", (path) => {
      expect(isIgnored(path)).toBe(false);
    });
  });

  describe("transitive hygiene - no staged ephemeral artifacts remain", () => {
    const stagedRoots = EPHEMERAL_ARTIFACT_DIRS.flatMap(({ stagedRoots }) => stagedRoots);

    it.each(stagedRoots.map((p) => [p]))("no files under %s appear in the git index", (path) => {
      expect(stagedFilesUnder(path)).toEqual([]);
    });
  });
});

describe("source text purity - em-dash-free authoring contract", () => {
  it("no tracked text source file under authored roots contains an em-dash character", () => {
    const files = trackedFilesUnder(AUTHORED_SOURCE_ROOTS);
    const violations = files.flatMap((rel) => {
      const content = readFileSync(resolve(REPO_ROOT, rel), "utf-8");
      return content
        .split("\n")
        .flatMap((line, i) =>
          EM_DASH_RE.test(line) ? [`${rel}:${i + 1} -> ${line.trim()}`] : []
        );
    });
    expect(violations).toEqual([]);
  });
});
