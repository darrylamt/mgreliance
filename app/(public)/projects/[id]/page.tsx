import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import PropertyDetailClient from "./PropertyDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { ogImages } from "@/lib/og/meta";
import { isUuid, propertyPath, propertyUrl, SITE_URL } from "@/lib/urls";

interface Props {
  params: { id: string };
}

const STATUS_LABELS: Record<string, string> = {
  available: "For Sale",
  rented: "For Rent",
  sold: "Sold",
};

/** Look a listing up by readable slug or legacy UUID — deduped between metadata and page. */
const getProperty = cache(async (key: string): Promise<Property | null> => {
  const supabase = await createClient();
  if (isUuid(key)) {
    const { data } = await supabase.from("properties").select("*").eq("id", key).maybeSingle();
    return data;
  }
  // Errors (e.g. slug column not migrated yet) simply mean "not found".
  const { data } = await supabase.from("properties").select("*").eq("slug", key).maybeSingle();
  return data;
});

function shortSpecs(p: Property): string {
  return [
    p.bedrooms != null && `${p.bedrooms} bed`,
    p.bathrooms != null && `${p.bathrooms} bath`,
    p.area != null && `${p.area} m²`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await getProperty(params.id);
    if (!data) return { title: "Property Not Found" };

    const statusLabel = STATUS_LABELS[data.status] || "For Sale";
    const specs = shortSpecs(data);
    const summary = [data.price, specs, data.location].filter(Boolean).join(" · ");
    const desc = data.description
      ? data.description.replace(/\s+/g, " ").slice(0, 155).trimEnd() + (data.description.length > 155 ? "…" : "")
      : `${data.title} — ${statusLabel} in ${data.location}. ${data.price ? `Priced at ${data.price}.` : "Contact us for pricing."} Listed by MG Reliance Property Developers.`;
    const path = propertyPath(data);

    return {
      title: `${data.title} — ${statusLabel} in ${data.location}`,
      description: desc,
      openGraph: {
        title: `${data.title} | ${statusLabel}`,
        // Price + specs up front: that's what people scan in a WhatsApp preview.
        description: summary || desc,
        url: path,
        images: ogImages(`/og/property/${data.slug || data.id}`, data.title),
        type: "website",
      },
      alternates: { canonical: path },
    };
  } catch {
    return { title: "Property | MG Reliance" };
  }
}

function buildPropertySchema(property: Property) {
  const statusMap: Record<string, string> = {
    available: "https://schema.org/InStock",
    rented: "https://schema.org/SoldOut",
    sold: "https://schema.org/SoldOut",
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": propertyUrl(property),
    name: property.title,
    description: property.description || property.title,
    url: propertyUrl(property),
    image: property.images?.length ? property.images : [],
    datePosted: property.created_at,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
    offers: {
      "@type": "Offer",
      name: property.title,
      availability: statusMap[property.status] || "https://schema.org/InStock",
      price: property.price
        ? property.price.replace(/[^0-9.]/g, "")
        : undefined,
      priceCurrency: "GHS",
      seller: {
        "@type": "RealEstateAgent",
        name: property.agent_name || "MG Reliance Property Developers",
        url: SITE_URL,
      },
    },
    ...(property.bedrooms != null && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms != null && { numberOfBathroomsTotal: property.bathrooms }),
    ...(property.area != null && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area,
        unitCode: "MTK",
      },
    }),
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  let property: Property | null = null;
  let related: Property[] = [];

  try {
    property = await getProperty(params.id);
  } catch {
    notFound();
  }
  if (!property) notFound();

  // Old /projects/<uuid> links (already shared on WhatsApp etc.) move to the readable URL.
  if (property.slug && params.id !== property.slug) {
    permanentRedirect(propertyPath(property));
  }

  try {
    const supabase = await createClient();
    const { data: relatedData } = await supabase
      .from("properties")
      .select("*")
      .eq("type", property.type)
      .neq("id", property.id)
      .limit(3);
    related = relatedData || [];
  } catch {
    // Related listings are optional.
  }

  return (
    <>
      <JsonLd data={buildPropertySchema(property)} />
      <PropertyDetailClient property={property} related={related} />
    </>
  );
}
