// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema, DensitySchema, TonePillSchema } from "../../shared/schemas";

const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: AvatarSchema,
  bio: z.string().optional(),
}).strict();

export const TeamSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string().optional(),
  members: z.array(TeamMemberSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type TeamSplitContent = z.infer<typeof TeamSplitContentSchema>;
