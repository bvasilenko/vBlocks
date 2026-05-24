// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BusinessSplitContentSchema, type BusinessSplitContent } from "./schema";

export function BusinessSplit({ content, theme }: BlockProps<BusinessSplitContent>) {
  BusinessSplitContentSchema.parse(content);
  const { name, tagline, description, image, contact } = content;
  return (
    <DBox as="section" aria-label={name} style={themeStyle(theme)}>
      <DGrid px={6} py={16} gap={16} align="center" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={6}>
          <DStack gap={2}>
            <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>{name}</DBox>
            <DBox as="p" color="accent" className={cn("text-xl")}>{tagline}</DBox>
          </DStack>
          <DBox as="p" color="muted" className={cn("text-lg leading-relaxed")}>{description}</DBox>
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
