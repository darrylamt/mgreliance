"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, X, Search, ChevronDown, Link2, Check } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import PageHeader from "@/components/ui/PageHeader";
import CTABanner from "@/components/home/CTABanner";
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

  // Mirror filters into the URL so searches can be shared, bookmarked and indexed.
  // history.replaceState is integrated with the App Router (Next 14.1+): no server round trip.
  const pathname = usePathname();
  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (status) params.set("status", status);
      if (location.trim()) params.set("location", location.trim());
      if (sort && sort !== "newest") params.set("sort", sort);
      const qs = params.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      if (next !== `${window.location.pathname}${window.location.search}`) {
        window.history.replaceState(null, "", next);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [type, status, location, sort, pathname]);

  const hasFilters = type || status || location;

  const [copied, setCopied] = useState(false);
  const shareSearch = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: "Properties on MG Reliance", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // User cancelled the share sheet or clipboard is blocked — nothing to do.
    }
  };

  const clearFilters = () => {
    setType("");
    setStatus("");
    setLocation("");
    setSort("newest");
  };

  return (
    <>
      <PageHeader
        eyebrow="Properties"
        title="Find a place that fits."
        description="A curated selection of residential, commercial and land opportunities across Greater Accra."
        crumbs={[{ label: "Properties" }]}
      />

      {/* Filter Bar */}
      <section className="lg:sticky lg:top-[5.25rem] z-30 bg-white/85 backdrop-blur-xl">
        <div className="container-page py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type tabs */}
            <div className="w-full sm:w-auto flex items-center gap-1 bg-background rounded-full p-1 max-w-full overflow-x-auto hide-scrollbar">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                    type === t.key ? "text-text-main" : "text-text-secondary hover:text-text-main"
                  }`}
                >
                  {type === t.key && (
                    <motion.span
                      layoutId="projects-type"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-white shadow-soft"
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Status"
                className="w-full appearance-none rounded-full border border-line bg-white pl-4 pr-9 py-2.5 text-sm font-medium text-text-main focus:outline-none focus:border-primary/60 cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            </div>

            {/* Sort */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort"
                className="w-full appearance-none rounded-full border border-line bg-white pl-4 pr-9 py-2.5 text-sm font-medium text-text-main focus:outline-none focus:border-primary/60 cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            </div>

            {/* Location search */}
            <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[180px] sm:max-w-xs order-first sm:order-none">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-full border border-line bg-white pl-10 pr-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary/70 focus:outline-none focus:border-primary/60"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-main hover:bg-background transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}

            <div className="w-full sm:w-auto sm:ml-auto flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
              <span className="text-sm text-text-secondary tabular-nums">
                {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"}
              </span>
              {hasFilters && (
                <button
                  onClick={shareSearch}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-text-main hover:bg-background transition-colors"
                >
                  {copied ? <Check size={14} className="text-primary" /> : <Link2 size={14} />}
                  {copied ? "Link copied" : "Share search"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-px bg-line" />
      </section>

      {/* Results */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-page">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 px-6 bg-background rounded-4xl"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Home size={22} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-text-main mb-2">
                No properties found
              </h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
                Try adjusting your filters or{" "}
                <button onClick={clearFilters} className="text-text-main font-medium underline underline-offset-4">clear them</button>
                {" "}to see all listings.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Contact us
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {filtered.map((property, index) => (
                <motion.div key={property.id} layout transition={{ duration: 0.35 }}>
                  <PropertyCard property={property} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <CTABanner
        title="Don't see what you're looking for?"
        description="Tell us what you need and our team will find the right property for you."
        primary={{ href: "/contact", label: "Contact our team" }}
        secondary={null}
      />
    </>
  );
}
