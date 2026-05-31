// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Card, CardContent, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { PortfolioGridContentSchema, type PortfolioGridContent } from "./schema";

export function PortfolioGrid({ content, theme }: BlockProps<PortfolioGridContent>) {
  PortfolioGridContentSchema.parse(content);
  const { kicker, eyebrow, items, tonePills, density } = content;
  return (
    <DBox as="section" aria-label="Portfolio" style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} gap={8} className={cn("max-w-6xl mx-auto")}>
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
        <DGrid gap={6} className={cn("grid-cols-1 sm:grid-cols-2")}>
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
        </DGrid>
      </DStack>
    </DBox>
  );
}
