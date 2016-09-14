import { Avatar, AvatarFallback, AvatarImage, Box, Card, CardContent, Grid, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TestimonialGridContentSchema, type TestimonialGridContent } from "./schema";

export function TestimonialGrid({ content, theme }: BlockProps<TestimonialGridContent>) {
  TestimonialGridContentSchema.parse(content);
  const { heading, items } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-5xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</Box>
        <Grid columns={3} className={cn("gap-6")}>
          {items.map((item, i) => (
            <Card key={i}>
              <CardContent>
                <Stack className={cn("gap-4 pt-4")}>
                  <Box as="blockquote" className={cn("text-sm leading-relaxed")}>
                    <Box as="p">{item.quote}</Box>
                  </Box>
                  <Inline className={cn("gap-3 items-center")}>
                    {item.avatar && (
                      <Avatar>
                        <AvatarImage src={item.avatar.src} alt={item.avatar.alt} />
                        <AvatarFallback>{item.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <Stack className={cn("gap-0.5")}>
                      <Box as="cite" className={cn("text-sm font-semibold not-italic")}>{item.author}</Box>
                      <Box as="span" className={cn("text-xs text-[var(--v-color-muted)]")}>
                        {item.role}{item.company ? `, ${item.company}` : ""}
                      </Box>
                    </Stack>
                  </Inline>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
