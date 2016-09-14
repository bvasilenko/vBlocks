import { Box, Grid, Separator, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FooterSplitContentSchema, type FooterSplitContent } from "./schema";

export function FooterSplit({ content, theme }: BlockProps<FooterSplitContent>) {
  FooterSplitContentSchema.parse(content);
  const { brand, links, copyright } = content;
  return (
    <Box as="footer" style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-12 gap-8 items-start")}>
        <Stack className={cn("gap-2")}>
          <Box as="p" className={cn("font-bold text-lg")}>{brand.name}</Box>
          {brand.tagline && (
            <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{brand.tagline}</Box>
          )}
        </Stack>
        <Box as="nav" aria-label="Footer navigation">
          <Box as="ul" className={cn("list-none m-0 p-0 flex flex-wrap gap-6")}>
            {links.map((link, i) => (
              <Box as="li" key={i}>
                <Box as="a" href={link.href} className={cn("text-sm hover:underline")}>
                  {link.label}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
      <Separator />
      <Box className={cn("max-w-6xl mx-auto px-6 py-4")}>
        <Box as="p" className={cn("text-xs text-[var(--v-color-muted)] text-center")}>{copyright}</Box>
      </Box>
    </Box>
  );
}
