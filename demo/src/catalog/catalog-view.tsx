import { useState, useEffect } from "react";
import { registry, type BlockId } from "@booga/vblocks";
import { catalogMode } from "@booga/vblocks/modes";
import { visibleSections } from "@booga/vbrand/composition";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";
import {
  readInspectParam,
  setInspectParam,
  blockIdToSlug,
  slugToBlockId,
} from "../routing/route";
import { BlockInspector } from "./block-inspector";

interface CatalogViewProps {
  brand: VbrandType;
  composition: CompositionSpec;
}

export function CatalogView({ brand, composition }: CatalogViewProps) {
  const [inspectSlug, setInspectSlug] = useState<string | null>(readInspectParam);

  useEffect(() => {
    const onPop = () => setInspectSlug(readInspectParam());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openInspector = (blockId: BlockId) => {
    const slug = blockIdToSlug(blockId);
    setInspectSlug(slug);
    setInspectParam(slug);
  };

  const closeInspector = () => {
    setInspectSlug(null);
    setInspectParam(null);
  };

  const visibleIds = visibleSections(composition).map((s) => s.id as BlockId);

  return (
    <div className="flex">
      <nav
        aria-label="Block navigation"
        className="hidden lg:block w-48 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-card px-2 py-3"
      >
        {groupByCategory(visibleIds).map(([category, ids]) => (
          <div key={category} className="mb-3">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {category}
            </div>
            {ids.map((id) => {
              const variant = id.split("/")[1];
              const slug = blockIdToSlug(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => openInspector(id)}
                  className={
                    "block w-full rounded px-2 py-1 text-left text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
                    (inspectSlug === slug
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "hover:bg-accent hover:text-accent-foreground text-muted-foreground")
                  }
                >
                  {variant}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="min-w-0 flex-1">
        {inspectSlug !== null ? (
          <BlockInspector
            blockId={slugToBlockId(inspectSlug) as BlockId}
            brand={brand}
            onBack={closeInspector}
          />
        ) : (
          catalogMode.compose(brand, composition)
        )}
      </div>
    </div>
  );
}

function groupByCategory(ids: BlockId[]): [string, BlockId[]][] {
  const map = new Map<string, BlockId[]>();
  for (const id of ids) {
    const category = id.split("/")[0];
    const bucket = map.get(category) ?? [];
    bucket.push(id);
    map.set(category, bucket);
  }
  return Array.from(map.entries());
}
