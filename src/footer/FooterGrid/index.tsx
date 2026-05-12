// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Separator, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle, clampedGridCols } from "../../theme";
import { FooterGridContentSchema, type FooterGridContent } from "./schema";

export function FooterGrid({ content, theme }: BlockProps<FooterGridContent>) {
  FooterGridContentSchema.parse(content);
  const { columns, copyright } = content;
  return (
    <DBox as="footer" style={themeStyle(theme)}>
      <DGrid
        columns={clampedGridCols(columns.length)}
        px={6} py={12} gap={8}
        className={cn("max-w-6xl mx-auto")}
      >
        {columns.map((col, i) => (
          <DStack key={i} gap={4}>
            <DBox as="h3" className={cn("font-semibold text-sm uppercase tracking-widest")}>
              {col.heading}
            </DBox>
            <DBox as="ul" m={0} p={0} gap={2} display="flex" className={cn("list-none flex-col")}>
              {col.links.map((link, j) => (
                <DBox as="li" key={j}>
                  <DBox as="a" href={link.href} color="muted" className={cn("text-sm hover:underline")}>
                    {link.label}
                  </DBox>
                </DBox>
              ))}
            </DBox>
          </DStack>
        ))}
      </DGrid>
      <Separator />
      <DBox px={6} py={4} className={cn("max-w-6xl mx-auto")}>
        <DBox as="p" color="muted" className={cn("text-xs text-center")}>{copyright}</DBox>
      </DBox>
    </DBox>
  );
}
