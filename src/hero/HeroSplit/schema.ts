// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema, ImageSchema } from "../../shared/schemas";

export const HeroSplitContentSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string(),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema.optional(),
  image: ImageSchema,
}).strict();

export type HeroSplitContent = z.infer<typeof HeroSplitContentSchema>;
