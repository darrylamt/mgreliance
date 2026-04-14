"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoriesProps {
  counts: {
    residential: number;
    commercial: number;
    land: number;
  };
}

const categories = [
  {
    key: "residential" as const,
    label: "Residential",
    description: "Luxury homes, apartments & townhouses for families and individuals.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    key: "commercial" as const,
    label: "Commercial",
    description: "Office spaces, retail units & warehouses for growing businesses.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    key: "land" as const,
    label: "Land",
    description: "Prime plots and land parcels for development and investment.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
];

export default function Categories({ counts }: CategoriesProps) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Browse by Category
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-4">
            What Are You Looking For?
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Explore our portfolio across residential, commercial, and land categories
            — all located across Greater Accra.
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <Link
                href={`/projects?type=${cat.key}`}
                className="group relative block rounded-2xl overflow-hidden h-72 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
                    {counts[cat.key]} Listing{counts[cat.key] !== 1 ? "s" : ""}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 text-accent text-sm font-semibold">
                    Explore {cat.label}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
