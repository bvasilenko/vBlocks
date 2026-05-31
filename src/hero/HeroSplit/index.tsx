// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { HeroSplitContentSchema, type HeroSplitContent } from "./schema";

export function HeroSplit({ content, theme }: BlockProps<HeroSplitContent>) {
  HeroSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, primaryCta, secondaryCta, tonePills, density, image } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={12} align="center" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={6}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h1" className={cn("font-serif font-medium tracking-tight leading-tight text-[clamp(2.3rem,4.2vw,3.2rem)]")}>
            {heading}
          </DBox>
          <Lead>{description}</Lead>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
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
