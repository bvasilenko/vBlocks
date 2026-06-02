// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve, relative } from "path";
import micromatch from "micromatch";

const DEMO_ROOT = resolve("demo");
const DEMO_SRC = join(DEMO_ROOT, "src");
const LIB_SRC = resolve("src");
const TAILWIND_CONFIG = join(DEMO_ROOT, "tailwind.config.js");

function collectFiles(dir: string, skipDirs = ["node_modules"]): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (skipDirs.includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, skipDirs));
    } else {
      results.push(full);
    }
  }
  return results;
}

function toConfigRelative(absolutePath: string): string {
  const rel = relative(DEMO_ROOT, absolutePath);
  return rel.startsWith(".") ? rel : `./${rel}`;
}

function stripLeadingDotSlash(s: string): string {
  return s.startsWith("./") ? s.slice(2) : s;
}

function parseTailwindContentGlobs(): string[] {
  const text = readFileSync(TAILWIND_CONFIG, "utf-8");
  const match = text.match(/content:\s*\[([\s\S]*?)\]/);
  if (!match) throw new Error("content array not found in demo/tailwind.config.js");
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

function isMatchedByAny(configRelativePath: string, globs: string[]): boolean {
  return micromatch.isMatch(
    stripLeadingDotSlash(configRelativePath),
    globs.map(stripLeadingDotSlash)
  );
}

describe("tailwind-content - demo/tailwind.config.js content globs cover all source files", () => {
  const globs = parseTailwindContentGlobs();

  describe("glob set integrity", () => {
    it("content array is non-empty", () => {
      expect(globs.length).toBeGreaterThan(0);
    });

    it("contains no duplicate glob patterns", () => {
      expect(new Set(globs).size).toBe(globs.length);
    });

    it("index.html entry is present", () => {
      expect(globs).toContain("./index.html");
    });

    it("dist glob for @booga/vblocks is present", () => {
      expect(globs.some((g) => g.includes("@booga/vblocks/dist"))).toBe(true);
    });

    it("dist glob for @booga/vui is present", () => {
      expect(globs.some((g) => g.includes("@booga/vui/dist"))).toBe(true);
    });
  });

  describe("demo/src/ - every source file is matched", () => {
    const allDemoSrcFiles = collectFiles(DEMO_SRC);

    it("demo source directory is non-empty", () => {
      expect(allDemoSrcFiles.length).toBeGreaterThan(0);
    });

    it.each(
      allDemoSrcFiles.map((f) => [toConfigRelative(f)])
    )("matches %s", (configRelPath) => {
      expect(
        isMatchedByAny(configRelPath, globs),
        `${configRelPath} not matched by any content glob`
      ).toBe(true);
    });
  });

  describe("src/ - library source accessed via Vite alias is matched", () => {
    const allLibSrcFiles = collectFiles(LIB_SRC);

    it("library source directory is non-empty", () => {
      expect(allLibSrcFiles.length).toBeGreaterThan(0);
    });

    it.each(
      allLibSrcFiles
        .filter((f) => /\.(ts|tsx)$/.test(f))
        .map((f) => [toConfigRelative(f)])
    )("matches %s", (configRelPath) => {
      expect(
        isMatchedByAny(configRelPath, globs),
        `${configRelPath} not matched by any content glob`
      ).toBe(true);
    });
  });

  describe("extension coverage - each file extension class is handled across all source roots", () => {
    const extensionCases: [string, string][] = [
      ["demo/src root .js",           "./src/example.js"],
      ["demo/src root .jsx",          "./src/example.jsx"],
      ["demo/src root .ts",           "./src/example.ts"],
      ["demo/src root .tsx",          "./src/example.tsx"],
      ["demo/src nested .ts",         "./src/sub/dir/example.ts"],
      ["demo/src nested .tsx",        "./src/sub/dir/example.tsx"],
      ["lib/src root .ts",            "../src/example.ts"],
      ["lib/src root .tsx",           "../src/example.tsx"],
      ["lib/src nested .ts",          "../src/nested/deep/example.ts"],
      ["lib/src nested .tsx",         "../src/nested/deep/example.tsx"],
    ];

    it.each(extensionCases)("%s files are matched", (_label, path) => {
      expect(
        isMatchedByAny(path, globs),
        `${path} not matched - extension or source root not covered`
      ).toBe(true);
    });
  });

  describe("false-positive guard - source globs do not match node_modules within source roots", () => {
    const sourceOnlyGlobs = globs
      .filter((g) => !g.includes("node_modules"))
      .map(stripLeadingDotSlash);

    const nodeModulesCases: [string, string][] = [
      ["demo/node_modules react",       "node_modules/react/index.js"],
      ["demo/node_modules vbrand",      "node_modules/@booga/vbrand/dist/index.js"],
      ["demo/node_modules tailwind .ts","node_modules/tailwindcss/lib/util.ts"],
    ];

    it.each(nodeModulesCases)("does not match %s", (_label, path) => {
      expect(
        micromatch.isMatch(path, sourceOnlyGlobs),
        `source glob unexpectedly matched ${path}`
      ).toBe(false);
    });
  });
});
