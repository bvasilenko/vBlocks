// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema } from "../../shared/schemas";

const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: AvatarSchema,
}).strict();

export const TeamGridContentSchema = z.object({
  heading: z.string(),
  members: z.array(TeamMemberSchema).min(1),
}).strict();

export type TeamGridContent = z.infer<typeof TeamGridContentSchema>;
