// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { toErrorMessage } from "../demo/src/lib/to-error-message";

const FALLBACK = "Brand load failed";

describe("toErrorMessage - Error instance", () => {
  it("returns the message property of an Error", () => {
    expect(toErrorMessage(new Error("network error"))).toBe("network error");
  });

  it("returns empty string for an Error with empty message", () => {
    expect(toErrorMessage(new Error(""))).toBe("");
  });

  it("returns the message of a TypeError subclass", () => {
    expect(toErrorMessage(new TypeError("invalid input"))).toBe("invalid input");
  });

  it("returns the message of a RangeError subclass", () => {
    expect(toErrorMessage(new RangeError("out of bounds"))).toBe("out of bounds");
  });
});

describe("toErrorMessage - string input", () => {
  it("returns a non-empty string verbatim", () => {
    expect(toErrorMessage("something went wrong")).toBe("something went wrong");
  });

  it("returns fallback for an empty string", () => {
    expect(toErrorMessage("")).toBe(FALLBACK);
  });

  it("returns a whitespace-only string verbatim (whitespace is non-empty)", () => {
    expect(toErrorMessage("   ")).toBe("   ");
  });
});

describe("toErrorMessage - non-string non-Error input falls back to fixed message", () => {
  const NON_STRING_NON_ERROR_INPUTS: unknown[] = [
    undefined,
    null,
    0,
    42,
    -1,
    true,
    false,
    { code: 404 },
    ["error"],
    Symbol("err"),
  ];

  for (const input of NON_STRING_NON_ERROR_INPUTS) {
    it(`returns fallback for input: ${String(input)}`, () => {
      expect(toErrorMessage(input)).toBe(FALLBACK);
    });
  }
});

describe("toErrorMessage - output contract", () => {
  it("always returns a string regardless of input type", () => {
    const inputs: unknown[] = [new Error("x"), "msg", "", undefined, null, 0, {}, []];
    for (const input of inputs) {
      expect(typeof toErrorMessage(input), `typeof result for ${String(input)}`).toBe("string");
    }
  });
});
