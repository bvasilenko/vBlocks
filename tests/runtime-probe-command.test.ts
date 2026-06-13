// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import playwrightConfig from "../demo/playwright.config";

type PackageJson = {
  scripts?: Record<string, string>;
};

type RuntimeProbeConfig = {
  reporter?: unknown;
  use?: { baseURL?: string };
  webServer?: { command?: string; url?: string };
};

type OrderedCommand = {
  name: string;
  command: string;
};

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"] as const;

function readPackageJson(path: string): PackageJson {
  return JSON.parse(readFileSync(path, "utf8")) as PackageJson;
}

function requiredScript(pkg: PackageJson, name: string): string {
  const script = pkg.scripts?.[name];
  if (typeof script !== "string" || script.trim() === "") {
    throw new Error(`${name} script is missing`);
  }
  return script;
}

function splitCommand(script: string): string[] {
  return script.trim().split(/\s+/);
}

function orderedCommandIndexes(script: string, commands: OrderedCommand[]): number[] {
  return commands.map(({ command }) => script.indexOf(command));
}

function portOf(url: string): string {
  return new URL(url).port;
}

function explicitImportPath(entryPath: string, importedName: string): string {
  const entry = readFileSync(entryPath, "utf8");
  const importPattern = new RegExp(`from ['"](\\./${importedName}\\.[^'"]+)['"]`);
  const match = importPattern.exec(entry);
  if (!match) throw new Error(`${entryPath} must explicitly import ${importedName} with a file extension`);
  return join(dirname(entryPath), match[1]);
}

function siblingSourcePaths(sourcePath: string): string[] {
  const stem = sourcePath.replace(/\.[^.]+$/, "");
  return SOURCE_EXTENSIONS.map((extension) => `${stem}${extension}`).filter(existsSync);
}

function vitestConfigText(): string {
  return readFileSync("vitest.config.ts", "utf8");
}

describe("runtime probe command contract", () => {
  const rootPackage = readPackageJson("package.json");
  const demoPackage = readPackageJson("demo/package.json");
  const config = playwrightConfig as RuntimeProbeConfig;
  const rootRuntimeScript = requiredScript(rootPackage, "test:runtime");
  const demoRuntimeScript = requiredScript(demoPackage, "test:runtime");
  const demoPreviewScript = requiredScript(demoPackage, "preview");
  const webServerCommand = config.webServer?.command ?? "";
  const webServerUrl = config.webServer?.url ?? "";
  const baseUrl = config.use?.baseURL ?? "";

  it("orders dist production before browser probes", () => {
    const steps: OrderedCommand[] = [
      { name: "dist build", command: "cd demo && bun run build" },
      { name: "browser probes", command: "playwright test -c demo/playwright.config.ts" },
    ];
    const indexes = orderedCommandIndexes(rootRuntimeScript, steps);
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
    for (const [index, step] of indexes.map((value, i) => [value, steps[i]] as const)) {
      expect(index, step.name).toBeGreaterThanOrEqual(0);
    }
  });

  it("demo runtime command delegates to the canonical root script instead of launching a second Playwright context", () => {
    expect(demoRuntimeScript).toBe("cd .. && bun run test:runtime");
    expect(demoRuntimeScript).not.toMatch(/\bplaywright\b/);
  });

  it("Playwright webServer starts the same demo preview script exposed to contributors", () => {
    expect(webServerCommand).toBe("bun run preview");
    expect(demoPreviewScript).toMatch(/^vite\s+preview\b/);
  });

  it("preview, webServer, and browser base URL share one port", () => {
    const previewTokens = splitCommand(demoPreviewScript);
    const portFlagIndex = previewTokens.indexOf("--port");
    expect(portFlagIndex).toBeGreaterThanOrEqual(0);
    const previewPort = previewTokens[portFlagIndex + 1];
    expect(previewPort).toBeTruthy();
    expect(portOf(webServerUrl)).toBe(previewPort);
    expect(portOf(baseUrl)).toBe(previewPort);
  });

  it("emits the hardened CLEAN verdict line from a dedicated reporter", () => {
    expect(config.reporter).toEqual([
      ["list"],
      ["./tests/runtime-probe/verdict-reporter.ts"],
    ]);
  });

  it("preview binds a non-loopback host so local and containerized probes use the same command", () => {
    const previewTokens = splitCommand(demoPreviewScript);
    const hostFlagIndex = previewTokens.indexOf("--host");
    expect(hostFlagIndex).toBeGreaterThanOrEqual(0);
    expect(previewTokens[hostFlagIndex + 1]).toBe("0.0.0.0");
  });
});

describe("demo source resolution contract", () => {
  it("keeps entrypoint imports explicit and free of same-stem shadow sources", () => {
    const appSource = explicitImportPath("demo/src/main.jsx", "App");
    expect(appSource).toBe("demo/src/App.tsx");
    expect(siblingSourcePaths(appSource)).toEqual([appSource]);
  });

  it("does not override Vitest extension priority to hide source ambiguity", () => {
    expect(vitestConfigText()).not.toMatch(/extensions\s*:/);
  });
});
