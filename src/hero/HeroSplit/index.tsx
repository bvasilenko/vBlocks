// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { HeroSplitContentSchema, type HeroSplitContent } from "./schema";

export function HeroSplit({ content, theme }: BlockProps<HeroSplitContent>) {
  HeroSplitContentSchema.parse(content);
  const { eyebrow, heading, description, primaryCta, secondaryCta, image } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={12} align="center" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={6}>
          {eyebrow && (
            <DBox as="p" color="accent" className={cn("text-sm font-semibold uppercase tracking-widest")}>
              {eyebrow}
            </DBox>
          )}
          <DBox as="h1" className={cn("text-5xl font-bold tracking-tight leading-tight")}>
            {heading}
          </DBox>
          <DBox as="p" color="muted" className={cn("text-lg")}>
            {description}
          </DBox>
          <DInline wrap gap={3}>
            <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
            {secondaryCta && (
              <Button as="a" href={secondaryCta.href} variant="outline">
                {secondaryCta.label}
              </Button>
            )}
          </DInline>
        </DStack>
        <DBox
          as="img"
          src={image.src}
          alt={image.alt}
          className={cn("w-full rounded-lg object-cover aspect-video")}
        />
      </DGrid>
    </DBox>
  );
}
