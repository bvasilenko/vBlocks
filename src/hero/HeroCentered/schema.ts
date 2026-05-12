// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema } from "../../shared/schemas";

export const HeroCenteredContentSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string(),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema.optional(),
}).strict();

export type HeroCenteredContent = z.infer<typeof HeroCenteredContentSchema>;
