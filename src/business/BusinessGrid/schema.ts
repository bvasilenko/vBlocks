// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, TonePillSchema } from "../../shared/schemas";

const ServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
}).strict();

export const BusinessGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  services: z.array(ServiceSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type BusinessGridContent = z.infer<typeof BusinessGridContentSchema>;
