/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- satori renders plain <img> */
import type { Property, Post } from "@/lib/types";
import { isUuid } from "@/lib/urls";

export const OG_COLORS = {
  primary: "#1a3c34",
  accent: "#c9a84c",
  ink: "#141414",
  muted: "#6b6b66",
  bg: "#f6f5f2",
  line: "#e9e7e2",
};

/**
 * Cache cards at the CDN for a day so each renders roughly once per day, not per share.
 * Replaces next/og's default (immutable, 1 year), which would freeze old prices in previews.
 */
export function withOgCache<T extends Response>(res: T): T {
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  return res;
}

const fontMedium = fetch(new URL("./fonts/PlusJakartaSans-Medium.ttf", import.meta.url)).then((r) =>
  r.arrayBuffer()
);
const fontBold = fetch(new URL("./fonts/PlusJakartaSans-Bold.ttf", import.meta.url)).then((r) =>
  r.arrayBuffer()
);
const logo = fetch(new URL("./logo.jpeg", import.meta.url)).then((r) => r.arrayBuffer());

function toBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function loadOgAssets() {
  const [medium, bold, logoBuf] = await Promise.all([fontMedium, fontBold, logo]);
  return {
    logoSrc: `data:image/jpeg;base64,${toBase64(logoBuf)}`,
    fonts: [
      { name: "Jakarta", data: medium, weight: 500 as const, style: "normal" as const },
      { name: "Jakarta", data: bold, weight: 700 as const, style: "normal" as const },
    ],
  };
}

// Plain REST calls keep the edge bundle small (no supabase-js).
async function supabaseSelect<T>(table: string, query: string): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

const PROPERTY_FIELDS = "id,title,location,price,status,type,images,bedrooms,bathrooms,area,land_size";

export async function fetchPropertyForOg(key: string): Promise<Property | null> {
  const filter = isUuid(key)
    ? `id=eq.${key}`
    : `slug=eq.${encodeURIComponent(key)}`;
  const rows = await supabaseSelect<Property>("properties", `select=${PROPERTY_FIELDS}&${filter}&limit=1`);
  return rows[0] ?? null;
}

export async function fetchPostForOg(slug: string): Promise<Post | null> {
  const rows = await supabaseSelect<Post>(
    "posts",
    `select=title,excerpt,cover_image_url,category,author,published_at&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`
  );
  return rows[0] ?? null;
}

export const STATUS_LABELS: Record<string, string> = {
  available: "For Sale",
  rented: "For Rent",
  sold: "Sold",
};

export const TYPE_LABELS: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  land: "Land",
};

/** Satori can only decode JPEG/PNG — anything else (e.g. WebP) would break the whole card. */
export function ogSafeImage(url: string | null | undefined): string | null {
  if (!url) return null;
  return /\.(jpe?g|png)(\?|$)/i.test(url) || url.includes("images.unsplash.com") ? url : null;
}

export function clip(text: string | null | undefined, max: number): string {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** "Luxury 7-Bedroom MANSION" → leaves mixed case alone, tames ALL-CAPS titles. */
export function tidyCase(text: string): string {
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 4 && letters === letters.toUpperCase()) {
    return text.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase());
  }
  return text;
}

export function propertySpecs(p: Property): string[] {
  return [
    p.bedrooms != null && `${p.bedrooms} bed${p.bedrooms !== 1 ? "s" : ""}`,
    p.bathrooms != null && `${p.bathrooms} bath${p.bathrooms !== 1 ? "s" : ""}`,
    p.area != null && `${p.area} m²`,
    p.area == null && p.land_size != null && `${p.land_size} m² land`,
  ].filter(Boolean) as string[];
}

export function Logo({ src, height = 56 }: { src: string; height?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        background: "#fff",
        borderRadius: 999,
        padding: `${height * 0.14}px ${height * 0.4}px`,
      }}
    >
      <img src={src} height={height} width={(height * 300) / 204} style={{ objectFit: "contain" }} />
    </div>
  );
}

export function Chip({
  children,
  dark = false,
  size = 22,
}: {
  children: React.ReactNode;
  dark?: boolean;
  size?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: 999,
        padding: `${size * 0.45}px ${size * 0.95}px`,
        fontSize: size,
        fontWeight: 700,
        background: dark ? OG_COLORS.primary : "#fff",
        color: dark ? "#fff" : OG_COLORS.ink,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.5,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: size * 0.12,
        textTransform: "uppercase",
        color: OG_COLORS.muted,
      }}
    >
      <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: 999, background: OG_COLORS.accent }} />
      {children}
    </div>
  );
}
