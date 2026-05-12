// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { GallerySplitContentSchema, type GallerySplitContent } from "./schema";

export function GallerySplit({ content, theme }: BlockProps<GallerySplitContent>) {
  GallerySplitContentSchema.parse(content);
  const { heading, description, items } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={12} align="start" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</DBox>
          {description && (
            <DBox as="p" color="muted">{description}</DBox>
          )}
        </DStack>
        <DBox as="ul" m={0} p={0} gap={4} display="grid" className={cn("list-none grid-cols-2")}>
          {items.map((item, i) => (
            <DBox as="li" key={i}>
              <DBox as="figure" m={0}>
                <DBox
                  as="img"
                  src={item.src}
                  alt={item.alt}
                  className={cn("w-full rounded-lg object-cover aspect-square")}
                />
                {item.caption && (
                  <DBox as="figcaption" color="muted" mt={1} className={cn("text-xs")}>
                    {item.caption}
                  </DBox>
                )}
              </DBox>
            </DBox>
          ))}
        </DBox>
      </DGrid>
    </DBox>
  );
}
