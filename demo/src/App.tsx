import { useState, useEffect, useCallback } from "react";
import { loadFixture } from "@booga/vfixtures";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";
import {
  canvasMode,
  makeAppTemplateMode,
  TEMPLATE_REGISTRY,
  defaultCatalogComposition,
} from "@booga/vblocks/modes";
import type { GalleryMode, TemplateId } from "@booga/vblocks/modes";
import { parseBrandParam, loadBrand } from "./brand-loader";
import { VariantSelector } from "./composition/variant-selector";
import { CatalogView } from "./catalog/catalog-view";
import { ModeChip } from "./ui/mode-chip";
import { ErrorBanner } from "./ui/error-banner";
import { SidebarDrawer } from "./ui/sidebar-drawer";
import { toErrorMessage } from "./lib/to-error-message";
import {
  readRouteMode,
  navigateToMode,
  readBrandParam,
  updateBrandParam,
  readTemplateParam,
  updateTemplateParam,
  type RouteMode,
} from "./routing/route";

const TEMPLATE_IDS = Object.keys(TEMPLATE_REGISTRY) as TemplateId[];

function resolvedTemplateId(): TemplateId {
  const p = readTemplateParam();
  return p && TEMPLATE_IDS.includes(p as TemplateId) ? (p as TemplateId) : "landing";
}

function resolveMode(modeId: Exclude<RouteMode, "catalog">, templateId: TemplateId): GalleryMode {
  if (modeId === "canvas") return canvasMode;
  return makeAppTemplateMode(templateId);
}

export function App() {
  const [brand, setBrand] = useState<VbrandType>(() => loadFixture("stripe"));
  const [modeId, setModeId] = useState<RouteMode>(readRouteMode);
  const [templateId, setTemplateId] = useState<TemplateId>(resolvedTemplateId);
  const [brandInput, setBrandInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [composition, setComposition] = useState<CompositionSpec>(() =>
    modeId === "catalog"
      ? defaultCatalogComposition()
      : resolveMode(modeId, resolvedTemplateId()).defaultComposition()
  );

  useEffect(() => {
    const brandParam = readBrandParam();
    if (!brandParam) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadBrand(parseBrandParam(brandParam))
      .then((b) => {
        if (!cancelled) setBrand(b);
      })
      .catch((e) => {
        if (!cancelled) setError(toErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPop = () => {
      setModeId(readRouteMode());
      setTemplateId(resolvedTemplateId());
      setSidebarOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleModeChange = useCallback(
    (next: RouteMode) => {
      setModeId(next);
      setSidebarOpen(false);
      navigateToMode(next);
      if (next !== "catalog") {
        setComposition(resolveMode(next, templateId).defaultComposition());
      } else {
        setComposition(defaultCatalogComposition());
      }
    },
    [templateId]
  );

  const handleTemplateChange = useCallback((next: TemplateId) => {
    setTemplateId(next);
    updateTemplateParam(next);
    setComposition(makeAppTemplateMode(next).defaultComposition());
  }, []);

  const handleBrandSubmit = useCallback(() => {
    const trimmed = brandInput.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    loadBrand(parseBrandParam(trimmed))
      .then((b) => {
        setBrand(b);
        updateBrandParam(trimmed);
      })
      .catch((e) => setError(toErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [brandInput]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
          <span className="shrink-0 font-mono text-sm font-bold tracking-tight">@booga/vblocks</span>

          <div className="flex items-center gap-1 rounded-full bg-muted/50 px-1 py-0.5">
            {(["catalog", "canvas", "app-template"] as RouteMode[]).map((m) => (
              <ModeChip key={m} active={modeId === m} onClick={() => handleModeChange(m)}>
                {m}
              </ModeChip>
            ))}
          </div>

          {modeId === "app-template" && (
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-muted/50 px-1 py-0.5">
              {TEMPLATE_IDS.map((t) => (
                <ModeChip key={t} active={templateId === t} onClick={() => handleTemplateChange(t)}>
                  {t}
                </ModeChip>
              ))}
            </div>
          )}

          {modeId === "canvas" && (
            <button
              type="button"
              aria-label={sidebarOpen ? "Close variants" : "Open variants"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((o) => !o)}
              className="shrink-0 rounded border border-border px-3 py-1 text-xs font-semibold hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:hidden"
            >
              {sidebarOpen ? "Close" : "Variants"}
            </button>
          )}

          <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-1">
            <input
              type="text"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBrandSubmit()}
              aria-label="Brand source"
              placeholder="fixture:stripe  |  github:owner/repo  |  npm:pkg  |  https://..."
              className="min-w-0 flex-1 rounded border border-border bg-background px-3 py-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="button"
              onClick={handleBrandSubmit}
              disabled={loading}
              className="shrink-0 rounded border border-border px-3 py-1 text-xs font-semibold hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              {loading ? "..." : "Load"}
            </button>
          </div>
        </div>
      </header>

      {error !== null && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      <div className="flex">
        {modeId === "canvas" && (
          <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <VariantSelector
              spec={composition}
              defaultSpec={canvasMode.defaultComposition()}
              onChange={setComposition}
            />
          </SidebarDrawer>
        )}

        <main className="min-w-0 flex-1">
          {modeId === "catalog" ? (
            <CatalogView brand={brand} composition={composition} />
          ) : (
            resolveMode(modeId, templateId).compose(brand, composition)
          )}
        </main>
      </div>
    </div>
  );
}
