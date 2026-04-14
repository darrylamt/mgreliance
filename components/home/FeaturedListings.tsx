"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/types";

interface FeaturedListingsProps {
  properties: Property[];
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
];

const statusLabels: Record<string, string> = {
  available: "For Sale",
  rented: "For Rent",
  sold: "Sold",
};

const CARD_WIDTH = 360;
const CARD_GAP = 24;

export default function FeaturedListings({ properties }: FeaturedListingsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (properties.length === 0) return null;

  const scroll = (dir: "prev" | "next") => {
    if (!trackRef.current) return;
    const amount = CARD_WIDTH + CARD_GAP;
    trackRef.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
              Hand-Picked
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main">
              Featured Properties
            </h2>
          </motion.div>

          {properties.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="hidden sm:flex items-center gap-3"
            >
              <button
                onClick={() => scroll("prev")}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("next")}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((property, index) => {
            const img = property.images?.[0] || placeholderImages[index % placeholderImages.length];
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="shrink-0 snap-start"
                style={{ width: CARD_WIDTH }}
              >
                <Link
                  href={`/projects/${property.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={img}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="360px"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {statusLabels[property.status]}
                      </span>
                    </div>
                    {property.price && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3">
                        <p className="text-white font-bold text-lg">{property.price}</p>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-playfair text-lg font-semibold text-text-main mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-4">
                      <MapPin size={13} className="text-accent shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>

                    {(property.bedrooms != null || property.bathrooms != null || property.area != null) && (
                      <div className="flex items-center gap-4 py-3 border-t border-gray-100">
                        {property.bedrooms != null && (
                          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                            <Bed size={14} className="text-primary/60" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms != null && (
                          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                            <Bath size={14} className="text-primary/60" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        {property.area != null && (
                          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                            <Maximize2 size={13} className="text-primary/60" />
                            <span>{property.area}m²</span>
                          </div>
                        )}
                        {property.agent_name && (
                          <span className="ml-auto text-xs text-text-secondary truncate max-w-[80px]">
                            {property.agent_name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-accent transition-colors group"
          >
            View All Properties
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
