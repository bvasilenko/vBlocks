// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { getTemplate, TEMPLATE_REGISTRY } from "@booga/vbrand/templates";
import type { TemplateId } from "@booga/vbrand/templates";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";
import { HeroSplit, type HeroSplitContent } from "../hero";
import { selectBrandMarkImage } from "./brand-mark";
import type { GalleryMode, ContentOverrideMap } from "./gallery-mode";

const APP_TEMPLATE_HERO_PRESENTATION: HeroSplitContent["presentation"] = {
  spacing: "cta-anchored",
  imageFit: "scale-down",
};

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

function withAppTemplateHeroPresentation(node: ReactNode, brand: VbrandType): ReactNode {
  if (!isValidElement(node)) return node;

  if (node.type === HeroSplit) {
    const element = node as ReactElement<{ content: HeroSplitContent }>;
    return cloneElement(element, {
      content: {
        ...element.props.content,
        image: selectBrandMarkImage(brand),
        presentation: {
          ...element.props.content.presentation,
          ...APP_TEMPLATE_HERO_PRESENTATION,
        },
      },
    });
  }

  const element = node as ElementWithChildren;
  if (element.props.children === undefined) return element;

  return cloneElement(element, {
    children: Children.map(element.props.children, (child) =>
      withAppTemplateHeroPresentation(child, brand)
    ),
  });
}

export function makeAppTemplateMode(templateId: TemplateId): GalleryMode {
  const template = getTemplate(templateId);
  return {
    modeId: () => `app-template:${templateId}`,
    defaultComposition: () => template.defaultComposition(),
    compose(brand: VbrandType, composition: CompositionSpec, content?: ContentOverrideMap) {
      return withAppTemplateHeroPresentation(
        template.compose(brand, composition, content as Record<string, unknown>),
        brand
      );
    },
  };
}

export { TEMPLATE_REGISTRY };
export type { TemplateId };
