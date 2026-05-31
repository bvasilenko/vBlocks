// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { CtaSplitContentSchema, type CtaSplitContent } from "./schema";

export function CtaSplit({ content, theme }: BlockProps<CtaSplitContent>) {
  CtaSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, primaryCta, tonePills, density, image } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={12} align="center" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={6}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>
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
          <Button as="a" href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
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
