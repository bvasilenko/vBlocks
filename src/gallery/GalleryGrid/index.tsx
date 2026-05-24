// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { cn } from "@booga/vui";
import { DBox, DGrid } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { GalleryGridContentSchema, type GalleryGridContent } from "./schema";

export function GalleryGrid({ content, theme }: BlockProps<GalleryGridContent>) {
  GalleryGridContentSchema.parse(content);
  const { items } = content;
  return (
    <DBox as="section" aria-label="Gallery" style={themeStyle(theme)}>
      <DGrid px={6} py={16} gap={4} className={cn("max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
        {items.map((item, i) => (
          <DBox as="figure" key={i} m={0}>
            <DBox
              as="img"
              src={item.src}
              alt={item.alt}
              className={cn("w-full rounded-lg object-cover aspect-square")}
            />
            {item.caption && (
              <DBox as="figcaption" color="muted" mt={1} className={cn("text-xs")}>
                {item.caption}
              </DBox>
            )}
          </DBox>
        ))}
      </DGrid>
    </DBox>
  );
}
