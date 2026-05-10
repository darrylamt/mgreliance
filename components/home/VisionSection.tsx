"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const LEFT_IMAGE =
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=85";
const RIGHT_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85";

export default function VisionSection() {
  return (
    <section className="relative py-24 bg-[#f5f3f0] overflow-hidden">
      {/* Left image — bleeds from the left edge */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[38%] h-[520px] hidden lg:block rounded-r-3xl overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={LEFT_IMAGE}
          alt="Luxury villa"
          fill
          className="object-cover"
          sizes="38vw"
        />
        {/* Fade toward center */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f5f3f0]" />
        {/* Bottom fade to background */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
      </div>

      {/* Right image — bleeds from the right edge */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[38%] h-[520px] hidden lg:block rounded-l-3xl overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={RIGHT_IMAGE}
          alt="Contemporary home"
          fill
          className="object-cover"
          sizes="38vw"
        />
        {/* Fade toward center */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f5f3f0]" />
        {/* Bottom fade to background */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
      </div>

      {/* Center — text content */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        {/* Mobile images (stacked) */}
        <div className="flex gap-3 mb-10 lg:hidden">
          <div className="flex-1 h-48 rounded-2xl overflow-hidden relative">
            <Image src={LEFT_IMAGE} alt="Luxury villa" fill className="object-cover" sizes="50vw" />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="flex-1 h-48 rounded-2xl overflow-hidden relative">
            <Image src={RIGHT_IMAGE} alt="Contemporary home" fill className="object-cover" sizes="50vw" />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-block text-accent text-xs font-semibold uppercase tracking-widest">
            MG Reliance Property Developers
          </span>

          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-text-main leading-tight">
            If you can dream it,{" "}
            <em className="italic text-primary">we can find it.</em>
          </h2>

          <p className="text-text-secondary leading-relaxed text-base max-w-md mx-auto">
            We take a uniquely personal approach to every client — understanding your
            vision and delivering properties that match it. Renowned for our deep
            knowledge of Greater Accra&apos;s finest locations and our commitment to
            making every transaction seamless.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/projects"
              className="bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="text-primary font-semibold text-sm hover:text-accent transition-colors"
            >
              Get in touch →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
