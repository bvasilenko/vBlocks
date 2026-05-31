// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { BlogSplitContentSchema, type BlogSplitContent } from "./schema";

export function BlogSplit({ content, theme }: BlockProps<BlogSplitContent>) {
  BlogSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, posts, tonePills, density } = content;
  const [featured, ...rest] = posts;
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
        <DGrid gap={8} align="start" className={cn("grid-cols-1 lg:grid-cols-2")}>
          {featured && (
            <DBox as="article">
              <DStack gap={4}>
                <DBox
                  as="img"
                  src={featured.image.src}
                  alt={featured.image.alt}
                  className={cn("w-full rounded-lg object-cover aspect-video")}
                />
                <DStack gap={2}>
                  {featured.category && <Badge variant="secondary" className={cn("self-start")}>{featured.category}</Badge>}
                  <DBox as="h3" className={cn("text-lg font-serif font-medium")}>{featured.title}</DBox>
                  <DBox as="p" color="muted">{featured.excerpt}</DBox>
                  <DBox as="time" dateTime={featured.date} color="muted" className={cn("text-xs")}>{featured.date}</DBox>
                </DStack>
              </DStack>
            </DBox>
          )}
          <DBox as="ul" m={0} p={0} gap={6} display="flex" className={cn("list-none flex-col")}>
            {rest.map((post, i) => (
              <DBox as="li" key={i}>
                <DBox as="article">
                  <DGrid columns={2} gap={4} align="start">
                    <DBox
                      as="img"
                      src={post.image.src}
                      alt={post.image.alt}
                      className={cn("w-full rounded-md object-cover aspect-video")}
                    />
                    <DStack gap={1}>
                      {post.category && <Badge variant="secondary" className={cn("self-start")}>{post.category}</Badge>}
                      <DBox as="h3" className={cn("text-lg font-serif font-medium leading-snug")}>{post.title}</DBox>
                      <DBox as="time" dateTime={post.date} color="muted" className={cn("text-xs")}>{post.date}</DBox>
                    </DStack>
                  </DGrid>
                </DBox>
              </DBox>
            ))}
          </DBox>
        </DGrid>
      </DStack>
    </DBox>
  );
}
