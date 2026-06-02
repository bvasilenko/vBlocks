// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { createElement } from "react";
import { visibleSections } from "@booga/vbrand/composition";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";
import { registry } from "../registry";
import { themeStyle } from "../theme";
import { brandToTheme } from "./brand-theme";
import { defaultCatalogComposition } from "./default-composition";
import type { GalleryMode, ContentOverrideMap } from "./gallery-mode";

export const canvasMode: GalleryMode = {
  modeId: () => "canvas",

  defaultComposition: defaultCatalogComposition,

  compose(brand: VbrandType, composition: CompositionSpec, _content?: ContentOverrideMap) {
    const theme = brandToTheme(brand);
    const sections = visibleSections(composition);

    return (
      <div style={themeStyle(theme)}>
        {sections.map((spec) => {
          const meta = registry[spec.id as keyof typeof registry];
          if (!meta) return null;
          return createElement(meta.component, { key: spec.id, content: meta.default });
        })}
      </div>
    );
  },
};
