// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Grid, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { GalleryGridContentSchema, type GalleryGridContent } from "./schema";

export function GalleryGrid({ content, theme }: BlockProps<GalleryGridContent>) {
  GalleryGridContentSchema.parse(content);
  const { items } = content;
  return (
    <Box as="section" aria-label="Gallery" style={themeStyle(theme)}>
      <Grid columns={3} className={cn("max-w-6xl mx-auto px-6 py-12 gap-4")}>
        {items.map((item, i) => (
          <Box as="figure" key={i} className={cn("m-0")}>
            <Box
              as="img"
              src={item.src}
              alt={item.alt}
              className={cn("w-full rounded-lg object-cover aspect-square")}
            />
            {item.caption && (
              <Box as="figcaption" className={cn("mt-1 text-xs text-[var(--v-color-muted)]")}>
                {item.caption}
              </Box>
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
