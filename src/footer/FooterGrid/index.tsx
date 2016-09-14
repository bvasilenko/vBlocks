import { Box, Grid, Separator, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle, clampedGridCols } from "../../theme";
import { FooterGridContentSchema, type FooterGridContent } from "./schema";

export function FooterGrid({ content, theme }: BlockProps<FooterGridContent>) {
  FooterGridContentSchema.parse(content);
  const { columns, copyright } = content;
  return (
    <Box as="footer" style={themeStyle(theme)}>
      <Grid
        columns={clampedGridCols(columns.length)}
        className={cn("max-w-6xl mx-auto px-6 py-12 gap-8")}
      >
        {columns.map((col, i) => (
          <Stack key={i} className={cn("gap-4")}>
            <Box as="h3" className={cn("font-semibold text-sm uppercase tracking-widest")}>
              {col.heading}
            </Box>
            <Box as="ul" className={cn("list-none m-0 p-0 flex flex-col gap-2")}>
              {col.links.map((link, j) => (
                <Box as="li" key={j}>
                  <Box as="a" href={link.href} className={cn("text-sm text-[var(--v-color-muted)] hover:underline")}>
                    {link.label}
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>
        ))}
      </Grid>
      <Separator />
      <Box className={cn("max-w-6xl mx-auto px-6 py-4")}>
        <Box as="p" className={cn("text-xs text-[var(--v-color-muted)] text-center")}>{copyright}</Box>
      </Box>
    </Box>
  );
}
