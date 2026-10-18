export interface Area {
  slug: string;
  name: string;
  /** One-line summary for cards and meta descriptions. */
  tagline: string;
  /** Short intro paragraph for the area page. */
  intro: string;
  /** Map centre. */
  lat: number;
  lng: number;
  /** Listing locations containing any of these (case-insensitive) belong to the area. Defaults to [name]. */
  match?: string[];
  /** ...unless they also contain one of these. */
  exclude?: string[];
}

export const AREAS: Area[] = [
  {
    slug: "east-legon",
    name: "East Legon",
    tagline: "Quiet streets, top schools and easy airport access.",
    intro:
      "One of Accra's most sought-after residential neighbourhoods, East Legon is known for its quiet, tree-lined streets, international schools, restaurants and quick access to the University of Ghana and Kotoka International Airport. It's a favourite with families and returning diaspora buyers.",
    lat: 5.635,
    lng: -0.161,
  },
  {
    slug: "cantonments",
    name: "Cantonments",
    tagline: "Central, green and home to many embassies.",
    intro:
      "Upscale, central and green, Cantonments is home to many embassies and diplomatic residences. Its wide roads, established homes and short drive to Osu and the Airport area make it one of the city's most prestigious addresses.",
    lat: 5.583,
    lng: -0.172,
  },
  {
    slug: "airport-residential",
    name: "Airport Residential",
    tagline: "Executive homes beside Kotoka International Airport.",
    intro:
      "A prestigious enclave beside Kotoka International Airport, Airport Residential is popular with executives and expatriates for its security, modern apartments, offices and hotels — ideal for buyers and tenants who travel often.",
    lat: 5.604,
    lng: -0.178,
    exclude: ["takoradi", "kumasi"],
  },
  {
    slug: "labone",
    name: "Labone",
    tagline: "A leafy, relaxed neighbourhood near the coast.",
    intro:
      "Leafy and established, Labone sits between Cantonments and the coast with a relaxed, village-like feel, cafés and good schools — a great fit for anyone who wants to be central without the bustle.",
    lat: 5.565,
    lng: -0.17,
  },
  {
    slug: "adjiringanor",
    name: "Adjiringanor",
    tagline: "Newer homes and more space, just east of East Legon.",
    intro:
      "A fast-growing suburb just east of East Legon, Adjiringanor offers newer homes, larger plots and more space at more accessible prices — a strong choice for growing families and investors.",
    lat: 5.656,
    lng: -0.133,
  },
  {
    slug: "trasacco-valley",
    name: "Trasacco Valley",
    tagline: "Gated luxury living with round-the-clock security.",
    intro:
      "Trasacco Valley is a gated luxury estate near East Legon, known for large villas, landscaped streets and round-the-clock security — one of the most exclusive residential addresses in Greater Accra.",
    lat: 5.653,
    lng: -0.124,
    match: ["Trasacco"],
  },
  {
    slug: "tema",
    name: "Tema",
    tagline: "Ghana's port city, with planned communities.",
    intro:
      "Ghana's port city east of Accra, Tema is built around planned residential communities, with industrial zones and a steady rental market driven by the harbour and surrounding businesses.",
    lat: 5.67,
    lng: -0.017,
  },
  {
    slug: "spintex",
    name: "Spintex",
    tagline: "Estates, offices and warehouses between Accra and Tema.",
    intro:
      "A busy corridor between Accra and Tema, Spintex mixes residential estates with offices, shops and warehouses — popular for both family homes and commercial space.",
    lat: 5.629,
    lng: -0.109,
  },
  {
    slug: "achimota",
    name: "Achimota",
    tagline: "Established north-west Accra with strong road links.",
    intro:
      "An established area in north-west Accra around the Achimota forest and school, Achimota offers a mix of homes and good road links into the city and beyond.",
    lat: 5.62,
    lng: -0.229,
  },
  {
    slug: "accra-central",
    name: "Accra Central",
    tagline: "The commercial heart of the city.",
    intro:
      "The historic commercial heart of Accra — markets, banks and government offices — with strong demand for commercial, retail and mixed-use space.",
    lat: 5.55,
    lng: -0.205,
    match: ["Accra Central", "Central Accra"],
  },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

/** Case-insensitive lookup by display name (e.g. a ?location= search value). */
export function areaByName(name: string): Area | undefined {
  const q = name.trim().toLowerCase();
  return AREAS.find((a) => a.name.toLowerCase() === q);
}

export function locationInArea(location: string | null | undefined, area: Area): boolean {
  if (!location) return false;
  const l = location.toLowerCase();
  const terms = area.match ?? [area.name];
  return (
    terms.some((t) => l.includes(t.toLowerCase())) &&
    !(area.exclude ?? []).some((t) => l.includes(t.toLowerCase()))
  );
}

/** The first area a listing's location belongs to, if any. */
export function areaForLocation(location: string | null | undefined): Area | undefined {
  return AREAS.find((a) => locationInArea(location, a));
}

export function areaPath(area: Area): string {
  return `/areas/${area.slug}`;
}
