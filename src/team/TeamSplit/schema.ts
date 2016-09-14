import { z } from "zod";
import { AvatarSchema } from "../../shared/schemas";

const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: AvatarSchema,
  bio: z.string().optional(),
}).strict();

export const TeamSplitContentSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  members: z.array(TeamMemberSchema).min(1),
}).strict();

export type TeamSplitContent = z.infer<typeof TeamSplitContentSchema>;
