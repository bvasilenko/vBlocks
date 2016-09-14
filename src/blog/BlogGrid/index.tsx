import { Badge, Box, Card, CardContent, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BlogGridContentSchema, type BlogGridContent } from "./schema";

export function BlogGrid({ content, theme }: BlockProps<BlogGridContent>) {
  BlogGridContentSchema.parse(content);
  const { heading, posts } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-6xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</Box>
        <Grid columns={3} className={cn("gap-6")}>
          {posts.map((post, i) => (
            <Card key={i}>
              <Box as="article">
                <Box
                  as="img"
                  src={post.image.src}
                  alt={post.image.alt}
                  className={cn("w-full rounded-t-lg object-cover aspect-video")}
                />
                <CardContent>
                  <Stack className={cn("gap-2 pt-2")}>
                    {post.category && <Badge variant="secondary">{post.category}</Badge>}
                    <Box as="h3" className={cn("font-semibold leading-snug")}>{post.title}</Box>
                    <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{post.excerpt}</Box>
                    <Box as="time" dateTime={post.date} className={cn("text-xs text-[var(--v-color-muted)]")}>{post.date}</Box>
                  </Stack>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
