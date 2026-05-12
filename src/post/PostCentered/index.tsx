// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Separator, cn } from "@booga/vui";
import { DBox, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PostCenteredContentSchema, type PostCenteredContent } from "./schema";

export function PostCentered({ content, theme }: BlockProps<PostCenteredContent>) {
  PostCenteredContentSchema.parse(content);
  const { title, author, date, category, body } = content;
  return (
    <DBox as="article" style={themeStyle(theme)}>
      <DStack px={6} py={16} gap={6} className={cn("max-w-2xl mx-auto")}>
        {category && <Badge variant="secondary">{category}</Badge>}
        <DBox as="h1" className={cn("text-4xl font-bold tracking-tight leading-snug")}>{title}</DBox>
        <DInline gap={2} color="muted" className={cn("text-sm")}>
          <DBox as="span">{author}</DBox>
          <DBox as="span" aria-hidden="true">·</DBox>
          <DBox as="time" dateTime={date}>{date}</DBox>
        </DInline>
        <Separator />
        <DBox as="p" className={cn("text-base leading-relaxed")}>{body}</DBox>
      </DStack>
    </DBox>
  );
}
