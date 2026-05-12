// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, Box, Grid, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TestimonialSplitContentSchema, type TestimonialSplitContent } from "./schema";

export function TestimonialSplit({ content, theme }: BlockProps<TestimonialSplitContent>) {
  TestimonialSplitContentSchema.parse(content);
  const { quote, author, role, company, avatar } = content;
  return (
    <Box as="section" aria-label="Testimonial" style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-5xl mx-auto px-6 py-20 gap-16 items-center")}>
        <Box
          as="blockquote"
          className={cn("text-2xl font-medium leading-relaxed")}
          cite={undefined}
        >
          <Box as="p">{quote}</Box>
        </Box>
        <Stack className={cn("gap-4")}>
          {avatar && (
            <Avatar className={cn("w-20 h-20")}>
              <AvatarImage src={avatar.src} alt={avatar.alt} />
              <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <Inline className={cn("gap-1 text-sm text-[var(--v-color-muted)]")}>
            <Box as="cite" className={cn("font-semibold not-italic text-[var(--v-color-fg)]")}>{author}</Box>
            <Box as="span">,</Box>
            <Box as="span">{role}</Box>
            {company && (
              <>
                <Box as="span">at</Box>
                <Box as="span">{company}</Box>
              </>
            )}
          </Inline>
        </Stack>
      </Grid>
    </Box>
  );
}
