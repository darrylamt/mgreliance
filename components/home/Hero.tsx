"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const LOCATIONS = [
  "East Legon",
  "Cantonments",
  "Airport Residential",
  "Labone",
  "Adjiringanor",
  "Trasacco Valley",
  "Tema",
  "Spintex",
  "Achimota",
  "Accra Central",
];

export default function Hero() {
  const router = useRouter();
  const [status, setStatus] = useState<"available" | "rented">("available");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("status", status);
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
        alt="Luxury property in Accra, Ghana"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-6"
        >
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          Trusted Real Estate in Ghana
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Find Your Dream
          <br />
          <span className="text-accent">Property</span> in Accra
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          Residential, commercial & land opportunities across Greater Accra —
          curated by MG Reliance Property Developers.
        </motion.p>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto"
        >
          {/* Status Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3 w-fit mx-auto">
            {(["available", "rented"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  status === s
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-main"
                }`}
              >
                {s === "available" ? "For Sale" : "For Rent"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
              <MapPin size={15} className="text-accent shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-text-main focus:outline-none"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent text-sm text-text-main focus:outline-none"
              >
                <option value="">All Property Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors shrink-0"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-14"
        >
          {[
            { value: "15+", label: "Years Experience" },
            { value: "500+", label: "Happy Clients" },
            { value: "1,000+", label: "Properties Sold" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-playfair text-3xl font-bold text-accent">{stat.value}</p>
              <p className="text-white/55 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
