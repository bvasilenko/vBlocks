// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { GallerySplitContentSchema, type GallerySplitContent } from "./schema";

export function GallerySplit({ content, theme }: BlockProps<GallerySplitContent>) {
  GallerySplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, items, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={12} align="start" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>{heading}</DBox>
          {description && <Lead>{description}</Lead>}
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
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
