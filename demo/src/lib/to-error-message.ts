export function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string" && e.length > 0) return e;
  return "Brand load failed";
}
