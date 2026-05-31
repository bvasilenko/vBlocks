// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema, DensitySchema, TonePillSchema } from "../../shared/schemas";

const TestimonialItemSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: AvatarSchema.optional(),
}).strict();

export const TestimonialGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  items: z.array(TestimonialItemSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type TestimonialGridContent = z.infer<typeof TestimonialGridContentSchema>;
