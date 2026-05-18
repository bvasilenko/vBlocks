// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Card, CardContent, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BlogGridContentSchema, type BlogGridContent } from "./schema";

export function BlogGrid({ content, theme }: BlockProps<BlogGridContent>) {
  BlogGridContentSchema.parse(content);
  const { heading, posts } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={16} className={cn("max-w-6xl mx-auto gap-10")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</DBox>
        <DGrid columns={3} gap={6}>
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
                    <DBox as="h3" className={cn("text-lg font-semibold leading-snug")}>{post.title}</DBox>
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
