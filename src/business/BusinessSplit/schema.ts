// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, ImageSchema, TonePillSchema } from "../../shared/schemas";

const ContactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
}).strict();

export const BusinessSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  image: ImageSchema,
  contact: ContactSchema.optional(),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type BusinessSplitContent = z.infer<typeof BusinessSplitContentSchema>;
