// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { createElement } from "react";
import { cn } from "@booga/vui";
import { visibleSections } from "@booga/vbrand/composition";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";
import { registry } from "../registry";
import { themeStyle } from "../theme";
import { brandToTheme } from "./brand-theme";
import { defaultCatalogComposition } from "./default-composition";
import type { GalleryMode, ContentOverrideMap } from "./gallery-mode";

export const catalogMode: GalleryMode = {
  modeId: () => "catalog",

  defaultComposition: defaultCatalogComposition,

  compose(brand: VbrandType, composition: CompositionSpec, _content?: ContentOverrideMap) {
    const theme = brandToTheme(brand);
    const sections = visibleSections(composition);

    return (
      <div style={themeStyle(theme)}>
        {sections.map((spec) => {
          const meta = registry[spec.id as keyof typeof registry];
          if (!meta) return null;
          return (
            <section key={spec.id} id={`block-${spec.id.replace("/", "-")}`} className={cn("scroll-mt-14")}>
              <div className={cn("flex items-center gap-2 border-b border-border bg-card px-6 py-2")}>
                <code className={cn("text-xs font-mono font-semibold text-muted-foreground tracking-wide")}>{spec.id}</code>
              </div>
              <div className={cn("border-b-8 border-border")}>
                {createElement(meta.component, { content: meta.default })}
              </div>
            </section>
          );
        })}
      </div>
    );
  },
};
