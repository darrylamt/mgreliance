"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, CheckCircle, ChevronLeft,
  ChevronRight, Send, Phone, Mail, User, MessageSquare, Loader2, AlertCircle
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

const statusColors: Record<string, string> = {
  available: "bg-accent text-white",
  rented: "bg-primary text-white",
  sold: "bg-gray-400 text-white",
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

  return (
    <>
      {/* Hero Image Gallery */}
      <section className="pt-20 bg-primary">
        <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <Image
            src={images[activeImg]}
            alt={property.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Status + Type */}
          <div className="absolute top-6 left-6 flex gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[property.status]}`}>
              {statusLabels[property.status]}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-primary">
              {typeLabels[property.type]}
            </span>
          </div>

          {/* Image Nav */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                disabled={activeImg === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveImg((i) => Math.min(images.length - 1, i + 1))}
                disabled={activeImg === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all ${i === activeImg ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="bg-primary/90 px-4 py-3">
            <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImg ? "border-accent" : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-primary transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-text-main line-clamp-1">{property.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left — details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-text-secondary mb-4">
                  <MapPin size={16} className="text-accent shrink-0" />
                  <span>{property.location}</span>
                </div>
                {property.price && (
                  <p className="font-playfair text-2xl font-bold text-primary">
                    {property.price}
                  </p>
                )}
              </motion.div>

              {/* Specs */}
              {(property.bedrooms || property.bathrooms || property.area) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-5">
                    Property Details
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {property.bedrooms != null && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Bed size={20} className="text-primary" />
                        </div>
                        <p className="font-semibold text-text-main">{property.bedrooms}</p>
                        <p className="text-xs text-text-secondary">Bedroom{property.bedrooms !== 1 ? "s" : ""}</p>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Bath size={20} className="text-primary" />
                        </div>
                        <p className="font-semibold text-text-main">{property.bathrooms}</p>
                        <p className="text-xs text-text-secondary">Bathroom{property.bathrooms !== 1 ? "s" : ""}</p>
                      </div>
                    )}
                    {property.area != null && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Maximize2 size={20} className="text-primary" />
                        </div>
                        <p className="font-semibold text-text-main">{property.area}</p>
                        <p className="text-xs text-text-secondary">m² Area</p>
                      </div>
                    )}
                    {property.type && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <span className="text-primary font-bold text-xs">{typeLabels[property.type][0]}</span>
                        </div>
                        <p className="font-semibold text-text-main">{typeLabels[property.type]}</p>
                        <p className="text-xs text-text-secondary">Property Type</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Description */}
              {property.description && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                    About This Property
                  </h3>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </motion.div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                    Amenities & Features
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-accent shrink-0" />
                        <span className="text-sm text-text-main">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right — enquiry form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Agent Card */}
                {property.agent_name && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 mb-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">
                          {property.agent_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-text-main">{property.agent_name}</p>
                        <p className="text-xs text-text-secondary">MG Reliance Agent</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enquiry Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <h3 className="font-playfair text-xl font-semibold text-text-main mb-5">
                    Enquire About This Property
                  </h3>

                  {sent ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={28} className="text-green-500" />
                      </div>
                      <p className="font-semibold text-text-main mb-2">Enquiry Sent!</p>
                      <p className="text-text-secondary text-sm">
                        Our team will get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquire} className="space-y-4">
                      {sendError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                          <AlertCircle size={14} className="shrink-0" />
                          {sendError}
                        </div>
                      )}

                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="full_name"
                          type="text"
                          required
                          placeholder="Your Name"
                          value={form.full_name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="Email Address"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="phone"
                          type="tel"
                          placeholder="Phone (optional)"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div className="relative">
                        <MessageSquare size={15} className="absolute left-3.5 top-4 text-gray-400" />
                        <textarea
                          name="message"
                          rows={4}
                          required
                          value={form.message}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70"
                      >
                        {sending ? (
                          <><Loader2 size={16} className="animate-spin" /> Sending…</>
                        ) : (
                          <><Send size={15} /> Send Enquiry</>
                        )}
                      </button>

                      <p className="text-xs text-text-secondary text-center">
                        Or call us:{" "}
                        <a href="tel:+233000000000" className="text-primary font-semibold">
                          +233 000 000 000
                        </a>
                      </p>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-text-main mb-8">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
