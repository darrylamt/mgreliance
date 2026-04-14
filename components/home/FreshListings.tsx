"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
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
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
              Latest Listings
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main">
              Fresh on the Market
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  active === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-main"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-16 text-text-secondary">
                No properties in this category yet.
              </div>
            ) : (
              filtered.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 group"
          >
            View All Properties
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
