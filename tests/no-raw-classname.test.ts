// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

function isBlockComponentFile(path: string): boolean {
  return /[/\\][^/\\]+[/\\][^/\\]+[/\\]index\.tsx$/.test(path);
}

describe("no-raw-classname — zero static className string literals in block source", () => {
  it("src/ contains no template-literal className expressions", () => {
    const srcDir = resolve("src");
    const files = collectSourceFiles(srcDir);
    const violations = files.flatMap((file) => {
      const content = readFileSync(file, "utf-8");
      const hits = content
        .split("\n")
        .map((l, i): { line: string; n: number } => ({ line: l.trim(), n: i + 1 }))
        .filter((item) => /className=\{`/.test(item.line));
      return hits.map((item) => `${file}:${item.n} → ${item.line}`);
    });
    expect(violations).toEqual([]);
  });

  it('src/ contains no className="..." occurrences', () => {
    const srcDir = resolve("src");
    const files = collectSourceFiles(srcDir);
    const violations = files.flatMap((file) => {
      const content = readFileSync(file, "utf-8");
      const hits = content
        .split("\n")
        .map((l, i): { line: string; n: number } => ({ line: l.trim(), n: i + 1 }))
        .filter((item) => item.line.includes('className="'));
      return hits.map((item) => `${file}:${item.n} → ${item.line}`);
    });
    expect(violations).toEqual([]);
  });

  it("block component files import layout primitives only via D-wrappers from primitives.ts", () => {
    const srcDir = resolve("src");
    const LAYOUT_PRIMITIVES = new Set(["Box", "Stack", "Grid", "Inline"]);
    const blockFiles = collectSourceFiles(srcDir).filter(isBlockComponentFile);
    const violations = blockFiles.flatMap((file) => {
      const content = readFileSync(file, "utf-8");
      return content.split("\n").flatMap((line, i) => {
        if (!line.includes("@booga/vui")) return [];
        const match = line.match(/import\s*\{([^}]+)\}/);
        if (!match) return [];
        const imported = match[1]
          .split(",")
          .map((s) => s.trim().replace(/\s+as\s+\w+/, "").trim());
        const forbidden = imported.filter((name) => LAYOUT_PRIMITIVES.has(name));
        if (forbidden.length === 0) return [];
        return [`${file}:${i + 1}: directly imports ${forbidden.join(", ")} from @booga/vui`];
      });
    });
    expect(violations).toEqual([]);
  });
});
