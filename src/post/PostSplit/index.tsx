// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Box, Grid, Inline, Separator, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PostSplitContentSchema, type PostSplitContent } from "./schema";

export function PostSplit({ content, theme }: BlockProps<PostSplitContent>) {
  PostSplitContentSchema.parse(content);
  const { title, author, date, category, body, image } = content;
  return (
    <Box as="article" style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-16 items-start")}>
        <Stack className={cn("gap-6 sticky top-16")}>
          {category && <Badge variant="secondary">{category}</Badge>}
          <Box as="h1" className={cn("text-3xl font-bold tracking-tight leading-snug")}>{title}</Box>
          <Separator />
          <Inline className={cn("gap-2 text-sm text-[var(--v-color-muted)]")}>
            <Box as="span">{author}</Box>
            <Box as="span" aria-hidden="true">·</Box>
            <Box as="time" dateTime={date}>{date}</Box>
          </Inline>
        </Stack>
        <Stack className={cn("gap-6")}>
          <Box
            as="img"
            src={image.src}
            alt={image.alt}
            className={cn("w-full rounded-lg object-cover aspect-video")}
          />
          <Box as="p" className={cn("text-base leading-relaxed")}>{body}</Box>
        </Stack>
      </Grid>
    </Box>
  );
}
