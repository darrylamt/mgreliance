"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilter from "@/components/properties/PropertyFilter";
import type { Property } from "@/lib/types";

type FilterValue = "all" | "residential" | "commercial" | "land";

interface ProjectsClientProps {
  properties: Property[];
}

export default function ProjectsClient({ properties }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filtered =
    activeFilter === "all"
      ? properties
      : properties.filter((p) => p.type === activeFilter);

  return (
    <div>
      {/* Filter Tabs */}
      {properties.length > 0 && (
        <div className="mb-10">
          <PropertyFilter
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      )}

      {/* Grid or Empty State */}
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
            Listings Coming Soon
          </h3>
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
            Our current listings are being updated. Contact us to learn about
            available properties and let our team find the right match for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <MessageCircle size={16} />
            Get in Touch
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
