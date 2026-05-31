// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Eyebrow, Kicker, Pill, Separator, cn } from "@booga/vui";
import { DBox, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { PostCenteredContentSchema, type PostCenteredContent } from "./schema";

export function PostCentered({ content, theme }: BlockProps<PostCenteredContent>) {
  PostCenteredContentSchema.parse(content);
  const { kicker, eyebrow, title, author, date, category, body, tonePills, density } = content;
  return (
    <DBox as="article" style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} gap={6} className={cn("max-w-2xl mx-auto")}>
        {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
        {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
        {category && <Badge variant="secondary" className={cn("self-start")}>{category}</Badge>}
        <DBox as="h1" className={cn("font-serif font-medium tracking-tight leading-snug text-[clamp(2rem,3.6vw,2.6rem)]")}>{title}</DBox>
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
        <Separator />
        <DBox as="p" className={cn("text-base leading-relaxed")}>{body}</DBox>
      </DStack>
    </DBox>
  );
}
