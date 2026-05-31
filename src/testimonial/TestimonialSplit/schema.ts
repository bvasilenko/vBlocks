// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema, DensitySchema, TonePillSchema } from "../../shared/schemas";

export const TestimonialSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: AvatarSchema.optional(),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type TestimonialSplitContent = z.infer<typeof TestimonialSplitContentSchema>;
