import type { NextRequest } from "next/server";
import { loadOgAssets } from "@/lib/og/shared";
import { renderPageCard } from "@/lib/og/page-card";
import { areaByName, getArea } from "@/lib/areas";

export const runtime = "edge";

// Only known keys are accepted so the endpoint can't be used to put arbitrary text on a branded image.
const PAGES: Record<string, { eyebrow: string; title: string; subtitle?: string; image?: string }> = {
  home: {
    eyebrow: "Real estate in Accra since 2010",
    title: "Find your place in Accra.",
    subtitle: "Residential, commercial and land across Greater Accra.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=920&q=80",
  },
  about: {
    eyebrow: "About us",
    title: "Accra's trusted real estate partner.",
    subtitle: "Built on integrity, driven by results — since 2010.",
  },
  services: {
    eyebrow: "Our services",
    title: "Real estate, handled end to end.",
    subtitle: "Sales, leasing, land, management, valuation and advisory.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk property.",
    subtitle: "East Legon, Accra · +233 24 427 4630",
  },
  blog: {
    eyebrow: "Blog",
    title: "Real estate insights for Accra.",
    subtitle: "Market updates, expert advice and property tips.",
  },
  projects: {
    eyebrow: "Properties",
    title: "Homes, land & commercial space in Accra.",
    subtitle: "Browse listings for sale and rent across Greater Accra.",
  },
  areas: {
    eyebrow: "Neighbourhoods",
    title: "Explore Accra, area by area.",
    subtitle: "From East Legon to Tema — find the right neighbourhood.",
  },
};

const TYPES: Record<string, string> = {
  residential: "Residential properties",
  commercial: "Commercial properties",
  land: "Land",
};
const STATUSES: Record<string, string> = { available: "for sale", rented: "for rent", sold: "sold" };

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const assets = await loadOgAssets();

  // Neighbourhood page
  const area = getArea(q.get("area") || "");
  if (area) {
    return renderPageCard(assets, {
      eyebrow: "Neighbourhood guide",
      title: `Property in ${area.name}.`,
      subtitle: area.tagline,
    });
  }

  // Filtered search, e.g. ?type=land&status=available&location=Tema
  const type = TYPES[q.get("type") || ""];
  const status = STATUSES[q.get("status") || ""];
  const searchArea = areaByName(q.get("location") || "");
  if (type || status || searchArea) {
    return renderPageCard(assets, {
      eyebrow: "Property search",
      title: `${type || "Properties"} ${status || "for sale & rent"} in ${searchArea?.name || "Accra"}.`,
      subtitle: "Browse the latest listings from MG Reliance Property Developers.",
    });
  }

  return renderPageCard(assets, PAGES[q.get("key") || ""] ?? PAGES.home);
}
