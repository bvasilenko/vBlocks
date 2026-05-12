// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BusinessSplitContentSchema, type BusinessSplitContent } from "./schema";

export function BusinessSplit({ content, theme }: BlockProps<BusinessSplitContent>) {
  BusinessSplitContentSchema.parse(content);
  const { name, tagline, description, image, contact } = content;
  return (
    <Box as="section" aria-label={name} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-16 items-center")}>
        <Stack className={cn("gap-6")}>
          <Stack className={cn("gap-2")}>
            <Box as="h2" className={cn("text-4xl font-bold tracking-tight")}>{name}</Box>
            <Box as="p" className={cn("text-xl text-[var(--v-color-accent)]")}>{tagline}</Box>
          </Stack>
          <Box as="p" className={cn("text-lg text-[var(--v-color-muted)] leading-relaxed")}>{description}</Box>
          {contact && (
            <Box as="address" className={cn("not-italic text-sm text-[var(--v-color-muted)] flex flex-col gap-1")}>
              {contact.phone && <Box as="span">{contact.phone}</Box>}
              {contact.email && <Box as="span">{contact.email}</Box>}
              {contact.address && <Box as="span">{contact.address}</Box>}
            </Box>
          )}
        </Stack>
        <Box
          as="img"
          src={image.src}
          alt={image.alt}
          className={cn("w-full rounded-lg object-cover aspect-square")}
        />
      </Grid>
    </Box>
  );
}
