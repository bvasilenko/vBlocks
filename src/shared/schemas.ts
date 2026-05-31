// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";

export const CtaSchema = z.object({
  label: z.string(),
  href: z.string(),
}).strict();

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
}).strict();

export const AvatarSchema = ImageSchema;

/**
 * Density token for section vertical padding. See `theme.ts` `densityPy`.
 * Optional on every section schema; consumers default to `normal` (py-24).
 */
export const DensitySchema = z.enum(["compact", "normal", "spacious"]);

/**
 * Tone token mirroring vTheme 0.3.0's semantic-tone palette
 * (ok / warn / bad / info / meta). Forwarded to vUi 0.4.0's `<Pill>` and
 * `<Eyebrow>` primitives via their `tone` prop.
 */
export const ToneSchema = z.enum(["ok", "warn", "bad", "info", "meta"]);

/**
 * Tone-pill content item. Renders through `<Pill tone={...}>`. Optional
 * `tone` falls back to the neutral pill chrome (secondary surface).
 */
export const TonePillSchema = z.object({
  label: z.string(),
  tone: ToneSchema.optional(),
}).strict();

export type Cta = z.infer<typeof CtaSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type AvatarSrc = Image;
export type DensityValue = z.infer<typeof DensitySchema>;
export type ToneValue = z.infer<typeof ToneSchema>;
export type TonePillItem = z.infer<typeof TonePillSchema>;
