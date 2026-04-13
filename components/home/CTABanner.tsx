"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-0.5 w-12 bg-accent mx-auto mb-6" />
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Your Journey{" "}
            <span className="text-accent">Today</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you are buying, selling, or investing — our team of expert
            agents is ready to guide you. Reach out and let&apos;s find the
            right property together.
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
              className="bg-transparent text-white border border-white/30 font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
            >
              Browse Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
