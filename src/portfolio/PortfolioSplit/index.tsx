import { Badge, Box, Card, CardContent, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PortfolioSplitContentSchema, type PortfolioSplitContent } from "./schema";

export function PortfolioSplit({ content, theme }: BlockProps<PortfolioSplitContent>) {
  PortfolioSplitContentSchema.parse(content);
  const { heading, description, items } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-16 items-start")}>
        <Stack className={cn("gap-4 sticky top-16")}>
          <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</Box>
          {description && (
            <Box as="p" className={cn("text-[var(--v-color-muted)]")}>{description}</Box>
          )}
        </Stack>
        <Stack className={cn("gap-6")}>
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
        </Stack>
      </Grid>
    </Box>
  );
}
