// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, ImageSchema, TonePillSchema } from "../../shared/schemas";

const PortfolioItemSchema = z.object({
  title: z.string(),
  category: z.string(),
  image: ImageSchema,
}).strict();

export const PortfolioGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  items: z.array(PortfolioItemSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type PortfolioGridContent = z.infer<typeof PortfolioGridContentSchema>;
