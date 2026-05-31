// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema, DensitySchema, ImageSchema, TonePillSchema } from "../../shared/schemas";

export const HeroSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string(),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema.optional(),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
  image: ImageSchema,
}).strict();

export type HeroSplitContent = z.infer<typeof HeroSplitContentSchema>;
