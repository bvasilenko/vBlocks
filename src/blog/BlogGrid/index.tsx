// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Card, CardContent, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { BlogGridContentSchema, type BlogGridContent } from "./schema";

export function BlogGrid({ content, theme }: BlockProps<BlogGridContent>) {
  BlogGridContentSchema.parse(content);
  const { kicker, eyebrow, heading, posts, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} className={cn("max-w-6xl mx-auto gap-10")}>
        <DStack gap={3}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>{heading}</DBox>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
        </DStack>
        <DGrid gap={6} className={cn("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {posts.map((post, i) => (
            <Card key={i}>
              <DBox as="article">
                <DBox
                  as="img"
                  src={post.image.src}
                  alt={post.image.alt}
                  className={cn("w-full rounded-t-lg object-cover aspect-video")}
                />
                <CardContent>
                  <DStack gap={2} pt={2}>
                    {post.category && <Badge variant="secondary" className={cn("self-start")}>{post.category}</Badge>}
                    <DBox as="h3" className={cn("text-lg font-serif font-medium leading-snug")}>{post.title}</DBox>
                    <DBox as="p" color="muted" className={cn("text-sm")}>{post.excerpt}</DBox>
                    <DBox as="time" dateTime={post.date} color="muted" className={cn("text-xs")}>{post.date}</DBox>
                  </DStack>
                </CardContent>
              </DBox>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
