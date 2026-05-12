// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Card, CardContent, CardHeader, CardTitle, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BusinessGridContentSchema, type BusinessGridContent } from "./schema";

export function BusinessGrid({ content, theme }: BlockProps<BusinessGridContent>) {
  BusinessGridContentSchema.parse(content);
  const { heading, services } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-5xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</Box>
        <Grid columns={2} className={cn("gap-6")}>
          {services.map((service, i) => (
            <Card key={i}>
              <CardHeader>
                <Stack className={cn("gap-2")}>
                  {service.icon && (
                    <Box as="span" className={cn("text-2xl")} aria-hidden="true">{service.icon}</Box>
                  )}
                  <CardTitle as="h3">{service.title}</CardTitle>
                </Stack>
              </CardHeader>
              <CardContent>
                <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{service.description}</Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
