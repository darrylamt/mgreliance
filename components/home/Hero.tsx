"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
        alt="Luxury property in Accra, Ghana"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-0.5 w-16 bg-accent mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-accent text-sm font-semibold uppercase tracking-widest mb-4"
        >
          East Legon, Accra — Ghana
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Find Your Perfect
          <br />
          <span className="text-accent">Property in Accra</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          Your trusted partner in residential and commercial real estate.
          Connecting families and investors with exceptional properties across
          Greater Accra.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/projects"
            className="bg-accent text-white font-semibold px-8 py-4 rounded-xl hover:bg-accent/90 transition-all duration-200 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            View Our Projects
          </Link>
          <Link
            href="/contact"
            className="bg-white/10 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 text-base"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-white/30 rounded-full"
        />
      </motion.div>
    </section>
  );
}
