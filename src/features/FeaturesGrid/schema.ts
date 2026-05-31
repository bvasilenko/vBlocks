// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, TonePillSchema } from "../../shared/schemas";

const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
}).strict();

export const FeaturesGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  features: z.array(FeatureItemSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type FeaturesGridContent = z.infer<typeof FeaturesGridContentSchema>;
