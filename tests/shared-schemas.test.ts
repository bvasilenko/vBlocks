// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect } from "vitest";
import { CtaSchema, ImageSchema, AvatarSchema } from "../src/shared/schemas";

const validCta = { label: "Get started", href: "/start" };
const validImage = { src: "/hero.jpg", alt: "Hero image" };

describe("CtaSchema — call-to-action link contract", () => {
  it("accepts a valid cta object", () => {
    expect(CtaSchema.safeParse(validCta).success).toBe(true);
  });

  it("round-trips: parse(valid) returns structurally equal value", () => {
    expect(CtaSchema.parse(validCta)).toEqual(validCta);
  });

  it("rejects when label is absent", () => {
    const { label: _l, ...rest } = validCta;
    expect(CtaSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects when href is absent", () => {
    const { href: _h, ...rest } = validCta;
    expect(CtaSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a non-string label", () => {
    expect(CtaSchema.safeParse({ ...validCta, label: 42 }).success).toBe(false);
  });

  it("rejects a non-string href", () => {
    expect(CtaSchema.safeParse({ ...validCta, href: true }).success).toBe(false);
  });

  it("rejects null label", () => {
    expect(CtaSchema.safeParse({ ...validCta, label: null }).success).toBe(false);
  });

  it("rejects null href", () => {
    expect(CtaSchema.safeParse({ ...validCta, href: null }).success).toBe(false);
  });

  it("rejects an extra top-level property", () => {
    expect(CtaSchema.safeParse({ ...validCta, target: "_blank" }).success).toBe(false);
  });

  it("rejects an empty object", () => {
    expect(CtaSchema.safeParse({}).success).toBe(false);
  });

  it("rejects a non-object value", () => {
    expect(CtaSchema.safeParse("not-an-object").success).toBe(false);
  });

  it("rejects null", () => {
    expect(CtaSchema.safeParse(null).success).toBe(false);
  });
});

describe("ImageSchema — image src/alt contract", () => {
  it("accepts a valid image object", () => {
    expect(ImageSchema.safeParse(validImage).success).toBe(true);
  });

  it("round-trips: parse(valid) returns structurally equal value", () => {
    expect(ImageSchema.parse(validImage)).toEqual(validImage);
  });

  it("rejects when src is absent", () => {
    const { src: _s, ...rest } = validImage;
    expect(ImageSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects when alt is absent", () => {
    const { alt: _a, ...rest } = validImage;
    expect(ImageSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a non-string src", () => {
    expect(ImageSchema.safeParse({ ...validImage, src: 0 }).success).toBe(false);
  });

  it("rejects a non-string alt", () => {
    expect(ImageSchema.safeParse({ ...validImage, alt: [] }).success).toBe(false);
  });

  it("rejects null src", () => {
    expect(ImageSchema.safeParse({ ...validImage, src: null }).success).toBe(false);
  });

  it("rejects null alt", () => {
    expect(ImageSchema.safeParse({ ...validImage, alt: null }).success).toBe(false);
  });

  it("rejects an extra top-level property", () => {
    expect(ImageSchema.safeParse({ ...validImage, width: 800 }).success).toBe(false);
  });

  it("rejects an empty object", () => {
    expect(ImageSchema.safeParse({}).success).toBe(false);
  });

  it("rejects a non-object value", () => {
    expect(ImageSchema.safeParse(42).success).toBe(false);
  });

  it("rejects null", () => {
    expect(ImageSchema.safeParse(null).success).toBe(false);
  });
});

describe("AvatarSchema — enforces the ImageSchema contract through reference identity", () => {
  it("AvatarSchema === ImageSchema (single source of truth)", () => {
    expect(AvatarSchema).toBe(ImageSchema);
  });

  it("accepts the same valid image object", () => {
    expect(AvatarSchema.safeParse(validImage).success).toBe(true);
  });

  it("rejects extra properties, same as ImageSchema", () => {
    expect(AvatarSchema.safeParse({ ...validImage, caption: "x" }).success).toBe(false);
  });
});
