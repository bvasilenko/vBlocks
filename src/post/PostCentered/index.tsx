import { Badge, Box, Inline, Separator, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PostCenteredContentSchema, type PostCenteredContent } from "./schema";

export function PostCentered({ content, theme }: BlockProps<PostCenteredContent>) {
  PostCenteredContentSchema.parse(content);
  const { title, author, date, category, body } = content;
  return (
    <Box as="article" style={themeStyle(theme)}>
      <Stack className={cn("max-w-2xl mx-auto px-6 py-16 gap-6")}>
        {category && <Badge variant="secondary">{category}</Badge>}
        <Box as="h1" className={cn("text-4xl font-bold tracking-tight leading-snug")}>{title}</Box>
        <Inline className={cn("gap-2 text-sm text-[var(--v-color-muted)]")}>
          <Box as="span">{author}</Box>
          <Box as="span" aria-hidden="true">·</Box>
          <Box as="time" dateTime={date}>{date}</Box>
        </Inline>
        <Separator />
        <Box as="p" className={cn("text-base leading-relaxed")}>{body}</Box>
      </Stack>
    </Box>
  );
}
