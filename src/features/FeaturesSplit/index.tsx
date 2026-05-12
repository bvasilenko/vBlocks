// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Grid, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FeaturesSplitContentSchema, type FeaturesSplitContent } from "./schema";

export function FeaturesSplit({ content, theme }: BlockProps<FeaturesSplitContent>) {
  FeaturesSplitContentSchema.parse(content);
  const { heading, description, features } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-16 items-start")}>
        <Stack className={cn("gap-4 sticky top-16")}>
          <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</Box>
          {description && (
            <Box as="p" className={cn("text-lg text-[var(--v-color-muted)]")}>{description}</Box>
          )}
        </Stack>
        <Box as="ul" className={cn("list-none m-0 p-0 flex flex-col gap-8")}>
          {features.map((feature, i) => (
            <Box as="li" key={i}>
              <Inline className={cn("gap-4 items-start")}>
                {feature.icon && (
                  <Box as="span" className={cn("text-xl flex-shrink-0 mt-0.5")} aria-hidden="true">
                    {feature.icon}
                  </Box>
                )}
                <Stack className={cn("gap-1")}>
                  <Box as="h3" className={cn("font-semibold")}>{feature.title}</Box>
                  <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{feature.description}</Box>
                </Stack>
              </Inline>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
