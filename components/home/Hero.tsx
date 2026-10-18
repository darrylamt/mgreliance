"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2 } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { AREAS } from "@/lib/areas";

const LOCATIONS = AREAS.map((a) => a.name);

const ease = [0.22, 1, 0.36, 1] as const;

const HEADLINE = [["Find", "your", "place"], ["in", "Accra."]];

export default function Hero() {
  const router = useRouter();
  const [status, setStatus] = useState<"available" | "rented">("available");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  // Content sits at the bottom of the hero, so keep it solid until it's nearly scrolled away.
  const contentOpacity = useTransform(scrollYProgress, [0.45, 0.85], [1, 0]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("status", status);
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    router.push(`/projects?${params.toString()}`);
  };

  let wordIndex = 0;

  return (
    <section ref={sectionRef} className="p-2 sm:p-3 bg-white">
      <div className="relative min-h-[calc(100svh-1rem)] sm:min-h-[calc(100svh-1.5rem)] rounded-4xl overflow-hidden flex items-end">
        {/* Background with parallax + slow zoom */}
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease }}
            className="absolute inset-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
              alt="Luxury property in Accra, Ghana"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/25" />

        {/* Content */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative z-10 w-full container-page pt-32 pb-10 sm:pb-14"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs font-medium text-white/90 mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Trusted real estate in Ghana since 2010
          </motion.p>

          <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[5.5rem] font-semibold tracking-tight text-white max-w-4xl">
            {HEADLINE.map((line, li) => (
              <span key={li} className="block">
                {line.map((word) => {
                  const i = wordIndex++;
                  return (
                    <span key={word} className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.22em]">
                      <motion.span
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease }}
                        className={`inline-block ${word === "place" ? "text-accent" : ""}`}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease }}
              className="text-white/75 text-base sm:text-lg max-w-md leading-relaxed"
            >
              Residential, commercial and land opportunities across Greater
              Accra — curated by MG Reliance Property Developers.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease }}
              className="flex gap-6 sm:gap-12"
            >
              {[
                { value: 15, suffix: "+", label: "Years" },
                { value: 500, suffix: "+", label: "Clients" },
                { value: 1000, suffix: "+", label: "Properties sold" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease }}
            className="mt-8 sm:mt-10 bg-white rounded-3xl lg:rounded-full p-2 shadow-2xl shadow-black/20 flex flex-col lg:flex-row lg:items-center gap-2 max-w-4xl"
          >
            {/* Status toggle */}
            <div className="relative flex bg-background rounded-full p-1 shrink-0">
              {(["available", "rented"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`relative flex-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    status === s ? "text-white" : "text-text-secondary hover:text-text-main"
                  }`}
                >
                  {status === s && (
                    <motion.span
                      layoutId="hero-status"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  )}
                  <span className="relative">{s === "available" ? "Buy" : "Rent"}</span>
                </button>
              ))}
            </div>

            <label className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-full hover:bg-background transition-colors cursor-pointer">
              <MapPin size={16} className="text-text-secondary shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
                className="w-full bg-transparent text-sm font-medium text-text-main focus:outline-none cursor-pointer"
              >
                <option value="">All locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </label>

            <div className="hidden lg:block w-px h-6 bg-line" />

            <label className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-full hover:bg-background transition-colors cursor-pointer">
              <Building2 size={16} className="text-text-secondary shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                aria-label="Property type"
                className="w-full bg-transparent text-sm font-medium text-text-main focus:outline-none cursor-pointer"
              >
                <option value="">All property types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </label>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              className="btn btn-primary btn-lg shrink-0"
            >
              <Search size={16} />
              Search
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
