import { BrowserBrandSourceAdapter } from "@booga/vbrand/adapters/browser";
import { loadFixture } from "@booga/vfixtures";
import type { VbrandType } from "@booga/vbrand";

const adapter = new BrowserBrandSourceAdapter();

type BrandSource =
  | { type: "default" }
  | { type: "fixture"; handle: string }
  | { type: "url"; url: string }
  | { type: "github"; owner: string; repo: string }
  | { type: "npm"; package: string }
  | { type: "json"; payload: unknown };

export function parseBrandParam(param: string | null): BrandSource {
  if (!param) return { type: "default" };
  if (param.startsWith("fixture:")) return { type: "fixture", handle: param.slice(8) };
  if (param.startsWith("github:")) {
    const [owner, repo] = param.slice(7).split("/");
    return { type: "github", owner: owner ?? "", repo: repo ?? "" };
  }
  if (param.startsWith("npm:")) return { type: "npm", package: param.slice(4) };
  if (param.startsWith("json:")) {
    try {
      return { type: "json", payload: JSON.parse(param.slice(5)) };
    } catch {
      return { type: "default" };
    }
  }
  return { type: "url", url: param };
}

export async function loadBrand(source: BrandSource): Promise<VbrandType> {
  switch (source.type) {
    case "default":
      return loadFixture("stripe");
    case "fixture":
      return adapter.loadFromFixture(source.handle);
    case "url":
      return adapter.loadFromUrl(source.url);
    case "github":
      return adapter.loadFromGitHub(source.owner, source.repo);
    case "npm":
      return adapter.loadFromNpm(source.package);
    case "json":
      return adapter.loadFromCustomJson(source.payload);
  }
}
