// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { TestimonialGridContentSchema, type TestimonialGridContent } from "./schema";

export function TestimonialGrid({ content, theme }: BlockProps<TestimonialGridContent>) {
  TestimonialGridContentSchema.parse(content);
  const { kicker, eyebrow, heading, items, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} className={cn("max-w-6xl mx-auto gap-10")}>
        <DStack gap={3} align="center" className={cn("text-center")}>
          {kicker && <Kicker>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>{heading}</DBox>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2} justify="center">
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
        </DStack>
        <DGrid gap={6} className={cn("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {items.map((item, i) => (
            <Card key={i}>
              <CardContent>
                <DStack gap={4} pt={4}>
                  <DBox as="blockquote" className={cn("text-sm font-serif leading-relaxed")}>
                    <DBox as="p">{item.quote}</DBox>
                  </DBox>
                  <DInline gap={3} align="center">
                    {item.avatar && (
                      <Avatar>
                        <AvatarImage src={item.avatar.src} alt={item.avatar.alt} />
                        <AvatarFallback>{item.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <DStack className={cn("gap-0.5")}>
                      <DBox as="cite" className={cn("text-sm font-semibold not-italic")}>{item.author}</DBox>
                      <DBox as="span" color="muted" className={cn("text-xs")}>
                        {item.role}{item.company ? `, ${item.company}` : ""}
                      </DBox>
                    </DStack>
                  </DInline>
                </DStack>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
