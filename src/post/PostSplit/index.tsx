// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Separator, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PostSplitContentSchema, type PostSplitContent } from "./schema";

export function PostSplit({ content, theme }: BlockProps<PostSplitContent>) {
  PostSplitContentSchema.parse(content);
  const { title, author, date, category, body, image } = content;
  return (
    <DBox as="article" style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={16} align="start" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={6} className={cn("sticky top-16")}>
          {category && <Badge variant="secondary" className={cn("self-start")}>{category}</Badge>}
          <DBox as="h1" className={cn("text-3xl font-bold tracking-tight leading-snug")}>{title}</DBox>
          <Separator />
          <DInline gap={2} color="muted" className={cn("text-sm")}>
            <DBox as="span">{author}</DBox>
            <DBox as="span" aria-hidden="true">·</DBox>
            <DBox as="time" dateTime={date}>{date}</DBox>
          </DInline>
        </DStack>
        <DStack gap={6}>
          <DBox
            as="img"
            src={image.src}
            alt={image.alt}
            className={cn("w-full rounded-lg object-cover aspect-video")}
          />
          <DBox as="p" className={cn("text-base leading-relaxed")}>{body}</DBox>
        </DStack>
      </DGrid>
    </DBox>
  );
}
