import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import PropertyCard from "@/components/properties/PropertyCard";
import AlertSignup from "@/components/properties/AlertSignup";
import CTABanner from "@/components/home/CTABanner";
import JsonLd from "@/components/seo/JsonLd";
import { AREAS, areaPath, getArea } from "@/lib/areas";
import { getAllProperties, propertiesInArea } from "@/lib/listings";
import { ogImages } from "@/lib/og/meta";
import { SITE_URL } from "@/lib/urls";

export const revalidate = 3600;

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getArea(params.slug);
  if (!area) return { title: "Area Not Found" };
  const title = `Property for Sale & Rent in ${area.name}, Accra`;
  return {
    title,
    description: `${area.tagline} Browse houses, apartments, land and commercial property in ${area.name} with MG Reliance Property Developers.`,
    openGraph: {
      title: `Property in ${area.name} | MG Reliance`,
      description: area.tagline,
      url: areaPath(area),
      images: ogImages(`/og/page?area=${area.slug}`, `Property in ${area.name}`),
    },
    alternates: { canonical: areaPath(area) },
  };
}

export default async function AreaPage({ params }: Props) {
  const area = getArea(params.slug);
  if (!area) notFound();

  const listings = propertiesInArea(await getAllProperties(), area);
  const forSale = listings.filter((p) => p.status === "available").length;
  const forRent = listings.filter((p) => p.status === "rented").length;
  const others = AREAS.filter((a) => a.slug !== area.slug);

  // ~2.5 km box around the area centre for the map embed.
  const d = 0.025;
  const bbox = [area.lng - d, area.lat - d, area.lng + d, area.lat + d].join(",");
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${area.lat},${area.lng}`;

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${area.name}, Accra`,
    description: area.intro,
    url: `${SITE_URL}${areaPath(area)}`,
    geo: { "@type": "GeoCoordinates", latitude: area.lat, longitude: area.lng },
    containedInPlace: { "@type": "City", name: "Accra" },
  };

  return (
    <>
      <JsonLd data={placeSchema} />
      <PageHeader
        eyebrow="Neighbourhood guide"
        title={`Property in ${area.name}.`}
        description={area.intro}
        crumbs={[{ href: "/areas", label: "Areas" }, { label: area.name }]}
      >
        <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
          {[
            { label: "Listings", value: listings.length },
            { label: "For sale", value: forSale },
            { label: "For rent", value: forRent },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl bg-background px-5 py-4">
              <p className="text-2xl font-semibold tracking-tight text-text-main tabular-nums">{s.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* Listings */}
      <section className="pb-16 sm:pb-24 bg-white">
        <div className="container-page">
          <Reveal className="flex items-end justify-between gap-4 mb-10">
            <h2 className="heading-lg">Available in {area.name}</h2>
            <Link
              href={`/projects?location=${encodeURIComponent(area.name)}`}
              className="link-arrow group shrink-0"
            >
              Search & filter
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {listings.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-4xl bg-background px-6 py-16 text-center">
              <h3 className="text-xl font-semibold tracking-tight text-text-main">
                Nothing listed in {area.name} right now
              </h3>
              <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
                New properties come up often. Set an alert below and we&apos;ll email you the moment one does.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Alert + map */}
      <section className="pb-16 sm:pb-24 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Reveal className="h-full">
            <AlertSignup
              location={area.name}
              title={`Get new ${area.name} listings by email`}
              description="Be first to hear when a property comes up here. One email per new listing, unsubscribe any time."
            />
          </Reveal>
          <Reveal delay={0.1} className="rounded-4xl overflow-hidden bg-background min-h-[320px]">
            <iframe
              src={mapSrc}
              title={`Map of ${area.name}, Accra`}
              loading="lazy"
              className="w-full h-full min-h-[320px] border-0"
            />
          </Reveal>
        </div>
      </section>

      {/* Other areas */}
      <section className="pb-8 bg-white">
        <div className="container-page">
          <p className="eyebrow mb-5">Explore nearby</p>
          <div className="flex flex-wrap gap-2">
            {others.map((a) => (
              <Link
                key={a.slug}
                href={areaPath(a)}
                className="chip bg-background text-text-main px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title={`Looking in ${area.name}?`}
        description="Tell us your budget and must-haves — we often hear about properties before they're listed."
        primary={{ href: "/contact", label: "Talk to an agent" }}
        secondary={null}
      />
    </>
  );
}
