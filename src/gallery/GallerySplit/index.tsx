// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { GallerySplitContentSchema, type GallerySplitContent } from "./schema";

export function GallerySplit({ content, theme }: BlockProps<GallerySplitContent>) {
  GallerySplitContentSchema.parse(content);
  const { heading, description, items } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-12 items-start")}>
        <Stack className={cn("gap-4 sticky top-16")}>
          <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</Box>
          {description && (
            <Box as="p" className={cn("text-[var(--v-color-muted)]")}>{description}</Box>
          )}
        </Stack>
        <Box as="ul" className={cn("list-none m-0 p-0 grid grid-cols-2 gap-4")}>
          {items.map((item, i) => (
            <Box as="li" key={i}>
              <Box as="figure" className={cn("m-0")}>
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
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
