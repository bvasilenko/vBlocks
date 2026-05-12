// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Button, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { CtaSplitContentSchema, type CtaSplitContent } from "./schema";

export function CtaSplit({ content, theme }: BlockProps<CtaSplitContent>) {
  CtaSplitContentSchema.parse(content);
  const { heading, description, primaryCta, image } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-12 items-center")}>
        <Stack className={cn("gap-6")}>
          <Box as="h2" className={cn("text-4xl font-bold tracking-tight")}>
            {heading}
          </Box>
          <Box as="p" className={cn("text-lg text-[var(--v-color-muted)]")}>
            {description}
          </Box>
          <Button as="a" href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
        </Stack>
        <Box
          as="img"
          src={image.src}
          alt={image.alt}
          className={cn("w-full rounded-lg object-cover aspect-video")}
        />
      </Grid>
    </Box>
  );
}
