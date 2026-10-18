"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Property } from "@/lib/types";
import SaveButton from "@/components/properties/SaveButton";
import { propertyPath } from "@/lib/urls";

interface PropertyCardProps {
  property: Property;
  index?: number;
  sizes?: string;
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

const placeholderImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
];

export default function PropertyCard({
  property,
  index = 0,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: PropertyCardProps) {
  const imageSrc =
    property.images?.[0] || placeholderImages[index % placeholderImages.length];

  const specs = [
    property.bedrooms != null && `${property.bedrooms} bed${property.bedrooms !== 1 ? "s" : ""}`,
    property.bathrooms != null && `${property.bathrooms} bath${property.bathrooms !== 1 ? "s" : ""}`,
    property.area != null && `${property.area} m²`,
  ].filter(Boolean) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={propertyPath(property)} className="group block h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-background">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes={sizes}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`chip backdrop-blur-md ${
                property.status === "sold" ? "bg-black/60 text-white" : "bg-white/90 text-text-main"
              }`}
            >
              {statusLabels[property.status]}
            </span>
          </div>

          <SaveButton propertyId={property.id} className="absolute top-4 right-4" />

          {/* Hover arrow */}
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-main opacity-0 translate-y-1 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300">
            <ArrowUpRight size={17} />
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 px-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="min-w-0 text-[17px] font-semibold text-text-main tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            {property.price && (
              <p className="shrink-0 text-[17px] font-semibold text-text-main whitespace-nowrap">
                {property.price}
              </p>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-text-secondary text-sm">
            <MapPin size={13} className="shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-text-secondary">
            <span className="text-text-main font-medium">{typeLabels[property.type]}</span>
            {specs.map((s) => (
              <span key={s} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-line" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
