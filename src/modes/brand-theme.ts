// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import type { VbrandType } from "@booga/vbrand";
import type { ThemeOverride } from "../types";

function hexLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastForeground(background: string): string {
  if (!background.startsWith("#")) return "#000000";
  return hexLuminance(background) > 0.179 ? "#000000" : "#ffffff";
}

function assign(theme: ThemeOverride, key: string, value: string | undefined): void {
  if (value !== undefined && value !== "") theme[key] = value;
}

export function brandToTheme(brand: VbrandType): ThemeOverride {
  const c = brand.tokens.color;
  const t = brand.tokens.type;
  const theme: ThemeOverride = {};

  assign(theme, "color-primary", c.primary);
  if (c.primary) {
    assign(theme, "color-primary-foreground", contrastForeground(c.primary));
    assign(theme, "color-ring", c.primary);
  }

  assign(theme, "color-secondary", c.secondary);
  if (c.secondary) {
    assign(theme, "color-secondary-foreground", contrastForeground(c.secondary));
  }

  assign(theme, "color-accent", c.accent);
  if (c.accent) {
    assign(theme, "color-accent-foreground", contrastForeground(c.accent));
  }

  assign(theme, "color-background", c["neutral-50"]);
  assign(theme, "color-card", c["neutral-50"]);
  assign(theme, "color-popover", c["neutral-50"]);
  assign(theme, "color-foreground", c["neutral-900"]);
  assign(theme, "color-card-foreground", c["neutral-900"]);
  assign(theme, "color-popover-foreground", c["neutral-700"]);
  assign(theme, "color-border", c["neutral-200"]);
  assign(theme, "color-input", c["neutral-200"]);
  assign(theme, "color-muted", c["neutral-100"]);
  assign(theme, "color-muted-foreground", c["neutral-500"]);

  assign(theme, "color-destructive", c.error);
  if (c.error) {
    assign(theme, "color-destructive-foreground", contrastForeground(c.error));
  }

  assign(theme, "color-success", c.success);
  assign(theme, "color-warning", c.warning);

  assign(theme, "font-sans", t.body);
  assign(theme, "font-mono", t.mono);
  assign(theme, "font-serif", t.display ?? t.heading);

  return theme;
}
