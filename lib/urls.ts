export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperties.com";

/** Prefer the readable slug; fall back to the id until every listing has one. */
export function propertyPath(p: { id: string; slug?: string | null }): string {
  return `/projects/${p.slug || p.id}`;
}

export function propertyUrl(p: { id: string; slug?: string | null }): string {
  return `${SITE_URL}${propertyPath(p)}`;
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}
