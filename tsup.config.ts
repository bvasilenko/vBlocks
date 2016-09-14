// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { defineConfig } from "tsup";

const CATEGORIES = [
  "hero", "cta", "faq", "footer", "gallery",
  "portfolio", "post", "team", "testimonial",
  "blog", "business", "features",
] as const;

const categoryEntries = Object.fromEntries(
  CATEGORIES.map((cat) => [`${cat}/index`, `src/${cat}/index.ts`])
);

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ...categoryEntries,
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
});
