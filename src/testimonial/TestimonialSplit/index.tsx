// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { TestimonialSplitContentSchema, type TestimonialSplitContent } from "./schema";

export function TestimonialSplit({ content, theme }: BlockProps<TestimonialSplitContent>) {
  TestimonialSplitContentSchema.parse(content);
  const { kicker, eyebrow, quote, author, role, company, avatar, tonePills, density } = content;
  return (
    <DBox as="section" aria-label="Testimonial" style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={16} align="center" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={4}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox
            as="blockquote"
            className={cn("font-serif font-medium leading-relaxed text-[clamp(1.4rem,2.4vw,1.75rem)]")}
            cite={undefined}
          >
            <DBox as="p">{quote}</DBox>
          </DBox>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
        </DStack>
        <DStack gap={4}>
          {avatar && (
            <Avatar className={cn("w-20 h-20")}>
              <AvatarImage src={avatar.src} alt={avatar.alt} />
              <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <DInline gap={0} color="muted" className={cn("text-sm")}>
            <DBox as="cite" color="fg" className={cn("font-semibold not-italic")}>{author}</DBox>
            <DBox as="span">{`, ${company ? `${role} at ${company}` : role}`}</DBox>
          </DInline>
        </DStack>
      </DGrid>
    </DBox>
  );
}
