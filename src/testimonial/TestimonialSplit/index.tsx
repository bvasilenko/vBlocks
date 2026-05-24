// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TestimonialSplitContentSchema, type TestimonialSplitContent } from "./schema";

export function TestimonialSplit({ content, theme }: BlockProps<TestimonialSplitContent>) {
  TestimonialSplitContentSchema.parse(content);
  const { quote, author, role, company, avatar } = content;
  return (
    <DBox as="section" aria-label="Testimonial" style={themeStyle(theme)}>
      <DGrid px={6} gap={16} align="center" className={cn("max-w-6xl mx-auto py-20 grid-cols-1 lg:grid-cols-2")}>
        <DBox
          as="blockquote"
          className={cn("text-2xl font-medium leading-relaxed")}
          cite={undefined}
        >
          <DBox as="p">{quote}</DBox>
        </DBox>
        <DStack gap={4}>
          {avatar && (
            <Avatar className={cn("w-20 h-20")}>
              <AvatarImage src={avatar.src} alt={avatar.alt} />
              <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <DInline gap={0} color="muted" className={cn("text-sm")}>
            <DBox as="cite" color="fg" className={cn("font-semibold not-italic")}>{author}</DBox>
            <DBox as="span">{`, ${company ? `${role} at ${company}` : role}`}</DBox>
          </DInline>
        </DStack>
      </DGrid>
    </DBox>
  );
}
