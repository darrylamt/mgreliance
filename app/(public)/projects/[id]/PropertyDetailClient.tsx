"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, Check, ChevronLeft, ChevronRight,
  Car, Sofa, CalendarDays, LandPlot, Building2
} from "lucide-react";
import type { Property } from "@/lib/types";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyContactCard from "@/components/properties/PropertyContactCard";
import SaveButton from "@/components/properties/SaveButton";
import ShareButton from "@/components/ui/ShareButton";
import { propertyUrl } from "@/lib/urls";
import { areaForLocation, areaPath } from "@/lib/areas";

interface Props {
  property: Property;
  related: Property[];
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
];

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

export default function PropertyDetailClient({ property, related }: Props) {
  const images =
    property.images?.length > 0
      ? property.images
      : placeholderImages;

  const [activeImg, setActiveImg] = useState(0);
  const area = areaForLocation(property.location);

  const specs = [
    property.bedrooms != null && { icon: Bed, value: property.bedrooms, label: `Bedroom${property.bedrooms !== 1 ? "s" : ""}` },
    property.bathrooms != null && { icon: Bath, value: property.bathrooms, label: `Bathroom${property.bathrooms !== 1 ? "s" : ""}` },
    property.area != null && { icon: Maximize2, value: `${property.area} m²`, label: "Floor area" },
    property.land_size != null && { icon: LandPlot, value: `${property.land_size} m²`, label: "Land size" },
    property.parking != null && { icon: Car, value: property.parking, label: `Parking space${property.parking !== 1 ? "s" : ""}` },
    property.furnishing && { icon: Sofa, value: property.furnishing, label: "Furnishing" },
    property.year_built != null && { icon: CalendarDays, value: property.year_built, label: "Year built" },
    { icon: Building2, value: typeLabels[property.type], label: "Property type" },
  ].filter(Boolean) as { icon: typeof Bed; value: string | number; label: string }[];

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <section className="pt-24 sm:pt-28 bg-white">
        <div className="container-page">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-text-secondary mb-6 min-w-0">
            <Link href="/" className="hover:text-text-main transition-colors">Home</Link>
            <ChevronRight size={14} className="text-text-secondary/50 shrink-0" />
            <Link href="/projects" className="hover:text-text-main transition-colors">Properties</Link>
            <ChevronRight size={14} className="text-text-secondary/50 shrink-0" />
            <span className="text-text-main line-clamp-1">{property.title}</span>
          </nav>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease }}
            className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-4xl overflow-hidden bg-background"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={activeImg}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeImg]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={activeImg === 0}
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-5 left-5 flex gap-2 z-10">
              <span className="chip bg-white/90 text-text-main backdrop-blur-md">
                {statusLabels[property.status]}
              </span>
              <span className="chip bg-white/90 text-text-main backdrop-blur-md">
                {typeLabels[property.type]}
              </span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1))}
                  aria-label="Previous image"
                  className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-text-main flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1))}
                  aria-label="Next image"
                  className="absolute z-10 right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-text-main flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
                <span className="chip absolute z-10 bottom-5 right-5 bg-black/50 text-white backdrop-blur-md tabular-nums">
                  {activeImg + 1} / {images.length}
                </span>
              </>
            )}
          </motion.div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar p-1 -m-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`relative shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                    i === activeImg ? "ring-2 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="112px" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left — details */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-main leading-tight">
                  {property.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="shrink-0" />
                    {property.location}
                  </span>
                  {area && (
                    <Link
                      href={areaPath(area)}
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      About {area.name} &rarr;
                    </Link>
                  )}
                </div>
              </div>
              {/* Phones: price on its own line, buttons share the row below. sm+: right-aligned column. */}
              <div className="flex flex-col gap-3 sm:items-end shrink-0">
                {property.price && (
                  <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary break-words sm:whitespace-nowrap">
                    {property.price}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                  <SaveButton propertyId={property.id} variant="full" className="py-2.5 w-full sm:w-auto" />
                  <ShareButton
                    url={propertyUrl(property)}
                    title={property.title}
                    text={[property.price, property.location].filter(Boolean).join(" · ")}
                    storyImageUrl={`/og/story/${property.slug || property.id}`}
                    flyerUrl={`/flyer/${property.slug || property.id}`}
                    contentType="property"
                    className="py-2.5 w-full sm:w-auto"
                  />
                </div>
              </div>
            </motion.div>

            {/* Specs */}
            <div>
              <h2 className="text-sm font-semibold text-text-main mb-4">Property details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specs.map(({ icon: Icon, value, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease }}
                    className="rounded-3xl bg-background p-5"
                  >
                    <Icon size={18} className="text-primary mb-6" />
                    <p className="font-semibold text-text-main">{value}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {property.description && (
              <div className="pt-12 border-t border-line">
                <h2 className="text-sm font-semibold text-text-main mb-4">About this property</h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line text-[15px]">
                  {property.description}
                </p>
              </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div className="pt-12 border-t border-line">
                <h2 className="text-sm font-semibold text-text-main mb-5">Amenities &amp; features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-primary" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-text-main">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — enquiry / viewing */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="lg:sticky lg:top-28"
            >
              <PropertyContactCard property={property} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {related.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-t border-line">
          <div className="container-page">
            <h2 className="heading-lg mb-10">Similar properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
