// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Eyebrow, Kicker, Pill, Separator, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { PostSplitContentSchema, type PostSplitContent } from "./schema";

export function PostSplit({ content, theme }: BlockProps<PostSplitContent>) {
  PostSplitContentSchema.parse(content);
  const { kicker, eyebrow, title, author, date, category, body, image, tonePills, density } = content;
  return (
    <DBox as="article" style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={16} align="start" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={6} className={cn("sticky top-16")}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          {category && <Badge variant="secondary" className={cn("self-start")}>{category}</Badge>}
          <DBox as="h1" className={cn("font-serif font-medium tracking-tight leading-snug text-[clamp(2rem,3.6vw,2.6rem)]")}>{title}</DBox>
          <Separator />
          <DInline gap={2} color="muted" className={cn("text-sm")}>
            <DBox as="span">{author}</DBox>
            <DBox as="span" aria-hidden="true">·</DBox>
            <DBox as="time" dateTime={date}>{date}</DBox>
          </DInline>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
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
