// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

const REPO_ROOT = resolve(".");
const GITIGNORE_PATH = resolve(".gitignore");

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

    it("excludes ephemeral playwright-cli artifacts", () => {
      const lines = readGitignoreLines();
      expect(lines).toContain(".playwright-cli/");
    });
  });

  describe("playwright-cli artifact exclusion via git check-ignore", () => {
    it("ignores a log file at root of .playwright-cli/", () => {
      expect(isIgnored(".playwright-cli/session.log")).toBe(true);
    });

    it("ignores a PNG screenshot artifact", () => {
      expect(isIgnored(".playwright-cli/page-2026-01-01T00-00-00-000Z.png")).toBe(true);
    });

    it("ignores a YAML dump artifact", () => {
      expect(isIgnored(".playwright-cli/page-2026-01-01T00-00-00-000Z.yml")).toBe(true);
    });

    it("ignores files at any depth under .playwright-cli/", () => {
      expect(isIgnored(".playwright-cli/subdir/nested/file.json")).toBe(true);
    });

    it("ignores the directory itself", () => {
      expect(isIgnored(".playwright-cli/")).toBe(true);
    });
  });

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

  describe("transitive hygiene - no staged playwright artifacts remain", () => {
    it("no .playwright-cli/ files appear in the git index", () => {
      const r = spawnSync(
        "git",
        ["ls-files", "--cached", ".playwright-cli/"],
        { cwd: REPO_ROOT, encoding: "utf-8" }
      );
      const stagedArtifacts = r.stdout.trim().split("\n").filter(Boolean);
      expect(stagedArtifacts).toEqual([]);
    });
  });
});
