import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/home/CTABanner";
import { AREAS, areaPath } from "@/lib/areas";
import { areaCounts, getAllProperties } from "@/lib/listings";
import { pageOg } from "@/lib/og/meta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Neighbourhood Guides — Property Across Accra",
  description:
    "Explore property in East Legon, Cantonments, Airport Residential, Labone, Tema, Spintex and more. Area guides and current listings from MG Reliance.",
  openGraph: {
    title: "Neighbourhood Guides | MG Reliance",
    description: "Find the right area of Accra — guides and current listings, neighbourhood by neighbourhood.",
    url: "/areas",
    images: pageOg("areas"),
  },
  alternates: { canonical: "/areas" },
};

export default async function AreasPage() {
  const counts = areaCounts(await getAllProperties());

  return (
    <>
      <PageHeader
        eyebrow="Neighbourhoods"
        title="Explore Accra, area by area."
        description="Every neighbourhood has its own character. Find the one that fits — then browse what's available there."
        crumbs={[{ label: "Areas" }]}
      />

      <section className="pb-24 sm:pb-32 bg-white">
        <div className="container-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {AREAS.map((area, i) => (
            <Reveal key={area.slug} delay={(i % 3) * 0.06}>
              <Link
                href={areaPath(area)}
                className="group flex h-full flex-col justify-between gap-10 rounded-4xl bg-background p-7 transition-colors duration-300 hover:bg-primary"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="chip bg-white text-text-main tabular-nums transition-colors group-hover:bg-white/10 group-hover:text-white">
                    {counts[area.slug]} listing{counts[area.slug] !== 1 ? "s" : ""}
                  </span>
                  <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-main transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-text-main transition-colors group-hover:text-white">
                    {area.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary transition-colors group-hover:text-white/70">
                    {area.tagline}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABanner
        title="Not sure which area suits you?"
        description="Tell us what matters — schools, commute, budget — and we'll suggest neighbourhoods and listings that fit."
        primary={{ href: "/contact", label: "Ask our team" }}
        secondary={{ href: "/projects", label: "Browse all properties" }}
      />
    </>
  );
}
