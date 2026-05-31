// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema, DensitySchema, TonePillSchema } from "../../shared/schemas";

const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: AvatarSchema,
}).strict();

export const TeamGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  members: z.array(TeamMemberSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type TeamGridContent = z.infer<typeof TeamGridContentSchema>;
