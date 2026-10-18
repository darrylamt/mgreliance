"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, Check, ChevronLeft, ChevronRight,
  Phone, Loader2, AlertCircle, ArrowUpRight,
  Car, Sofa, CalendarDays, LandPlot, Building2
} from "lucide-react";
import type { Property } from "@/lib/types";
import PropertyCard from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/client";

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

  // Enquiry form
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in "${property.title}". Please contact me with more details.`,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEnquire = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_submissions").insert([{
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: `Enquiry: ${property.title}`,
        message: form.message.trim(),
        property_id: property.id,
      }]);

      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

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
                <div className="mt-3 flex items-center gap-1.5 text-text-secondary">
                  <MapPin size={15} className="shrink-0" />
                  <span>{property.location}</span>
                </div>
              </div>
              {property.price && (
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary whitespace-nowrap">
                  {property.price}
                </p>
              )}
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

          {/* Right — enquiry form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="lg:sticky lg:top-28 bg-background rounded-4xl p-6 sm:p-7"
            >
              <h3 className="text-xl font-semibold tracking-tight text-text-main">
                Interested?
              </h3>
              <p className="text-sm text-text-secondary mt-1 mb-6">
                Send an enquiry and we&apos;ll be in touch within 24 hours.
              </p>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 bg-white rounded-3xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                      className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check size={26} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                    <p className="font-semibold text-text-main mb-1">Enquiry sent</p>
                    <p className="text-text-secondary text-sm">
                      Our team will get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" exit={{ opacity: 0 }} onSubmit={handleEnquire} className="space-y-3">
                    {sendError && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-2xl p-3 text-sm">
                        <AlertCircle size={14} className="shrink-0" />
                        {sendError}
                      </div>
                    )}

                    <input
                      name="full_name"
                      type="text"
                      required
                      placeholder="Your name"
                      aria-label="Your name"
                      value={form.full_name}
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email address"
                      aria-label="Email address"
                      value={form.email}
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone (optional)"
                      aria-label="Phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="input"
                    />
                    <textarea
                      name="message"
                      rows={4}
                      required
                      aria-label="Message"
                      value={form.message}
                      onChange={handleChange}
                      className="input resize-none"
                    />

                    <button type="submit" disabled={sending} className="btn btn-primary btn-lg w-full">
                      {sending ? (
                        <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      ) : (
                        <>Send enquiry <ArrowUpRight size={16} /></>
                      )}
                    </button>

                    <a href="tel:+233244274630" className="btn btn-secondary w-full">
                      <Phone size={15} />
                      +233 24 427 4630
                    </a>
                  </motion.form>
                )}
              </AnimatePresence>
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
