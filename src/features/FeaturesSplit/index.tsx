// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { FeaturesSplitContentSchema, type FeaturesSplitContent } from "./schema";

export function FeaturesSplit({ content, theme }: BlockProps<FeaturesSplitContent>) {
  FeaturesSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, features, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={16} align="start" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
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
        <DBox as="ul" m={0} p={0} gap={8} display="flex" className={cn("list-none flex-col")}>
          {features.map((feature, i) => (
            <DBox as="li" key={i}>
              <DInline gap={4} align="start">
                {feature.icon && (
                  <DBox as="span" className={cn("text-xl flex-shrink-0 mt-0.5")} aria-hidden="true">
                    {feature.icon}
                  </DBox>
                )}
                <DStack gap={1}>
                  <DBox as="h3" className={cn("text-lg font-serif font-medium")}>{feature.title}</DBox>
                  <DBox as="p" color="muted" className={cn("text-sm")}>{feature.description}</DBox>
                </DStack>
              </DInline>
            </DBox>
          ))}
        </DBox>
      </DGrid>
    </DBox>
  );
}
