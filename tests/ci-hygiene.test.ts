// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, type Dirent } from "fs";
import { spawnSync } from "child_process";
import { join, relative, resolve } from "path";

const REPO_ROOT = resolve(".");
const CI_YML_PATH = resolve(".github/workflows/ci.yml");
const IGNORED_DIRS = new Set(["node_modules", ".git", "dist"]);

type WorkflowStep = {
  job: string;
  name: string;
  run?: string;
};

function readCiYmlText(): string {
  return readFileSync(CI_YML_PATH, "utf-8");
}

function workflowRunLines(): string[] {
  return readCiYmlText()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("run:"));
}

function workflowSteps(): WorkflowStep[] {
  const steps: WorkflowStep[] = [];
  let currentJob = "";
  let currentStep: WorkflowStep | null = null;

  for (const line of readCiYmlText().split("\n")) {
    const jobMatch = /^ {2}([\w-]+):$/.exec(line);
    if (jobMatch) {
      currentJob = jobMatch[1];
      currentStep = null;
      continue;
    }

    const stepMatch = /^ {6}- name:\s+(.+)$/.exec(line);
    if (stepMatch) {
      currentStep = { job: currentJob, name: stepMatch[1].trim() };
      steps.push(currentStep);
      continue;
    }

    const runMatch = /^ {8}run:\s+(.+)$/.exec(line);
    if (currentStep && runMatch) currentStep.run = runMatch[1].trim();
  }

  return steps;
}

function runCommandFor(job: string, name: string): string | undefined {
  return workflowSteps().find((step) => step.job === job && step.name === name)?.run;
}

function readGitTrackedPaths(): string[] {
  const result = spawnSync("git", ["ls-files", "--cached"], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
  });
  if (result.status !== 0 || result.error) {
    throw new Error(result.stderr?.trim() || result.error?.message || "git ls-files failed");
  }
  return result.stdout.trim().split("\n").filter(Boolean);
}

function readdirEntries(dir: string): Dirent[] {
  return readdirSync(dir, { withFileTypes: true });
}

function packageJsonDirs(root: string): string[] {
  const dirs: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirEntries(dir)) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name === "package.json") dirs.push(dir);
    }
  };
  walk(root);
  return dirs;
}

function siblingBunLockPath(lockPath: string): string {
  const slash = lockPath.lastIndexOf("/");
  return slash === -1 ? "bun.lock" : `${lockPath.slice(0, slash)}/bun.lock`;
}

describe("ci-hygiene - workflow uses bun installs and only npm publishes", () => {
  it("keeps install and build commands on bun inside gh-pages-deploy", () => {
    expect(runCommandFor("gh-pages-deploy", "install-demo")).toBe("bun install --frozen-lockfile");
    expect(runCommandFor("gh-pages-deploy", "build-demo")).toBe("bun run build");
  });

  it("requires frozen lockfile on every bun install command", () => {
    const bunInstalls = workflowRunLines().filter((line) => /\bbun\s+install\b/.test(line));
    expect(bunInstalls.length).toBeGreaterThan(0);
    expect(bunInstalls.filter((line) => !line.includes("--frozen-lockfile"))).toEqual([]);
  });

  it("keeps npm limited to the publish command", () => {
    const npmRuns = workflowRunLines().filter((line) => /\bnpm\s+/.test(line));
    expect(npmRuns).toEqual(["run: npm publish --access=public"]);
  });
});

describe("ci-hygiene - committed lockfiles match package roots", () => {
  it("tracks a non-empty bun.lock beside every package.json", () => {
    const trackedPaths = readGitTrackedPaths();
    for (const dir of packageJsonDirs(REPO_ROOT)) {
      const relativeDir = relative(REPO_ROOT, dir) || ".";
      const lockPath = relativeDir === "." ? "bun.lock" : `${relativeDir}/bun.lock`;
      expect(trackedPaths).toContain(lockPath);
      expect(existsSync(join(dir, "bun.lock"))).toBe(true);
      expect(readFileSync(join(dir, "bun.lock")).length).toBeGreaterThan(0);
    }
  });

  it("does not track package-lock.json beside a bun.lock", () => {
    const trackedPaths = readGitTrackedPaths();
    const tracked = new Set(trackedPaths);
    expect(
      trackedPaths
        .filter((path) => path.endsWith("package-lock.json"))
        .filter((path) => tracked.has(siblingBunLockPath(path)))
    ).toEqual([]);
  });
});
