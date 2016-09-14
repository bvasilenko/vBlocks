import { Box, Card, CardContent, CardHeader, CardTitle, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FaqGridContentSchema, type FaqGridContent } from "./schema";

export function FaqGrid({ content, theme }: BlockProps<FaqGridContent>) {
  FaqGridContentSchema.parse(content);
  const { heading, items } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-5xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>
          {heading}
        </Box>
        <Grid columns={2} className={cn("gap-4")}>
          {items.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle as="h3">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <Box as="p" className={cn("text-[var(--v-color-muted)]")}>
                  {item.answer}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
