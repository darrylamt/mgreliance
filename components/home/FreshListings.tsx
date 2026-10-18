"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import type { Property } from "@/lib/types";

interface FreshListingsProps {
  properties: Property[];
}

const TABS = [
  { key: "all", label: "All" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "land", label: "Land" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function FreshListings({ properties }: FreshListingsProps) {
  const [active, setActive] = useState<TabKey>("all");

  const filtered =
    active === "all" ? properties : properties.filter((p) => p.type === active);

  if (properties.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container-page">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-4">Latest listings</p>
            <h2 className="heading-lg">Fresh on the market</h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-background rounded-full p-1 w-fit max-w-full overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                  active === tab.key ? "text-text-main" : "text-text-secondary hover:text-text-main"
                }`}
              >
                {active === tab.key && (
                  <motion.span
                    layoutId="fresh-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-white shadow-soft"
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 rounded-3xl bg-background text-text-secondary">
                No properties in this category yet.
              </div>
            ) : (
              filtered.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <Reveal className="text-center mt-14">
          <Link href="/projects" className="btn btn-secondary btn-lg group">
            View all properties
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
