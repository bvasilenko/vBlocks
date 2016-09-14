import { z } from "zod";

const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
}).strict();

export const FaqGridContentSchema = z.object({
  heading: z.string(),
  items: z.array(FaqItemSchema).min(1),
}).strict();

export type FaqGridContent = z.infer<typeof FaqGridContentSchema>;
