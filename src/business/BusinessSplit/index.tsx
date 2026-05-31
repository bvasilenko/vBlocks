// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { BusinessSplitContentSchema, type BusinessSplitContent } from "./schema";

export function BusinessSplit({ content, theme }: BlockProps<BusinessSplitContent>) {
  BusinessSplitContentSchema.parse(content);
  const { kicker, eyebrow, name, tagline, description, image, contact, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={name} style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={16} align="center" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={6}>
          <DStack gap={2}>
            {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
            {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
            <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>{name}</DBox>
            <DBox as="p" color="accent" className={cn("text-xl font-serif")}>{tagline}</DBox>
          </DStack>
          <Lead>{description}</Lead>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
          {contact && (
            <DBox as="address" color="muted" gap={1} display="flex" className={cn("not-italic text-sm flex-col")}>
              {contact.phone && <DBox as="span">{contact.phone}</DBox>}
              {contact.email && <DBox as="span">{contact.email}</DBox>}
              {contact.address && <DBox as="span">{contact.address}</DBox>}
            </DBox>
          )}
        </DStack>
        <DBox
          as="img"
          src={image.src}
          alt={image.alt}
          className={cn("w-full rounded-lg object-cover aspect-square")}
        />
      </DGrid>
    </DBox>
  );
}
