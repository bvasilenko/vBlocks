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

describe("no-raw-classname — zero static className string literals in block source", () => {
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
});
