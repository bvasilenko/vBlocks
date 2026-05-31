// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Kicker, Separator, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { FooterSplitContentSchema, type FooterSplitContent } from "./schema";

export function FooterSplit({ content, theme }: BlockProps<FooterSplitContent>) {
  FooterSplitContentSchema.parse(content);
  const { kicker, brand, links, copyright, density } = content;
  return (
    <DBox as="footer" style={themeStyle(theme)}>
      <DGrid px={6} py={densityPy(density)} gap={8} align="start" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={2}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          <DBox as="p" className={cn("font-serif font-medium text-lg")}>{brand.name}</DBox>
          {brand.tagline && (
            <DBox as="p" color="muted" className={cn("text-sm")}>{brand.tagline}</DBox>
          )}
        </DStack>
        <DBox as="nav" aria-label="Footer navigation">
          <DBox as="ul" m={0} p={0} gap={6} display="flex" className={cn("list-none flex-wrap")}>
            {links.map((link, i) => (
              <DBox as="li" key={i}>
                <DBox as="a" href={link.href} className={cn("text-sm hover:underline")}>
                  {link.label}
                </DBox>
              </DBox>
            ))}
          </DBox>
        </DBox>
      </DGrid>
      <Separator />
      <DBox px={6} py={4} className={cn("max-w-6xl mx-auto")}>
        <DBox as="p" color="muted" className={cn("text-xs text-center")}>{copyright}</DBox>
      </DBox>
    </DBox>
  );
}
