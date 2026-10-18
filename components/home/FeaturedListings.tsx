"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import type { Property } from "@/lib/types";

interface FeaturedListingsProps {
  properties: Property[];
}

export default function FeaturedListings({ properties }: FeaturedListingsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (properties.length === 0) return null;

  const scroll = (dir: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 20 : 380;
    track.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-24 sm:py-32 bg-background overflow-hidden">
      <div className="container-page">
        <Reveal className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-4">Hand-picked</p>
            <h2 className="heading-lg">Featured properties</h2>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/projects" className="link-arrow group mr-3 hidden sm:inline-flex">
              View all
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            {properties.length > 3 && (
              <>
                <button
                  onClick={() => scroll("prev")}
                  aria-label="Previous"
                  className="w-11 h-11 rounded-full bg-white border border-line flex items-center justify-center text-text-main hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scroll("next")}
                  aria-label="Next"
                  className="w-11 h-11 rounded-full bg-white border border-line flex items-center justify-center text-text-main hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar -mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0"
        >
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="shrink-0 snap-start w-[82%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            >
              <PropertyCard
                property={property}
                index={index}
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link href="/projects" className="btn btn-secondary w-full">
            View all properties
          </Link>
        </div>
      </div>
    </section>
  );
}
