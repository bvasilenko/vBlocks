// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Card, CardContent, CardHeader, CardTitle, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { FaqGridContentSchema, type FaqGridContent } from "./schema";

export function FaqGrid({ content, theme }: BlockProps<FaqGridContent>) {
  FaqGridContentSchema.parse(content);
  const { kicker, eyebrow, heading, items, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} className={cn("max-w-6xl mx-auto gap-10")}>
        <DStack gap={3} align="center" className={cn("text-center")}>
          {kicker && <Kicker>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>
            {heading}
          </DBox>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2} justify="center">
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
        </DStack>
        <DGrid gap={4} className={cn("grid-cols-1 sm:grid-cols-2")}>
          {items.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle as="h3" className={cn("font-serif font-medium")}>{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <DBox as="p" color="muted">
                  {item.answer}
                </DBox>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
