// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { getTemplate, TEMPLATE_REGISTRY } from "@booga/vbrand/templates";
import type { TemplateId } from "@booga/vbrand/templates";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";
import type { GalleryMode, ContentOverrideMap } from "./gallery-mode";

export function makeAppTemplateMode(templateId: TemplateId): GalleryMode {
  const template = getTemplate(templateId);
  return {
    modeId: () => `app-template:${templateId}`,
    defaultComposition: () => template.defaultComposition(),
    compose(brand: VbrandType, composition: CompositionSpec, content?: ContentOverrideMap) {
      return template.compose(brand, composition, content as Record<string, unknown>);
    },
  };
}

export { TEMPLATE_REGISTRY };
export type { TemplateId };
