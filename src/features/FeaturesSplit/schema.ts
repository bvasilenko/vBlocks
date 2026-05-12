// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";

const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
}).strict();

export const FeaturesSplitContentSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  features: z.array(FeatureItemSchema).min(1),
}).strict();

export type FeaturesSplitContent = z.infer<typeof FeaturesSplitContentSchema>;
