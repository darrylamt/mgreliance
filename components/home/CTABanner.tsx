"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
        alt="Property background"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/90" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Ready to Begin?
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Let&apos;s Find Your Perfect{" "}
            <span className="text-accent">Property</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you are buying, selling, or investing — our team of expert agents
            is ready to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-accent text-white font-semibold px-8 py-4 rounded-xl hover:bg-accent/90 transition-all duration-200 text-base shadow-lg"
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="bg-white/10 text-white border border-white/30 font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 text-base"
            >
              Browse Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
