// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync, spawnSync } from "child_process";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { join, resolve } from "path";
import { tmpdir } from "os";

const SCRUB_SCRIPT = resolve(".github/scripts/scrub.sh");

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "scrub-"));
  execSync("git init", { cwd: dir, stdio: "pipe" });
  execSync('git config user.email "t@t.com"', { cwd: dir, stdio: "pipe" });
  execSync('git config user.name "t"', { cwd: dir, stdio: "pipe" });
  return dir;
}

function track(repo: string, name: string, content: string): void {
  writeFileSync(join(repo, name), content);
  execSync(`git add -- "${name}"`, { cwd: repo, stdio: "pipe" });
}

function untrack(repo: string, name: string, content: string): void {
  writeFileSync(join(repo, name), content);
}

function gitignore(repo: string, name: string, content: string): void {
  track(repo, ".gitignore", `${name}\n`);
  writeFileSync(join(repo, name), content);
}

function runScrub(repo: string): { code: number; output: string } {
  const r = spawnSync("bash", [SCRUB_SCRIPT, repo], { encoding: "utf-8" });
  return { code: r.status ?? 1, output: r.stdout + r.stderr };
}

let repo: string;
beforeEach(() => { repo = makeRepo(); });
afterEach(() => { rmSync(repo, { recursive: true, force: true }); });

describe("scrub - clean repository passes both gates", () => {
  it("exits 0 with no tracked files", () => {
    expect(runScrub(repo).code).toBe(0);
  });

  it("exits 0 when all tracked files contain only safe content", () => {
    track(repo, "index.ts", 'export const greet = "hello world";');
    track(repo, "README.md", "# Project\n\nA composable block library.");
    track(repo, "package.json", '{"name":"@booga/example","version":"0.1.0"}');
    expect(runScrub(repo).code).toBe(0);
  });
});

describe("scrub gate4 - donor pattern detection by pattern type", () => {
  it.each([
    ["hyphenated sub-brand handle",  "alexy-os",                     "ts"  ],
    ["hyphenated sub-brand handle",  "delta5-hq",                    "ts"  ],
    ["hyphenated sub-brand handle",  "quant5-lab",                   "tsx" ],
    ["URL-form handle (dot in ERE)", "github.com/alexy-os",          "md"  ],
    ["URL-form handle (dot in ERE)", "github.com/delta5-hq",         "md"  ],
    ["URL-form handle (dot in ERE)", "github.com/quant5-lab",        "yml" ],
    ["org name",                     "ui8kit",                       "json"],
    ["donor org name",               "buildy-ui",                    "ts"  ],
    ["domain with dots",             "ui.buildy.tw",                 "toml"],
    ["slash-delimited vendor path",  "hinddy/tailwind-builder",      "tsx" ],
    ["slash-delimited vendor path",  "ruvnet/ruflo",                 "ts"  ],
    ["slash-delimited vendor path",  "TauricResearch/TradingAgents", "ts"  ],
    ["absolute /tmp donor path",     "/tmp/donors/anything",         "ts"  ],
    ["npm scope",                    "@buildy/core",                 "ts"  ],
    ["npm scope",                    "@editory/utils",               "ts"  ],
  ])("exits 1 for %s '%s' in tracked .%s", (_type, content, ext) => {
    track(repo, `file.${ext}`, content);
    expect(runScrub(repo).code).toBe(1);
  });

  it("matches pattern embedded inside a larger string (substring match)", () => {
    track(repo, "file.ts", `import { Button } from "ui8kit/components";`);
    expect(runScrub(repo).code).toBe(1);
  });

  it("matches case-insensitively across all patterns", () => {
    track(repo, "file.ts", "ALEXY-OS");
    expect(runScrub(repo).code).toBe(1);
  });

  it("does not match content that only superficially resembles a pattern", () => {
    track(repo, "file.ts", 'import "@myorg/ui-toolkit";');
    track(repo, "README.md", "Built with a custom kit.");
    expect(runScrub(repo).code).toBe(0);
  });
});

describe("scrub gate5 - avatar voice example detection by pattern type", () => {
  it.each([
    ["single-word example",  "PixiJS",              "Uses PixiJS viewport."               ],
    ["single-word example",  "RxDB",                "RxDB integration layer."             ],
    ["single-word example",  "Wireflow",            "Wireflow tool for screens."          ],
    ["multi-word example",   "kien game",           "kien game screen layouts."           ],
    ["multi-word example",   "generic graph agent", "Chat UI for a generic graph agent." ],
  ])("exits 1 for %s '%s' in tracked file", (_type, _label, content) => {
    track(repo, "README.md", content);
    expect(runScrub(repo).code).toBe(1);
  });

  it("matches case-insensitively (lower-cased variant)", () => {
    track(repo, "README.md", "pixijs rendering approach.");
    expect(runScrub(repo).code).toBe(1);
  });

  it("does not match text that merely describes similar topics without literal examples", () => {
    track(repo, "README.md", "A canvas-based renderer. Offline-capable with IndexedDB. Flowchart tooling.");
    expect(runScrub(repo).code).toBe(0);
  });
});

describe("scrub - git-tracked scope: only committed index is scanned", () => {
  it("does not flag forbidden content in an untracked file", () => {
    untrack(repo, "file.ts", "ui8kit");
    expect(runScrub(repo).code).toBe(0);
  });

  it("does not flag forbidden content in a gitignored file", () => {
    gitignore(repo, "secret.ts", "ui8kit");
    expect(runScrub(repo).code).toBe(0);
  });

  it("does not scan file extensions outside the indexed set", () => {
    track(repo, "script.sh",  "ui8kit in shell");
    track(repo, "Makefile",   "ui8kit in makefile");
    track(repo, ".gitignore", "# ui8kit output\n");
    expect(runScrub(repo).code).toBe(0);
  });

  it.each(["ts", "tsx", "md", "json", "yml", "toml"])(
    "scans .%s files - all indexed extensions are covered",
    (ext) => {
      track(repo, `file.${ext}`, "ui8kit");
      expect(runScrub(repo).code).toBe(1);
    }
  );
});

describe("scrub - gate independence: both gates evaluate regardless of which fires", () => {
  it("detects gate5 failure when gate4 is clean", () => {
    track(repo, "README.md", "PixiJS viewport.");
    const { code, output } = runScrub(repo);
    expect(code).toBe(1);
    expect(output).toContain("gate5");
    expect(output).not.toContain("gate4");
  });

  it("detects gate4 failure when gate5 is clean", () => {
    track(repo, "file.ts", "ui8kit");
    const { code, output } = runScrub(repo);
    expect(code).toBe(1);
    expect(output).toContain("gate4");
    expect(output).not.toContain("gate5");
  });

  it("reports both gate failures and exits 1 when both are violated", () => {
    track(repo, "file.ts", "ui8kit");
    track(repo, "README.md", "PixiJS viewport.");
    const { code, output } = runScrub(repo);
    expect(code).toBe(1);
    expect(output).toContain("gate4");
    expect(output).toContain("gate5");
  });
});
