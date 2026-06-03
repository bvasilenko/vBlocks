export type RouteMode = "catalog" | "canvas" | "app-template";

export function resolveModeFromPathname(pathname: string, base: string): RouteMode {
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, "");
  const segment = relative.split("/")[0];
  if (segment === "canvas") return "canvas";
  if (segment === "app-template") return "app-template";
  return "catalog";
}

export function buildModePathname(mode: RouteMode, base: string): string {
  return mode === "catalog" ? base : `${base}${mode}`;
}

export function readRouteMode(): RouteMode {
  return resolveModeFromPathname(window.location.pathname, import.meta.env.BASE_URL);
}

export function navigateToMode(mode: RouteMode): void {
  const url = new URL(window.location.href);
  url.pathname = buildModePathname(mode, import.meta.env.BASE_URL);
  url.searchParams.delete("inspect");
  window.history.pushState(null, "", url.toString());
}

export function readBrandParam(): string | null {
  return new URLSearchParams(window.location.search).get("brand");
}

export function updateBrandParam(value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set("brand", value);
  window.history.pushState(null, "", url.toString());
}

export function readTemplateParam(): string | null {
  return new URLSearchParams(window.location.search).get("app");
}

export function updateTemplateParam(value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set("app", value);
  window.history.pushState(null, "", url.toString());
}

export function readInspectParam(): string | null {
  return new URLSearchParams(window.location.search).get("inspect");
}

export function setInspectParam(slug: string | null): void {
  const url = new URL(window.location.href);
  if (slug !== null) {
    url.searchParams.set("inspect", slug);
  } else {
    url.searchParams.delete("inspect");
  }
  window.history.pushState(null, "", url.toString());
}

export function blockIdToSlug(id: string): string {
  const slash = id.indexOf("/");
  return slash === -1 ? id : id.slice(0, slash) + "-" + id.slice(slash + 1);
}

export function slugToBlockId(slug: string): string {
  const dash = slug.indexOf("-");
  return dash === -1 ? slug : slug.slice(0, dash) + "/" + slug.slice(dash + 1);
}
