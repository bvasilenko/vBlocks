// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { ImageSchema } from "../../shared/schemas";

const PortfolioItemSchema = z.object({
  title: z.string(),
  category: z.string(),
  image: ImageSchema,
}).strict();

export const PortfolioGridContentSchema = z.object({
  items: z.array(PortfolioItemSchema).min(1),
}).strict();

export type PortfolioGridContent = z.infer<typeof PortfolioGridContentSchema>;
