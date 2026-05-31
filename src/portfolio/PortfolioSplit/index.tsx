// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Card, CardContent, Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { PortfolioSplitContentSchema, type PortfolioSplitContent } from "./schema";

export function PortfolioSplit({ content, theme }: BlockProps<PortfolioSplitContent>) {
  PortfolioSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, items, tonePills, density } = content;
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
        <DStack gap={6}>
          {items.map((item, i) => (
            <Card key={i}>
              <DBox
                as="img"
                src={item.image.src}
                alt={item.image.alt}
                className={cn("w-full rounded-t-lg object-cover aspect-video")}
              />
              <CardContent>
                <DStack gap={2} pt={2}>
                  <Badge variant="secondary" className={cn("self-start")}>{item.category}</Badge>
                  <DBox as="h3" className={cn("font-serif font-medium text-lg")}>{item.title}</DBox>
                </DStack>
              </CardContent>
            </Card>
          ))}
        </DStack>
      </DGrid>
    </DBox>
  );
}
