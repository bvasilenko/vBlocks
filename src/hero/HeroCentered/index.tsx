// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { HeroCenteredContentSchema, type HeroCenteredContent } from "./schema";

export function HeroCentered({ content, theme }: BlockProps<HeroCenteredContent>) {
  HeroCenteredContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, primaryCta, secondaryCta, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} gap={8} align="center" className={cn("max-w-3xl mx-auto text-center")}>
        {kicker && <Kicker>{kicker}</Kicker>}
        {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
        <DBox as="h1" className={cn("font-serif font-medium tracking-tight leading-tight text-[clamp(2.3rem,4.2vw,3.2rem)]")}>
          {heading}
        </DBox>
        <Lead className={cn("mx-auto")}>{description}</Lead>
        {tonePills && tonePills.length > 0 && (
          <DInline wrap gap={2} justify="center">
            {tonePills.map((pill, i) => (
              <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
            ))}
          </DInline>
        )}
        <DInline wrap gap={3} justify="center">
          <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCta && (
            <Button as="a" href={secondaryCta.href} variant="outline">
              {secondaryCta.label}
            </Button>
          )}
        </DInline>
      </DStack>
    </DBox>
  );
}
