// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@booga/vblocks": resolve(__dirname, "src"),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, "demo/tests/runtime-probe/**"],
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    server: {
      deps: {
        inline: ["@booga/vbrand"],
      },
    },
    coverage: {
      provider: "istanbul",
      include: ["src/**"],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      },
    },
  },
});
