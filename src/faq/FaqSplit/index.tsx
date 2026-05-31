// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { FaqSplitContentSchema, type FaqSplitContent } from "./schema";

export function FaqSplit({ content, theme }: BlockProps<FaqSplitContent>) {
  FaqSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, items, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={16} align="start" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>
            {heading}
          </DBox>
          {description && <Lead>{description}</Lead>}
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
        </DStack>
        <DBox as="ul" m={0} p={0} gap={3} display="flex" className={cn("list-none flex-col")}>
          {items.map((item, i) => (
            <DBox as="li" key={i}>
              <DBox as="details" p={4} className={cn("border rounded-lg")}>
                <DBox as="summary" className={cn("font-semibold cursor-pointer list-none")}>
                  {item.question}
                </DBox>
                <DBox as="p" color="muted" mt={3}>
                  {item.answer}
                </DBox>
              </DBox>
            </DBox>
          ))}
        </DBox>
      </DGrid>
    </DBox>
  );
}
