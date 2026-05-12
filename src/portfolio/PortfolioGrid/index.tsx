// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Box, Card, CardContent, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PortfolioGridContentSchema, type PortfolioGridContent } from "./schema";

export function PortfolioGrid({ content, theme }: BlockProps<PortfolioGridContent>) {
  PortfolioGridContentSchema.parse(content);
  const { items } = content;
  return (
    <Box as="section" aria-label="Portfolio" style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-12 gap-6")}>
        {items.map((item, i) => (
          <Card key={i}>
            <Box
              as="img"
              src={item.image.src}
              alt={item.image.alt}
              className={cn("w-full rounded-t-lg object-cover aspect-video")}
            />
            <CardContent>
              <Stack className={cn("gap-2 pt-2")}>
                <Badge variant="secondary">{item.category}</Badge>
                <Box as="h3" className={cn("font-semibold text-lg")}>{item.title}</Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
