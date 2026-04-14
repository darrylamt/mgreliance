"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Property } from "@/lib/types";

interface ProjectsClientProps {
  properties: Property[];
  initialType?: string;
  initialStatus?: string;
  initialLocation?: string;
  initialSort?: string;
}

const TYPES = [
  { key: "", label: "All Types" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "land", label: "Land" },
];

const STATUSES = [
  { key: "", label: "Any Status" },
  { key: "available", label: "For Sale" },
  { key: "rented", label: "For Rent" },
  { key: "sold", label: "Sold" },
];

const SORTS = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
];

export default function ProjectsClient({
  properties,
  initialType = "",
  initialStatus = "",
  initialLocation = "",
  initialSort = "newest",
}: ProjectsClientProps) {
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
  const [location, setLocation] = useState(initialLocation);
  const [sort, setSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...properties];

    if (type) result = result.filter((p) => p.type === type);
    if (status) result = result.filter((p) => p.status === status);
    if (location) {
      const q = location.toLowerCase();
      result = result.filter((p) => p.location?.toLowerCase().includes(q));
    }

    switch (sort) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price_asc":
        result.sort((a, b) => {
          const pa = parseFloat((a.price || "0").replace(/[^0-9.]/g, ""));
          const pb = parseFloat((b.price || "0").replace(/[^0-9.]/g, ""));
          return pa - pb;
        });
        break;
      case "price_desc":
        result.sort((a, b) => {
          const pa = parseFloat((a.price || "0").replace(/[^0-9.]/g, ""));
          const pb = parseFloat((b.price || "0").replace(/[^0-9.]/g, ""));
          return pb - pa;
        });
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [properties, type, status, location, sort]);

  const hasFilters = type || status || location;

  const clearFilters = () => {
    setType("");
    setStatus("");
    setLocation("");
    setSort("newest");
  };

  return (
    <>
      {/* Page Hero */}
      <section className="relative pt-40 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Properties</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Properties
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Explore our curated selection of residential, commercial, and land
            opportunities across Greater Accra.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    type === t.key
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-main"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary bg-white"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>

            {/* Location search */}
            <input
              type="text"
              placeholder="Search location…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary min-w-0 w-40"
            />

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-red-500 transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}

            <div className="ml-auto text-sm text-text-secondary">
              {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-2xl border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Home size={28} className="text-primary" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-text-main mb-3">
                No Properties Found
              </h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
                Try adjusting your filters or{" "}
                <button onClick={clearFilters} className="text-primary underline">clear them</button>
                {" "}to see all listings.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <MessageCircle size={16} />
                Contact Us
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-4">
            Don&apos;t See What You&apos;re Looking For?
          </h2>
          <p className="text-white/70 mb-6">
            Tell us what you need and our team will find the right property for you.
          </p>
          <Link
            href="/contact"
            className="bg-accent text-white font-semibold px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors inline-block"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </>
  );
}
