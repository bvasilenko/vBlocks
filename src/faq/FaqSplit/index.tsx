// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FaqSplitContentSchema, type FaqSplitContent } from "./schema";

export function FaqSplit({ content, theme }: BlockProps<FaqSplitContent>) {
  FaqSplitContentSchema.parse(content);
  const { heading, description, items } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-16 items-start")}>
        <Stack className={cn("gap-4 sticky top-16")}>
          <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>
            {heading}
          </Box>
          {description && (
            <Box as="p" className={cn("text-[var(--v-color-muted)]")}>
              {description}
            </Box>
          )}
        </Stack>
        <Box as="ul" className={cn("list-none m-0 p-0 flex flex-col gap-3")}>
          {items.map((item, i) => (
            <Box as="li" key={i}>
              <Box as="details" className={cn("border rounded-lg p-4")}>
                <Box as="summary" className={cn("font-semibold cursor-pointer list-none")}>
                  {item.question}
                </Box>
                <Box as="p" className={cn("mt-3 text-[var(--v-color-muted)]")}>
                  {item.answer}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
