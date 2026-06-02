import { createElement } from "react";
import { registry, brandToTheme, type BlockId } from "@booga/vblocks";
import type { VbrandType } from "@booga/vbrand";

interface BlockInspectorProps {
  blockId: BlockId;
  brand: VbrandType;
  onBack: () => void;
}

function themeVars(brand: VbrandType): React.CSSProperties {
  return Object.fromEntries(
    Object.entries(brandToTheme(brand)).map(([k, v]) => [`--v-${k}`, v])
  ) as React.CSSProperties;
}

export function BlockInspector({ blockId, brand, onBack }: BlockInspectorProps) {
  const meta = registry[blockId];
  const [category, variant] = blockId.split("/");

  return (
    <div className="flex flex-col">
      <div className="sticky top-14 z-10 flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-border px-3 py-1 text-xs font-semibold hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Back
        </button>
        <code className="text-xs font-mono font-semibold text-muted-foreground">{blockId}</code>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {category}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {variant}
        </span>
      </div>

      {meta ? (
        <div style={themeVars(brand)}>
          {createElement(meta.component, { content: meta.default })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-12 text-muted-foreground">
          <p>Block not found: {blockId}</p>
        </div>
      )}
    </div>
  );
}
