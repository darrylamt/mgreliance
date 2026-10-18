"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const highlights = [
  "15+ years of market expertise in Greater Accra",
  "A dedicated team of experienced, licensed agents",
  "A transparent process from search to closing",
  "500+ Ghanaian families helped home",
];

export default function AboutPreview() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <Reveal className="relative">
            <div ref={imageRef} className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-4xl overflow-hidden">
              <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=80"
                  alt="MG Reliance team meeting with clients"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-3xl px-6 py-5 shadow-soft"
            >
              <p className="text-3xl font-semibold tracking-tight text-text-main">2010</p>
              <p className="text-sm text-text-secondary mt-0.5">Founded in Accra, Ghana</p>
            </motion.div>
          </Reveal>

          {/* Text */}
          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">Our story</p>
            <h2 className="heading-lg">A legacy of trust in Accra real estate.</h2>

            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                MG Reliance Property Developers was founded in 2010 by Wisdom
                Geotrah with a simple mission: to make homeownership accessible
                and investment straightforward for every Ghanaian family.
              </p>
              <p>
                Today we are one of Greater Accra&apos;s most trusted agencies,
                guiding clients through every step of their property journey.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check size={13} className="text-primary" strokeWidth={2.5} />
                  </span>
                  <span className="text-text-main text-sm">{item}</span>
                </motion.li>
              ))}
            </ul>

            <Link href="/about" className="btn btn-primary mt-10 group">
              More about us
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
