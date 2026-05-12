// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Card, CardContent, CardHeader, CardTitle, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FeaturesGridContentSchema, type FeaturesGridContent } from "./schema";

export function FeaturesGrid({ content, theme }: BlockProps<FeaturesGridContent>) {
  FeaturesGridContentSchema.parse(content);
  const { heading, features } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-5xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</Box>
        <Grid columns={3} className={cn("gap-6")}>
          {features.map((feature, i) => (
            <Card key={i}>
              <CardHeader>
                <Stack className={cn("gap-2")}>
                  {feature.icon && (
                    <Box as="span" className={cn("text-xl")} aria-hidden="true">{feature.icon}</Box>
                  )}
                  <CardTitle as="h3">{feature.title}</CardTitle>
                </Stack>
              </CardHeader>
              <CardContent>
                <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{feature.description}</Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
