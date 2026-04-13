"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const highlights = [
  "Over 15 years of market expertise in Greater Accra",
  "Dedicated team of experienced, licensed agents",
  "Transparent process from search to closing",
  "Proud to have helped 500+ Ghanaian families",
];

export default function AboutPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative h-[450px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="MG Reliance team meeting with clients"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-6 bg-accent text-white p-6 rounded-xl shadow-xl max-w-[200px]">
              <div className="font-playfair text-4xl font-bold">2010</div>
              <div className="text-sm text-white/80 mt-1">
                Founded in Accra, Ghana
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="h-0.5 w-12 bg-accent mb-4" />
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-5">
                A Legacy of Trust in Accra Real Estate
              </h2>
            </div>

            <p className="text-text-secondary leading-relaxed">
              MG Reliance Property Developers was founded in 2010 by Wisdom
              Geotrah with a simple but powerful mission: to make homeownership
              accessible and investment straightforward for every Ghanaian family
              and individual.
            </p>

            <p className="text-text-secondary leading-relaxed">
              Today, we are one of Greater Accra&apos;s most trusted agencies —
              specialising in residential and commercial properties, with a
              dedicated team that guides clients through every step of their
              property journey.
            </p>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle
                    size={18}
                    className="text-accent shrink-0"
                  />
                  <span className="text-text-secondary text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
