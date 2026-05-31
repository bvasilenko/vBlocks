// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { GalleryGridContentSchema, type GalleryGridContent } from "./schema";

export function GalleryGrid({ content, theme }: BlockProps<GalleryGridContent>) {
  GalleryGridContentSchema.parse(content);
  const { kicker, eyebrow, items, tonePills, density } = content;
  return (
    <DBox as="section" aria-label="Gallery" style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} gap={6} className={cn("max-w-6xl mx-auto")}>
        {(kicker || eyebrow || (tonePills && tonePills.length > 0)) && (
          <DStack gap={3}>
            {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
            {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
            {tonePills && tonePills.length > 0 && (
              <DInline wrap gap={2}>
                {tonePills.map((pill, i) => (
                  <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
                ))}
              </DInline>
            )}
          </DStack>
        )}
        <DGrid gap={4} className={cn("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {items.map((item, i) => (
            <DBox as="figure" key={i} m={0}>
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
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
