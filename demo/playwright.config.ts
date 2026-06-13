// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173";

export default defineConfig({
  testDir: "./tests/runtime-probe",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["./tests/runtime-probe/verdict-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "bun run preview",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        stdout: "ignore",
        stderr: "pipe",
      },
});
