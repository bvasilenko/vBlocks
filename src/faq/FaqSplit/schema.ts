import { z } from "zod";

const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
}).strict();

export const FaqSplitContentSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  items: z.array(FaqItemSchema).min(1),
}).strict();

export type FaqSplitContent = z.infer<typeof FaqSplitContentSchema>;
