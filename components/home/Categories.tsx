"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

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
    description: "Homes, apartments and townhouses.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    key: "commercial" as const,
    label: "Commercial",
    description: "Offices, retail units and warehouses.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    key: "land" as const,
    label: "Land",
    description: "Prime plots for development and investment.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
];

export default function Categories({ counts }: CategoriesProps) {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container-page">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-4">Browse by category</p>
            <h2 className="heading-lg max-w-lg">What are you looking for?</h2>
          </div>
          <p className="text-text-secondary max-w-sm leading-relaxed">
            Explore our portfolio of residential, commercial and land listings
            across Greater Accra.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/projects?type=${cat.key}`}
                className="group relative block rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[3/4]"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <span className="chip absolute top-5 left-5 bg-white/90 text-text-main backdrop-blur-md">
                  {counts[cat.key]} listing{counts[cat.key] !== 1 ? "s" : ""}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {cat.label}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">{cat.description}</p>
                  </div>
                  <span className="w-11 h-11 shrink-0 rounded-full bg-white text-text-main flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
