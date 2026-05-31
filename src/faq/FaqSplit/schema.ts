// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, TonePillSchema } from "../../shared/schemas";

const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
}).strict();

export const FaqSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string().optional(),
  items: z.array(FaqItemSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type FaqSplitContent = z.infer<typeof FaqSplitContentSchema>;
