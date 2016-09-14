import { Badge, Box, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BlogSplitContentSchema, type BlogSplitContent } from "./schema";

export function BlogSplit({ content, theme }: BlockProps<BlogSplitContent>) {
  BlogSplitContentSchema.parse(content);
  const { heading, posts } = content;
  const [featured, ...rest] = posts;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-6xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</Box>
        <Grid columns={2} className={cn("gap-8 items-start")}>
          {featured && (
            <Box as="article">
              <Stack className={cn("gap-4")}>
                <Box
                  as="img"
                  src={featured.image.src}
                  alt={featured.image.alt}
                  className={cn("w-full rounded-lg object-cover aspect-video")}
                />
                <Stack className={cn("gap-2")}>
                  {featured.category && <Badge variant="secondary">{featured.category}</Badge>}
                  <Box as="h3" className={cn("text-xl font-semibold")}>{featured.title}</Box>
                  <Box as="p" className={cn("text-[var(--v-color-muted)]")}>{featured.excerpt}</Box>
                  <Box as="time" dateTime={featured.date} className={cn("text-xs text-[var(--v-color-muted)]")}>{featured.date}</Box>
                </Stack>
              </Stack>
            </Box>
          )}
          <Box as="ul" className={cn("list-none m-0 p-0 flex flex-col gap-6")}>
            {rest.map((post, i) => (
              <Box as="li" key={i}>
                <Box as="article">
                  <Grid columns={2} className={cn("gap-4 items-start")}>
                    <Box
                      as="img"
                      src={post.image.src}
                      alt={post.image.alt}
                      className={cn("w-full rounded-md object-cover aspect-video")}
                    />
                    <Stack className={cn("gap-1")}>
                      {post.category && <Badge variant="secondary">{post.category}</Badge>}
                      <Box as="h3" className={cn("font-semibold leading-snug")}>{post.title}</Box>
                      <Box as="time" dateTime={post.date} className={cn("text-xs text-[var(--v-color-muted)]")}>{post.date}</Box>
                    </Stack>
                  </Grid>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
}
