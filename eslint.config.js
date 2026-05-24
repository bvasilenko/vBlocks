// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  // demo/ is a standalone host app with its own toolchain — not part of the
  // package lint surface.
  { ignores: ["dist/**", "coverage/**", "demo/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["*.config.*", "tests/**"],
    languageOptions: {
      globals: { ...globals.node },
    },
  }
);
