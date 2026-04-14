import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import PropertyDetailClient from "./PropertyDetailClient";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperty.com";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("title, description, location, price, images, status, type")
      .eq("id", params.id)
      .single();

    if (!data) return { title: "Property Not Found" };

    const statusLabel =
      data.status === "rented" ? "For Rent" : data.status === "sold" ? "Sold" : "For Sale";
    const desc =
      data.description ||
      `${data.title} — ${statusLabel} in ${data.location}. ${data.price ? `Priced at ${data.price}.` : "Contact us for pricing."} Listed by MG Reliance Property Developers.`;

    return {
      title: `${data.title} — ${statusLabel} in ${data.location}`,
      description: desc,
      openGraph: {
        title: `${data.title} | MG Reliance`,
        description: desc,
        url: `/projects/${params.id}`,
        images: data.images?.[0]
          ? [{ url: data.images[0], width: 1200, height: 630, alt: data.title }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.title} | MG Reliance`,
        description: desc,
        images: data.images?.[0] ? [data.images[0]] : [],
      },
      alternates: { canonical: `/projects/${params.id}` },
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
    "@id": `${BASE_URL}/projects/${property.id}`,
    name: property.title,
    description: property.description || property.title,
    url: `${BASE_URL}/projects/${property.id}`,
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
        url: BASE_URL,
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
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) notFound();
    property = data;

    const { data: relatedData } = await supabase
      .from("properties")
      .select("*")
      .eq("type", data.type)
      .neq("id", params.id)
      .limit(3);

    related = relatedData || [];
  } catch {
    notFound();
  }

  if (!property) notFound();

  return (
    <>
      <JsonLd data={buildPropertySchema(property)} />
      <PropertyDetailClient property={property} related={related} />
    </>
  );
}
