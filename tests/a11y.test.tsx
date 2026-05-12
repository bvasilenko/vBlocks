// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { registry } from "../src/registry";

describe("a11y — axe-core smoke per block", () => {
  for (const [id, meta] of Object.entries(registry)) {
    it(`${id}: no axe violations`, async () => {
      const { container } = render(
        createElement(meta.component, { content: meta.default })
      );
      const results = await axe.run(container);
      expect(
        results.violations.map((v) => `${v.id}: ${v.description}`),
        `${id} axe violations`
      ).toEqual([]);
    });
  }
});
