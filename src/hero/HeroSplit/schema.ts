// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema, DensitySchema, ImageSchema, TonePillSchema } from "../../shared/schemas";

export const HeroSplitImageSchema = ImageSchema.extend({
  fallbackSrc: z.string().optional(),
}).strict();

export const HeroSplitPresentationSchema = z.object({
  spacing: z.enum(["symmetric", "cta-anchored"]).optional(),
  imageFit: z.enum(["cover", "scale-down"]).optional(),
}).strict();

export const HeroSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string(),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema.optional(),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
  image: HeroSplitImageSchema,
  presentation: HeroSplitPresentationSchema.optional(),
}).strict();

export type HeroSplitContent = z.infer<typeof HeroSplitContentSchema>;
export type HeroSplitImage = z.infer<typeof HeroSplitImageSchema>;
export type HeroSplitPresentation = z.infer<typeof HeroSplitPresentationSchema>;
