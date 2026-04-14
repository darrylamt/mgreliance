"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const typeLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  land: "Land",
};

const statusLabels: Record<string, string> = {
  available: "For Sale",
  rented: "For Rent",
  sold: "Sold",
};

const statusColors: Record<string, string> = {
  available: "bg-accent text-white",
  rented: "bg-primary text-white",
  sold: "bg-gray-500 text-white",
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
];

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const imageSrc =
    property.images?.[0] || placeholderImages[index % placeholderImages.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Status pill */}
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[property.status]}`}>
            {statusLabels[property.status]}
          </span>
        </div>
        {/* Type pill */}
        <div className="absolute top-4 right-4">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-primary backdrop-blur-sm">
            {typeLabels[property.type]}
          </span>
        </div>
        {/* Price overlay at bottom */}
        {property.price && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3">
            <p className="text-white font-bold text-lg">{property.price}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-playfair text-lg font-semibold text-text-main mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-4">
          <MapPin size={13} className="shrink-0 text-accent" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Specs row */}
        {(property.bedrooms || property.bathrooms || property.area) && (
          <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100 mb-4">
            {property.bedrooms != null && (
              <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Bed size={15} className="text-primary/60" />
                <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}</span>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Bath size={15} className="text-primary/60" />
                <span>{property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}</span>
              </div>
            )}
            {property.area != null && (
              <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Maximize2 size={13} className="text-primary/60" />
                <span>{property.area} m²</span>
              </div>
            )}
          </div>
        )}

        <Link
          href={`/projects/${property.id}`}
          className="block w-full text-center text-sm font-semibold bg-primary/5 text-primary border border-primary/20 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
