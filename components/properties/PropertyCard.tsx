"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Tag } from "lucide-react";
import Badge from "@/components/ui/Badge";
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

const statusVariants: Record<string, "success" | "danger" | "warning"> = {
  available: "success",
  sold: "danger",
  rented: "warning",
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
];

export default function PropertyCard({
  property,
  index = 0,
}: PropertyCardProps) {
  const imageSrc =
    property.images?.[0] ||
    placeholderImages[index % placeholderImages.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      className="group bg-card rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Type badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant="accent">{typeLabels[property.type]}</Badge>
        </div>
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariants[property.status]}>
            {property.status.charAt(0).toUpperCase() +
              property.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-playfair text-lg font-semibold text-text-main mb-2 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-3">
          <MapPin size={14} className="shrink-0 text-accent" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {property.description && (
          <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {property.price ? (
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-accent" />
              <span className="font-semibold text-primary text-sm">
                {property.price}
              </span>
            </div>
          ) : (
            <span className="text-text-secondary text-xs">
              Price on request
            </span>
          )}
          <Link
            href="/contact"
            className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Enquire
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
